import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Envelope, Lock, Eye, EyeSlash, SignIn, CheckCircle, WarningCircle } from 'phosphor-react';
import { PrimaryButton, LoadingSpinner } from './ui';
import { validateEmail } from '../../utils/validation';
import TurnstileWidget from '../../utils/Turnstile';
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

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  width: 52px;
  height: 52px;
  background: #EFF4FF;
  border: 1px solid #BFDBFE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  color: var(--accent);
`;

const FormTitle = styled.h2`
  font-family: var(--serif);
  font-size: 1.625rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 6px 0;
`;

const FormSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--ink3);
  margin: 0;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--ink3);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 4px;

  span.required { color: #dc2626; }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.hasError ? '#dc2626' : props.focused ? 'var(--accent)' : 'var(--ink4)'};
  transition: color 0.2s ease;
  pointer-events: none;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : 'var(--line)'};
  background: var(--white);
  font-family: var(--sans);
  font-size: 0.9375rem;
  color: var(--ink);
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : 'var(--accent)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.08)' : 'rgba(37, 99, 235, 0.08)'};
  }

  &::placeholder { color: var(--ink4); }
  &:disabled { background: var(--bg); cursor: not-allowed; }
`;

const ToggleVisibility = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--ink3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover { color: var(--ink); }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: #dc2626;
  animation: ${shake} 0.3s ease-in-out;

  svg { flex-shrink: 0; }
`;

const SuccessMessage = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #dcfce7;
  border: 1px solid #86efac;
  font-size: 0.875rem;
  color: #166534;
  font-weight: 500;
`;

const ErrorBanner = styled.div.attrs({ role: 'alert', 'aria-live': 'polite' })`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
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
  gap: 10px;
  margin-top: 6px;
`;

const SecondaryLink = styled.button`
  background: transparent;
  border: none;
  color: var(--ink3);
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s ease;
  text-align: center;

  &:hover { color: var(--accent); }
  span { color: var(--accent); font-weight: 600; }
`;

const EmailPasswordLoginForm = ({
  onSubmit,
  onPhoneLoginClick,
  submitStatus = 'idle',
  errorMessage = '',
  successMessage = '',
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileAppearance, setTurnstileAppearance] = useState('interaction-only');
  const turnstileRef = useRef(null);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const isError = submitStatus === 'error';

  const validateFields = useCallback(() => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  }, [email, password]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!turnstileToken) {
      setTurnstileAppearance('always');
      return;
    }
    if (!validateFields()) return;
    onSubmit?.(email.trim(), password, turnstileToken);
    if (turnstileRef.current && typeof turnstileRef.current.reset === 'function') {
      turnstileRef.current.reset();
    }
    setTurnstileToken('');
  }, [email, password, validateFields, onSubmit, turnstileToken]);

  const displayEmailError = !!emailError;
  const displayPasswordError = !!passwordError;

  return (
    <FormContainer>
      <FormHeader>
        <IconWrapper>
          <SignIn size={28} weight="fill" />
        </IconWrapper>
        <FormTitle>Log in with Email</FormTitle>
        <FormSubtitle>Use your email and password to continue</FormSubtitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage>
          <CheckCircle size={18} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {isError && errorMessage && !displayEmailError && !displayPasswordError && (
        <ErrorBanner>
          <WarningCircle size={18} weight="fill" />
          {errorMessage}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="email">Email Address <span className="required">*</span></Label>
          <InputWrapper>
            <InputIcon hasError={displayEmailError} focused={emailFocused}>
              <Envelope size={18} weight="regular" />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
              onBlur={(e) => {
                if (!validateEmail(email)) {
                  setEmailError('Please enter a valid email');
                  setEmailFocused(false);
                }
                if (e.target.value) {
                  tracker.click({ click_type: 'email_login_email_filled', click_text: e.target.value });
                }
              }}
              onFocus={() => { setEmailFocused(true); if (!turnstileToken) setTurnstileAppearance('always'); }}
              hasError={displayEmailError}
              disabled={isLoading || isSuccess}
              autoComplete="email"
            />
          </InputWrapper>
          {displayEmailError && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {emailError}
            </ErrorMessage>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label htmlFor="password">Password <span className="required">*</span></Label>
          <InputWrapper>
            <InputIcon hasError={displayPasswordError} focused={passwordFocused}>
              <Lock size={18} weight="regular" />
            </InputIcon>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
              onBlur={(e) => {
                if (!password) {
                  setPasswordError('Password is required');
                  setPasswordFocused(false);
                }
                if (e.target.value) {
                  tracker.click({ click_type: 'email_login_password_filled', click_text: e.target.value });
                }
              }}
              onFocus={() => setPasswordFocused(true)}
              hasError={displayPasswordError}
              disabled={isLoading || isSuccess}
              autoComplete="current-password"
            />
            <ToggleVisibility
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </ToggleVisibility>
          </InputWrapper>
          {displayPasswordError && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {passwordError}
            </ErrorMessage>
          )}
        </FieldGroup>

        <TurnstileWidget
          ref={turnstileRef}
          onTokenObtained={setTurnstileToken}
          appearance={turnstileAppearance}
        />

        <ButtonGroup>
          <PrimaryButton type="submit" disabled={isLoading || isSuccess}>
            {isLoading ? (
              <><LoadingSpinner /> Signing in...</>
            ) : isSuccess ? (
              <><CheckCircle size={18} weight="fill" /> Signed in</>
            ) : (
              'Log in'
            )}
          </PrimaryButton>

          {onPhoneLoginClick && (
            <SecondaryLink type="button" onClick={onPhoneLoginClick}>
              Prefer OTP login? <span>Use phone number</span>
            </SecondaryLink>
          )}
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default EmailPasswordLoginForm;
