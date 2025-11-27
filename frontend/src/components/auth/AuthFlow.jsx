import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import OtpVerificationForm from './OtpVerificationForm';
import {
  signUp,
  verifySignUpOtp,
  login,
  verifyLoginOtp,
  resendOtp
} from '../../api/authService';
import tracker from '../../utils/tracker';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: #f8fafc;

  @media (max-width: 540px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 32px;
  }
`;

const AuthFlow = ({
  initialMode = 'login',
  onSuccess,
  reloadOnSuccess = true,
  signupIntent = 'career_profile_signup',
  showProfessionalFields = true
}) => {
  const [step, setStep] = useState(initialMode);
  const [authFlow, setAuthFlow] = useState(initialMode);
  const [pendingData, setPendingData] = useState({
    phoneNumber: '',
    email: '',
    userData: null
  });

  const [signUpStatus, setSignUpStatus] = useState('idle');
  const [signUpError, setSignUpError] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle');
  const [loginError, setLoginError] = useState('');
  const [otpStatus, setOtpStatus] = useState('idle');
  const [otpError, setOtpError] = useState('');
  const [resendStatus, setResendStatus] = useState('idle');

  const handleSignUp = useCallback(async (formData) => {
    setSignUpStatus('loading');
    setSignUpError('');

    tracker.click({
      click_type: 'signup_form_submitted',
      click_source: 'auth_flow'
    });

    const result = await signUp(formData, signupIntent);

    if (result.success) {
      setSignUpStatus('success');
      setPendingData({
        phoneNumber: result.phone_number,
        email: result.email,
        userData: formData
      });
      setAuthFlow('signup');
      
      setTimeout(() => {
        setStep('otp');
        setSignUpStatus('idle');
      }, 500);

      tracker.click({
        click_type: 'signup_otp_requested',
        click_source: 'auth_flow'
      });
    } else {
      setSignUpStatus('error');
      setSignUpError(result.error || 'Sign up failed. Please try again.');
    }

    return result;
  }, [signupIntent]);

  const handleLogin = useCallback(async (phoneNumber) => {
    setLoginStatus('loading');
    setLoginError('');

    tracker.click({
      click_type: 'login_form_submitted',
      click_source: 'auth_flow'
    });

    const result = await login(phoneNumber);

    if (result.success) {
      setLoginStatus('success');
      setPendingData({
        phoneNumber: result.phone_number,
        email: '',
        userData: null
      });
      setAuthFlow('login');
      
      setTimeout(() => {
        setStep('otp');
        setLoginStatus('idle');
      }, 500);

      tracker.click({
        click_type: 'login_otp_requested',
        click_source: 'auth_flow'
      });
    } else {
      setLoginStatus('error');
      
      if (result.notFound) {
        setLoginError('Account not found. Please sign up first.');
        tracker.click({
          click_type: 'login_user_not_found',
          click_source: 'auth_flow'
        });
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    }

    return result;
  }, []);

  const handleVerifyOtp = useCallback(async (otp) => {
    setOtpStatus('loading');
    setOtpError('');

    tracker.click({
      click_type: 'otp_submitted',
      click_source: 'auth_flow',
      custom: { flow: authFlow }
    });

    let result;

    if (authFlow === 'signup') {
      result = await verifySignUpOtp(pendingData.phoneNumber, otp, pendingData.email);
    } else {
      result = await verifyLoginOtp(pendingData.phoneNumber, otp);
    }

    if (result.success) {
      setOtpStatus('success');

      tracker.click({
        click_type: authFlow === 'signup' ? 'signup_success' : 'login_success',
        click_source: 'auth_flow'
      });

      if (onSuccess) {
        onSuccess({
          flow: authFlow,
          phoneNumber: pendingData.phoneNumber,
          email: pendingData.email,
          userData: pendingData.userData
        });
      }

      if (reloadOnSuccess) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      setOtpStatus('error');
      setOtpError(result.error || 'Invalid OTP. Please try again.');
    }

    return result;
  }, [authFlow, pendingData, onSuccess, reloadOnSuccess]);

  const handleResendOtp = useCallback(async () => {
    setResendStatus('loading');
    setOtpError('');

    tracker.click({
      click_type: 'resend_otp_requested',
      click_source: 'auth_flow',
      custom: { flow: authFlow }
    });

    const result = await resendOtp(pendingData.phoneNumber, authFlow);

    if (result.success) {
      setResendStatus('success');
      tracker.click({
        click_type: 'resend_otp_success',
        click_source: 'auth_flow'
      });
      
      setTimeout(() => setResendStatus('idle'), 2000);
    } else {
      setResendStatus('error');
      setOtpError(result.error || 'Failed to resend OTP.');
      setTimeout(() => setResendStatus('idle'), 2000);
    }

    return result;
  }, [authFlow, pendingData.phoneNumber]);

  const handleBackFromOtp = useCallback(() => {
    setOtpStatus('idle');
    setOtpError('');
    setStep(authFlow);
  }, [authFlow]);

  const handleSwitchToSignUp = useCallback(() => {
    setStep('signup');
    setAuthFlow('signup');
    setLoginStatus('idle');
    setLoginError('');
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setStep('login');
    setAuthFlow('login');
    setSignUpStatus('idle');
    setSignUpError('');
  }, []);

  const displayPhoneNumber = pendingData.phoneNumber.replace('+91-', '');

  return (
    <Container>
      {step === 'signup' && (
        <SignUpForm
          onSubmit={handleSignUp}
          onLoginClick={handleSwitchToLogin}
          submitStatus={signUpStatus}
          errorMessage={signUpError}
          successMessage={signUpStatus === 'success' ? 'OTP sent to your phone!' : ''}
          showProfessionalFields={showProfessionalFields}
        />
      )}

      {step === 'login' && (
        <LoginForm
          onSubmit={handleLogin}
          onSignUpClick={handleSwitchToSignUp}
          submitStatus={loginStatus}
          errorMessage={loginError}
          successMessage={loginStatus === 'success' ? 'OTP sent to your phone!' : ''}
        />
      )}

      {step === 'otp' && (
        <OtpVerificationForm
          phoneNumber={displayPhoneNumber}
          onSubmit={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={handleBackFromOtp}
          submitStatus={otpStatus}
          resendStatus={resendStatus}
          errorMessage={otpError}
          successMessage={otpStatus === 'success' ? 'Verified successfully!' : ''}
        />
      )}
    </Container>
  );
};

export default AuthFlow;

