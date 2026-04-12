import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Phone, SignIn, CheckCircle, WarningCircle } from 'phosphor-react';
import { PrimaryButton, LoadingSpinner } from './ui';
import { validatePhone } from '../../utils/validation';
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

  span.required {
    color: #dc2626;
  }
`;

const PhoneInputWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const CountryCode = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--line);
  background: var(--bg);
  font-size: 0.875rem;
  color: var(--ink);
  font-weight: 500;
  white-space: nowrap;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
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
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 1px solid ${props => props.hasError ? '#dc2626' : 'var(--line)'};
  background: var(--white);
  font-family: var(--sans);
  font-size: 0.9375rem;
  color: var(--ink);
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : 'var(--accent)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.08)' : 'rgba(37, 99, 235, 0.08)'};
  }

  &::placeholder {
    color: var(--ink4);
    font-weight: 400;
    letter-spacing: normal;
  }

  &:disabled {
    background: var(--bg);
    cursor: not-allowed;
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
  transition: color 0.2s ease;
  text-align: center;

  &:hover {
    color: var(--accent);
  }

  span {
    color: var(--accent);
    font-weight: 600;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink4);
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }
`;

const SecondaryLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LoginForm = ({
  onSubmit,
  onSignUpClick,
  onEmailLoginClick,
  submitStatus = 'idle',
  errorMessage = '',
  successMessage = '',
  initialPhone = ''
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileAppearance, setTurnstileAppearance] = useState('interaction-only');
  const turnstileRef = useRef(null);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const isError = submitStatus === 'error';

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (error) setError('');
  }, [error]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setFocused(false);
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
    } else if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
    }
  }, [phoneNumber]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setTouched(true);

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!turnstileToken) {
      setTurnstileAppearance('always');
      setError('Please complete the verification');
      return;
    }

    onSubmit?.(phoneNumber, turnstileToken);
    if (turnstileRef.current && typeof turnstileRef.current.reset === 'function') {
      turnstileRef.current.reset();
    }
    setTurnstileToken('');
  }, [phoneNumber, onSubmit, turnstileToken]);

  const displayError = touched && (error || (isError && errorMessage));

  return (
    <FormContainer>
      <FormHeader>
        <IconWrapper>
          <SignIn size={28} weight="fill" />
        </IconWrapper>
        <FormTitle>Login</FormTitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage>
          <CheckCircle size={18} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {isError && errorMessage && !error && (
        <ErrorBanner>
          <WarningCircle size={18} weight="fill" />
          {errorMessage}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </Label>
          <PhoneInputWrapper>
            <CountryCode>
              <span role="img" aria-label="India">🇮🇳</span>&nbsp;+91
            </CountryCode>
            <InputWrapper>
              <InputIcon hasError={!!displayError} focused={focused}>
                <Phone size={18} weight="regular" />
              </InputIcon>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onBlur={(e) => {
                  handleBlur();
                  if (e.target.value) {
                    tracker.click({
                      click_type: 'login_phone_number_filled',
                      click_text: e.target.value
                    });
                  }
                }}
                onFocus={() => {
                  handleFocus();
                  if (!turnstileToken) setTurnstileAppearance('always');
                }}
                hasError={!!displayError}
                disabled={isLoading || isSuccess}
                autoComplete="tel"
                inputMode="numeric"
                autoFocus
              />
            </InputWrapper>
          </PhoneInputWrapper>
          {displayError && (
            <ErrorMessage>
              <WarningCircle size={14} weight="fill" />
              {error || errorMessage}
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
              <><LoadingSpinner /> Sending OTP...</>
            ) : isSuccess ? (
              <><CheckCircle size={18} weight="fill" /> OTP Sent</>
            ) : (
              'Continue with OTP'
            )}
          </PrimaryButton>

          {(onEmailLoginClick || onSignUpClick) && <Divider>or</Divider>}

          <SecondaryLinkContainer>
            {onEmailLoginClick && (
              <SecondaryLink
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEmailLoginClick?.(); }}
              >
                Use <span>email & password</span> instead
              </SecondaryLink>
            )}
            {onSignUpClick && (
              <SecondaryLink
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSignUpClick?.(); }}
              >
                Don't have an account? <span>Sign up</span>
              </SecondaryLink>
            )}
          </SecondaryLinkContainer>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default LoginForm;
