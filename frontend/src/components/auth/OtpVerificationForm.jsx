import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { ShieldCheck, ArrowLeft, CheckCircle, WarningCircle, ArrowClockwise } from 'phosphor-react';

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 40px;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 540px) {
    padding: 24px 20px;
    max-width: 100%;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  transition: color 0.2s ease;

  &:hover {
    color: #1e293b;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #86efac;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #059669;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const FormSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

const PhoneHighlight = styled.span`
  color: #1e293b;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;

  @media (max-width: 400px) {
    gap: 8px;
  }
`;

const OtpInput = styled.input`
  width: 52px;
  height: 60px;
  border: 2px solid ${props => props.hasError ? '#dc2626' : props.filled ? '#b30158' : '#e2e8f0'};
  border-radius: 0;
  background: ${props => props.filled ? '#fdf2f8' : '#ffffff'};
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  font-family: 'Monaco', 'Menlo', monospace;
  transition: all 0.2s ease;
  caret-color: #b30158;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc2626' : '#b30158'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(179, 1, 88, 0.15)'};
    background: #ffffff;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    width: 44px;
    height: 52px;
    font-size: 1.25rem;
  }

  /* Hide spinner for number input */
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
  font-size: 0.875rem;
  color: #dc2626;
  animation: ${shake} 0.3s ease-in-out;
  text-align: center;

  svg {
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 0;
  font-size: 0.95rem;
  color: #166534;
  font-weight: 500;
  justify-content: center;
  animation: ${pulse} 0.3s ease-in-out;
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-left: 4px solid #dc2626;
  border-radius: 0;
  font-size: 0.95rem;
  color: #991b1b;
  font-weight: 500;
  animation: ${shake} 0.4s ease-in-out;
`;

const ResendContainer = styled.div`
  text-align: center;
  margin-top: 8px;
`;

const ResendText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const ResendButton = styled.button`
  background: transparent;
  border: none;
  color: #b30158;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover:not(:disabled) {
    color: #8a0145;
    text-decoration: underline;
  }

  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const Timer = styled.span`
  color: #1e293b;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #b30158 0%, #8a0145 100%);
  color: white;
  border: none;
  border-radius: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #8a0145 0%, #b30158 100%);
    box-shadow: 0 4px 12px rgba(179, 1, 88, 0.3);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

const OtpVerificationForm = ({
  phoneNumber = '',
  onSubmit,
  onResend,
  onBack,
  submitStatus = 'idle',
  resendStatus = 'idle',
  errorMessage = '',
  successMessage = ''
}) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [localError, setLocalError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const isLoading = submitStatus === 'loading';
  const isSuccess = submitStatus === 'success';
  const isResending = resendStatus === 'loading';
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
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendStatus === 'success') {
      setResendTimer(RESEND_COOLDOWN);
    }
  }, [resendStatus]);

  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return `+91 ${cleaned}`;
  };

  const handleChange = useCallback((index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    
    setOtp(prev => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });

    setLocalError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setOtp(prev => {
          const newOtp = [...prev];
          newOtp[index - 1] = '';
          return newOtp;
        });
      } else {
        setOtp(prev => {
          const newOtp = [...prev];
          newOtp[index] = '';
          return newOtp;
        });
      }
      setLocalError('');
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    
    if (pastedData) {
      const newOtp = Array(OTP_LENGTH).fill('');
      pastedData.split('').forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
      setLocalError('');

      const lastFilledIndex = Math.min(pastedData.length, OTP_LENGTH) - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== OTP_LENGTH) {
      setLocalError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }

    onSubmit?.(otpString);
  }, [otp, onSubmit]);

  const handleResend = useCallback(() => {
    if (resendTimer > 0 || isResending) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setLocalError('');
    onResend?.();
  }, [resendTimer, isResending, onResend]);

  const otpFilled = otp.every(digit => digit !== '');

  return (
    <FormContainer>
      {onBack && (
        <BackButton type="button" onClick={onBack}>
          <ArrowLeft size={18} weight="bold" />
          Back
        </BackButton>
      )}

      <FormHeader>
        <IconWrapper>
          <ShieldCheck size={32} weight="fill" />
        </IconWrapper>
        <FormTitle>Verify Your Number</FormTitle>
        <FormSubtitle>
          We've sent a {OTP_LENGTH}-digit code to{' '}
          <PhoneHighlight>{formatPhoneDisplay(phoneNumber)}</PhoneHighlight>
        </FormSubtitle>
      </FormHeader>

      {isSuccess && successMessage && (
        <SuccessMessage>
          <CheckCircle size={20} weight="fill" />
          {successMessage}
        </SuccessMessage>
      )}

      {displayError && !isSuccess && (
        <ErrorBanner>
          <WarningCircle size={20} weight="fill" />
          {displayError}
        </ErrorBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <OtpContainer>
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              hasError={!!displayError}
              filled={!!digit}
              disabled={isLoading || isSuccess}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
            />
          ))}
        </OtpContainer>

        <ResendContainer>
          {resendTimer > 0 ? (
            <ResendText>
              Resend code in <Timer>{resendTimer}s</Timer>
            </ResendText>
          ) : (
            <ResendText>
              Didn't receive the code?{' '}
              <ResendButton 
                type="button" 
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  'Sending...'
                ) : (
                  <>
                    <ArrowClockwise size={14} weight="bold" />
                    Resend OTP
                  </>
                )}
              </ResendButton>
            </ResendText>
          )}
        </ResendContainer>

        <ButtonGroup>
          <PrimaryButton 
            type="submit" 
            disabled={isLoading || isSuccess || !otpFilled}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Verifying...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle size={20} weight="fill" />
                Verified
              </>
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

