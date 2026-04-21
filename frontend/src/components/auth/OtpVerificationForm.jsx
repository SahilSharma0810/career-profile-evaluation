import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ShieldCheck, ArrowLeft, CheckCircle, WarningCircle } from 'phosphor-react';
import { PrimaryButton, LoadingSpinner } from './ui';
import tracker from '../../utils/tracker';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--white);
  border: 1px solid var(--line);
  padding: 32px;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 540px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--ink3);
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  transition: color 0.2s ease;

  &:hover { color: var(--ink); }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  color: #059669;
`;

const FormTitle = styled.h2`
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 8px 0;
`;

const FormSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0;
  line-height: 1.5;
`;

const PhoneHighlight = styled.span`
  color: var(--ink);
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  @media (max-width: 400px) {
    gap: 6px;
  }
`;

const SingleOtpInput = styled.input`
  width: 100%;
  max-width: 320px;
  height: 56px;
  padding: 0 14px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : props.filled ? 'var(--accent)' : 'var(--line)'};
  background: ${props => props.filled ? '#EFF4FF' : 'var(--white)'};
  font-family: var(--mono);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink);
  text-align: center;
  letter-spacing: 6px;
  transition: all 0.2s ease;
  caret-color: var(--accent);

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : 'var(--accent)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.08)' : 'rgba(37, 99, 235, 0.1)'};
    background: var(--white);
  }

  &:disabled {
    background: var(--bg);
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    height: 50px;
    font-size: 1.2rem;
    letter-spacing: 5px;
  }

  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #dc2626;
  animation: ${shake} 0.3s ease-in-out;
  text-align: center;

  svg { flex-shrink: 0; }
`;

const SuccessMessage = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #dcfce7;
  border: 1px solid #86efac;
  font-size: 0.875rem;
  color: #166534;
  font-weight: 500;
  justify-content: center;
  animation: ${pulse} 0.3s ease-in-out;
`;

const ErrorBanner = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-left: 3px solid #dc2626;
  font-size: 0.875rem;
  color: #991b1b;
  font-weight: 500;
  animation: ${shake} 0.4s ease-in-out;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

const OtpVerificationForm = ({
  phoneNumber = '',
  onSubmit,
  onBack,
  submitStatus = 'idle',
  errorMessage = '',
  successMessage = '',
  flowType = 'login'
}) => {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRef = useRef(null);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const displayError = errorMessage || localError;

  useEffect(() => {
    setResendTimer(RESEND_COOLDOWN);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return `+91 ${cleaned}`;
  };

  const handleChange = useCallback((value) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(digitsOnly);
    setLocalError('');
  }, []);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pastedData) {
      setOtp(pastedData);
      setLocalError('');
      inputRef.current?.focus();
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const otpString = otp;
    if (otpString.length !== OTP_LENGTH) {
      setLocalError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }
    onSubmit?.(otpString);
  }, [otp, onSubmit]);

  const otpFilled = otp.length === OTP_LENGTH;

  return (
    <FormContainer>
      {onBack && (
        <BackButton type="button" onClick={onBack}>
          <ArrowLeft size={16} weight="bold" />
          Back
        </BackButton>
      )}

      <FormHeader>
        <IconWrapper>
          <ShieldCheck size={28} weight="fill" />
        </IconWrapper>
        <FormTitle>Verify Your Number</FormTitle>
        <FormSubtitle>
          We've sent a {OTP_LENGTH}-digit code to{' '}
          <PhoneHighlight>{formatPhoneDisplay(phoneNumber)}</PhoneHighlight>
        </FormSubtitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage>
          <CheckCircle size={18} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {displayError && !isSuccess && (
        <ErrorBanner>
          <WarningCircle size={18} weight="fill" />
          {displayError}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <OtpContainer>
          <SingleOtpInput
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => {
              if (e.target.value) {
                tracker.click({
                  click_type: flowType === 'signup' ? 'signup_otp_filled' : 'login_otp_filled',
                  click_text: e.target.value
                });
              }
            }}
            onPaste={handlePaste}
            hasError={!!displayError}
            filled={otp.length > 0}
            disabled={isLoading || isSuccess}
            autoComplete="one-time-code"
            aria-label={`${OTP_LENGTH}-digit OTP`}
            placeholder={'•'.repeat(OTP_LENGTH)}
          />
        </OtpContainer>

        <ButtonGroup>
          <PrimaryButton
            type="submit"
            disabled={isLoading || isSuccess || !otpFilled}
          >
            {isLoading ? (
              <><LoadingSpinner /> Verifying...</>
            ) : isSuccess ? (
              <><CheckCircle size={18} weight="fill" /> Verified</>
            ) : (
              'Verify OTP'
            )}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default OtpVerificationForm;
