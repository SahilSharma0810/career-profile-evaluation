import React, { useState, useCallback, useEffect, useRef } from 'react';
import { signUp, verifySignUpOtp, resendOtp } from '../../api/authService';
import TurnstileWidget from '../../utils/Turnstile';
import { validatePhone, validateEmail } from '../../utils/validation';
import tracker from '../../utils/tracker';

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = (() => {
  const years = [];
  for (let y = CURRENT_YEAR + 5; y >= 1975; y--) years.push(y);
  return years;
})();

const REDIRECT_PATH = '/business-and-ai-readiness/quiz';

function maskPhone(digits) {
  if (!digits || digits.length !== 10) return '+91 \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7';
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

const LeadCard = ({ formId }) => {
  const [step, setStep] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grad_year: ''
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileAppearance, setTurnstileAppearance] = useState('interaction-only');
  const turnstileRef = useRef(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handlePhoneInput = useCallback((e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    handleChange('phone', digits);
  }, [handleChange]);

  const validateDetails = useCallback(() => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(formData.email)) e.email = 'Enter a valid email';
    if (!formData.phone) e.phone = 'Enter a 10-digit number';
    else if (!validatePhone(formData.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!formData.grad_year) e.grad_year = 'Select graduation year';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const handleDetailsSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!validateDetails()) return;

    if (!turnstileToken) {
      setTurnstileAppearance('always');
      setSubmitError('Please complete the verification.');
      return;
    }

    setSubmitStatus('loading');
    setSubmitError('');

    tracker.click({
      click_type: 'mba_lp_signup_submitted',
      click_source: `mba_landing_${formId}`
    });

    const result = await signUp({
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      grad_year: formData.grad_year,
      turnstile_token: turnstileToken
    });

    if (turnstileRef.current && typeof turnstileRef.current.reset === 'function') {
      turnstileRef.current.reset();
    }
    setTurnstileToken('');

    if (result.success) {
      setSubmitStatus('idle');
      setStep('otp');
      setResendCooldown(30);
      setTimeout(() => {
        if (otpRefs.current[0]) otpRefs.current[0].focus();
      }, 80);

      tracker.click({
        click_type: 'mba_lp_otp_requested',
        click_source: `mba_landing_${formId}`
      });
    } else {
      setSubmitStatus('error');
      setSubmitError(result.error || 'Could not send OTP. Please try again.');
    }
  }, [formData, turnstileToken, validateDetails, formId]);

  const handleOtpChange = useCallback((idx, value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 1);
    setOtp(prev => {
      const next = [...prev];
      next[idx] = cleaned;
      return next;
    });
    if (otpError) setOtpError('');
    if (cleaned && idx < 3 && otpRefs.current[idx + 1]) {
      otpRefs.current[idx + 1].focus();
    }
  }, [otpError]);

  const handleOtpKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1].focus();
      setOtp(prev => {
        const next = [...prev];
        next[idx - 1] = '';
        return next;
      });
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    const next = ['', '', '', ''];
    for (let i = 0; i < cleaned.length; i++) next[i] = cleaned[i];
    setOtp(next);
    const focusIdx = Math.min(cleaned.length, 3);
    if (otpRefs.current[focusIdx]) otpRefs.current[focusIdx].focus();
  }, []);

  const handleOtpSubmit = useCallback(async (event) => {
    event.preventDefault();
    const code = otp.join('');
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
      setOtpError('Enter the 4-digit code.');
      return;
    }
    setOtpError('');
    setSubmitStatus('loading');

    tracker.click({
      click_type: 'mba_lp_otp_submitted',
      click_source: `mba_landing_${formId}`
    });

    const result = await verifySignUpOtp(`+91-${formData.phone}`, code, formData.email);

    if (result.success) {
      setSubmitStatus('success');
      tracker.click({
        click_type: 'mba_lp_signup_success',
        click_source: `mba_landing_${formId}`
      });

      try {
        localStorage.setItem('mba_lp_grad_year', formData.grad_year);
      } catch (err) {
        // ignore localStorage failures
      }

      const appBasePath = '/career-profile-tool';
      setTimeout(() => {
        window.location.assign(`${appBasePath}${REDIRECT_PATH}`);
      }, 400);
    } else {
      setSubmitStatus('error');
      setOtpError(result.error || 'Invalid OTP. Please try again.');
    }
  }, [otp, formData.phone, formData.email, formId]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    const result = await resendOtp(`+91-${formData.phone}`, 'signup');
    if (!result.success) {
      setOtpError(result.error || 'Could not resend OTP.');
    }
  }, [formData.phone, resendCooldown]);

  const handleBack = useCallback(() => {
    setStep('details');
    setOtp(['', '', '', '']);
    setOtpError('');
    setSubmitStatus('idle');
  }, []);

  if (step === 'otp') {
    return (
      <div className="lead-card" id={`lead-card-${formId}`}>
        <div className="lead-card__step lead-card__step--active">
          <div className="lead-card__head">
            <button type="button" className="lead-card__back" onClick={handleBack} aria-label="Back to details">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Back
            </button>
            <p className="lead-card__eyebrow">Verify</p>
            <h2 className="lead-card__title">Enter the OTP</h2>
            <p className="lead-card__sub">We sent a 4-digit code to <strong>{maskPhone(formData.phone)}</strong></p>
          </div>

          <form className="lead-form" onSubmit={handleOtpSubmit} noValidate>
            <div className="otp-inputs" role="group" aria-label="OTP digits">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (otpRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`otp-digit${digit ? ' filled' : ''}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
            {otpError && <p className="lead-form__error" role="alert">{otpError}</p>}

            <button type="submit" className="lead-form__submit" disabled={submitStatus === 'loading'}>
              {submitStatus === 'loading' ? 'Verifying...' : submitStatus === 'success' ? 'Verified!' : 'Verify & start assessment'}
              <svg className="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>

            <p className="lead-form__resend">
              Didn't get it?{' '}
              <button type="button" className="lead-form__resend-btn" onClick={handleResend} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-card" id={`lead-card-${formId}`}>
      <div className="lead-card__step lead-card__step--active">
        <div className="lead-card__head">
          <p className="lead-card__eyebrow">Start free</p>
          <h2 className="lead-card__title">Get my report</h2>
          <p className="lead-card__sub">Takes 3 minutes. Report on-screen, instantly.</p>
        </div>

        <form className="lead-form" onSubmit={handleDetailsSubmit} noValidate>
          <div className="lead-roles-display" aria-label="Built for these roles">
            <p className="lead-roles-display__label">Built for</p>
            <div className="lead-roles-display__pills">
              {['Product Manager', 'Finance', 'Business Analyst', 'Sales', 'Marketing', 'Ops', 'Founder', 'Engineering'].map(r => (
                <span key={r} className="lead-role-pill">{r}</span>
              ))}
            </div>
          </div>

          <div className="lead-form__field">
            <label className="lead-form__label" htmlFor={`name-${formId}`}>Full name</label>
            <input
              type="text"
              id={`name-${formId}`}
              className="lead-phone-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              autoComplete="name"
              style={{ paddingLeft: 16 }}
            />
            {errors.name && <p className="lead-form__error" role="alert">{errors.name}</p>}
          </div>

          <div className="lead-form__field">
            <label className="lead-form__label" htmlFor={`email-${formId}`}>Email address</label>
            <input
              type="email"
              id={`email-${formId}`}
              className="lead-phone-input"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              style={{ paddingLeft: 16 }}
            />
            {errors.email && <p className="lead-form__error" role="alert">{errors.email}</p>}
          </div>

          <div className="lead-form__field">
            <label className="lead-form__label" htmlFor={`phone-${formId}`}>Mobile number</label>
            <div className="lead-phone-wrap">
              <span className="lead-phone-prefix" aria-hidden="true">+91</span>
              <input
                type="tel"
                id={`phone-${formId}`}
                className="lead-phone-input"
                placeholder="Enter your 10-digit number"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={handlePhoneInput}
                onFocus={() => { if (!turnstileToken) setTurnstileAppearance('always'); }}
                autoComplete="tel-national"
                aria-label="Phone number, India +91"
              />
            </div>
            {errors.phone && <p className="lead-form__error" role="alert">{errors.phone}</p>}
          </div>

          <div className="lead-form__field">
            <label className="lead-form__label" htmlFor={`grad-${formId}`}>Year of graduation</label>
            <select
              id={`grad-${formId}`}
              className="lead-phone-input"
              value={formData.grad_year}
              onChange={(e) => handleChange('grad_year', e.target.value)}
              style={{ paddingLeft: 16, appearance: 'auto' }}
            >
              <option value="">Select year</option>
              {GRAD_YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.grad_year && <p className="lead-form__error" role="alert">{errors.grad_year}</p>}
          </div>

          <TurnstileWidget
            ref={turnstileRef}
            onTokenObtained={setTurnstileToken}
            appearance={turnstileAppearance}
          />

          {submitError && <p className="lead-form__error" role="alert" style={{ marginTop: 8 }}>{submitError}</p>}

          <button type="submit" className="lead-form__submit" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Sending OTP...' : 'Continue'}
            <svg className="icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>

          <p className="lead-form__legal">
            By continuing you agree to receive an OTP and our <a href="https://www.scaler.com/privacy-policy/">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadCard;
