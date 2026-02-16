'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addPropertyControls, ControlType } from 'framer';
import { createStore } from 'https://framer.com/m/framer/store.js';
import { Turnstile } from 'https://framer.com/m/Turnstile-9UW9.js';
import { apiRequest } from 'https://framer.com/m/api-2VOA.js';

import { toast } from 'https://framer.com/m/Toast-eSrC.js';
import {
  buildRCBFormValidation,
  formatPhoneInput
} from 'https://framer.com/m/util-x8vi.js';
import { ERRORS } from 'https://framer.com/m/constant-bNZW.js';

import {
  StoreState,
  FormDataShape,
  FormErrors
} from 'https://framer.com/m/types-m71w.js';
import { useTracking } from 'https://framer.com/m/useTracking-aNcF.js';

import { styles } from 'https://framer.com/m/styles-eJFF.js';

const API_HEADERS = {
  'App-Name': 'Desktop'
};

const apiRequestWithHeaders = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  payload?: Record<string, any>
) => {
  return apiRequest(method, endpoint, payload, { headers: API_HEADERS });
};

type StepType = 'phone' | 'otp' | 'details' | 'success'

const PROGRAM_OPTIONS = [
  { value: 'academy', label: 'Academy (Software Development)' },
  { value: 'dsml', label: 'Data Science & ML' },
  { value: 'ai_ml', label: 'AI/ML' },
  { value: 'devops', label: 'DevOps' },
  { value: 'online_mba', label: 'Online MBA' }
];

const PROGRAM_MAPPING: Record<string, string> = {
  academy: 'Academy',
  dsml: 'Data Science',
  ai_ml: 'AI/ML',
  devops: 'Devops',
  online_mba: 'Online Mba'
};

const ATTRIBUTION_PROGRAM_MAPPING: Record<string, string> = {
  academy: 'software_development',
  dsml: 'data_science',
  ai_ml: 'ai_ml',
  devops: 'devops',
  online_mba: 'online_mba'
};

const JOB_TITLE_OPTIONS = [
  { value: 'Financial Analyst', label: 'Financial Analyst' },
  { value: 'Investment Analyst', label: 'Investment Analyst' },
  {
    value: 'Corporate Finance Associate',
    label: 'Corporate Finance Associate'
  },
  { value: 'Business/FP&A Analyst', label: 'Business/FP&A Analyst' },
  { value: 'Risk & Compliance Analyst', label: 'Risk & Compliance Analyst' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Associate Product Manager', label: 'Associate Product Manager' },
  { value: 'Product Analyst', label: 'Product Analyst' },
  { value: 'Product Owner', label: 'Product Owner' },
  { value: 'Strategy Analyst', label: 'Strategy Analyst' },
  { value: 'Business Strategy Manager', label: 'Business Strategy Manager' },
  { value: 'Management Consultant', label: 'Management Consultant' },
  {
    value: 'Corporate Strategy Associate',
    label: 'Corporate Strategy Associate'
  },
  { value: 'Business Analyst', label: 'Business Analyst' },
  { value: 'Operations Manager', label: 'Operations Manager' },
  {
    value: 'Process Improvement Analyst',
    label: 'Process Improvement Analyst'
  },
  { value: 'Supply Chain Analyst', label: 'Supply Chain Analyst' },
  { value: 'Project/Program Manager', label: 'Project/Program Manager' },
  { value: 'Operations Executive', label: 'Operations Executive' },
  { value: 'Marketing Manager', label: 'Marketing Manager' },
  {
    value: 'Digital Marketing Specialist',
    label: 'Digital Marketing Specialist'
  },
  { value: 'Brand Manager', label: 'Brand Manager' },
  {
    value: 'Performance Marketing Analyst',
    label: 'Performance Marketing Analyst'
  },
  {
    value: 'Content & Social Media Manager',
    label: 'Content & Social Media Manager'
  },
  {
    value: 'Software Engineer / Developer',
    label: 'Software Engineer / Developer'
  },
  { value: 'Data Analyst', label: 'Data Analyst' },
  {
    value: 'Data Scientist / ML Engineer',
    label: 'Data Scientist / ML Engineer'
  },
  { value: 'Other', label: 'Other' }
];

const OTP_LENGTH = 6;
const localStyles = {
  fontImport: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    `,
  container: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    width: '100%',
    height: '100%'
  },
  formHeader: {
    marginBottom: '1.5rem'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '0.5rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  formSubtitle: {
    fontSize: '14px',
    color: '#666',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  fieldGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a1a1a',
    marginBottom: '0.5rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  required: {
    color: '#dc2626',
    marginLeft: '2px'
  },
  inputField: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #e5e5e5',
    borderRadius: '0',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  inputFieldError: {
    borderColor: '#dc2626'
  },
  inputFieldDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
    cursor: 'not-allowed'
  },
  selectWrapper: {
    position: 'relative',
    width: '100%'
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #e5e5e5',
    borderRadius: '0',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backgroundColor: '#ffffff',
    appearance: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  phoneRow: {
    display: 'flex',
    alignItems: 'stretch'
  },
  phonePrefix: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 12px',
    fontSize: '14px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backgroundColor: '#f5f5f5',
    border: '1px solid #e5e5e5',
    borderRight: 'none',
    borderRadius: '0',
    color: '#1a1a1a'
  },
  phoneInput: {
    flex: 1,
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #e5e5e5',
    borderRadius: '0',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backgroundColor: '#ffffff',
    boxSizing: 'border-box'
  },
  helperText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '0.5rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '0.25rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  checkbox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginTop: '1rem',
    fontSize: '13px',
    color: '#666',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: '#B30159',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '1rem'
  },
  submitButtonDisabled: {
    backgroundColor: '#d98ab3',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '1rem',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  footerLink: {
    color: '#1a4fd6',
    textDecoration: 'none'
  },
  otpContainer: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  otpInput: {
    width: '48px',
    height: '48px',
    fontSize: '18px',
    textAlign: 'center',
    border: '1px solid #e5e5e5',
    borderRadius: '0',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    backgroundColor: '#ffffff'
  },
  otpInputFilled: {
    borderColor: '#B30159'
  },
  otpInputError: {
    borderColor: '#dc2626'
  },
  editPhoneBtn: {
    color: '#1a4fd6',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '8px',
    textDecoration: 'underline'
  },
  phoneDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    fontSize: '16px',
    fontWeight: 500
  },
  resendContainer: {
    marginTop: '1rem',
    textAlign: 'center'
  },
  resendButton: {
    color: '#1a4fd6',
    cursor: 'pointer',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  resendButtonDisabled: {
    color: '#999',
    cursor: 'not-allowed'
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '1.5rem'
  },
  stepDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#e5e5e5'
  },
  stepDotActive: {
    backgroundColor: '#B30159'
  },
  stepDotCompleted: {
    backgroundColor: '#22c55e'
  }
};

// ============================================================================
// TYPES
// ============================================================================

type AppStore = StoreState & {
    step: StepType
    phoneFormData?: PhoneFormData
    detailsFormData?: DetailsFormData
}

type PhoneFormData = {
    phone: string
    countryCode: string
    program: string
    whatsapp: boolean
}

type DetailsFormData = {
    name: string
    email: string
    gradyear: string
    orgname: string
    job_title: string
    other_position: string
}

type UserData = {
    name?: string
    email?: string
    orgyear?: string
    orgname?: string
    phone_number?: string
    job_title?: string
} | null

type GlobalStore = {
    isLoggedIn?: boolean | string | number
    isPhoneVerified?: boolean | string | number
    userData?: UserData
}

type FormContent = {
    phoneFormTitle: string
    phoneFormSubtitle: string
    otpFormTitle: string
    otpFormSubtitle: string
    detailsFormTitle: string
    detailsFormSubtitle: string
    formIntent: string
    otpFormIntent: string
    deviceType: string
    pageProduct: string
    formIp: string
    formSource: string
    showCurriculum: boolean
    disableTurnstile: boolean
    labelGap: number
    fieldGap: number
    titleFontSize: number
    subtitleFontSize: number
    labelFontSize: number
    inputFontSize: number
    helperFontSize: number
    buttonFontSize: number
    footerFontSize: number
    showLabels: boolean
    titleLineHeight: number
    titleSubtitleGap: number
}

// ============================================================================
// STORE
// ============================================================================

const useStore = createStore<AppStore>({
  isLoading: false,
  step: 'phone'
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const toBool = (v: any): boolean =>
  v === true || v === 1 || v === '1' || v === 'true';

const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (phone.length !== 10) return 'Please enter a valid 10-digit phone number';
  if (!/^\d+$/.test(phone)) return 'Phone number must contain only digits';
  return null;
};

const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name should contain only letters';
  return null;
};

const validateGradYear = (year: string): string | null => {
  if (!year) return 'Graduation year is required';
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 30;
  const maxYear = currentYear + 4;
  const enteredYear = parseInt(year, 10);
  if (isNaN(enteredYear) || enteredYear < minYear || enteredYear > maxYear) {
    return `Please enter a year between ${minYear} and ${maxYear}`;
  }
  return null;
};

const PhoneStep: React.FC<{
    content: FormContent
    globalStore: GlobalStore
}> = ({ content, globalStore }) => {
  const [store, setStore] = useStore();
  const { isLoggedIn, userData, isPhoneVerified } = globalStore || {};
  const loggedIn = toBool(isLoggedIn);
  const phoneVerified = toBool(isPhoneVerified);

  const {
    trackClick = () => {},
    trackFormSubmitStatus = () => {},
    trackGtmFormSubmitStatus = () => {},
    trackError = () => {}
  } = useTracking() || ({} as any);

  const [formData, setFormData] = useState<PhoneFormData>({
    phone: '',
    countryCode: '+91',
    program: 'academy',
    whatsapp: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const {
    phoneFormTitle,
    phoneFormSubtitle,
    formIntent,
    deviceType,
    pageProduct,
    formIp,
    formSource,
    disableTurnstile,
    labelGap,
    fieldGap,
    labelFontSize,
    inputFontSize,
    helperFontSize,
    buttonFontSize,
    footerFontSize,
    showLabels,
    titleFontSize,
    subtitleFontSize,
    titleLineHeight,
    titleSubtitleGap
  } = content;

  // Check if user is logged in and phone verified - they get a simplified flow
  const isVerifiedUser = loggedIn && phoneVerified;

  // Extract stored phone number from userData
  const storedPhone = useMemo(() => {
    if (userData?.phone_number) {
      const phone = userData.phone_number;
      const [countryCode, phoneNumber] = phone.includes('-')
        ? phone.split('-')
        : ['+91', phone];
      return {
        countryCode: countryCode || '+91',
        phone: phoneNumber || ''
      };
    }
    return null;
  }, [userData]);

  // Pre-fill phone from userData if available
  useEffect(() => {
    if (storedPhone) {
      setFormData((prev) => ({
        ...prev,
        phone: storedPhone.phone,
        countryCode: storedPhone.countryCode
      }));
    }
  }, [storedPhone]);

  const onChangeField = useCallback(
        <K extends keyof PhoneFormData>(key: K, value: PhoneFormData[K]) => {
          setFormData((prev) => ({ ...prev, [key]: value }));
          setErrors((prev) => ({ ...prev, [key]: '' }));
        },
        []
  );

  const handleBlur = useCallback(
    (field: string, value: string) => {
      if (!value) return;
      trackClick({
        click_type: 'form_input_filled',
        custom: { field, ip: formIp, source: formSource }
      });
    },
    [trackClick, formIp, formSource]
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      trackClick({
        click_type: 'phone_step_submit_click',
        custom: { ip: formIp, source: formSource }
      });

      // Validate
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        setErrors({ phone: phoneError });
        return;
      }

      if (!formData.program) {
        setErrors({ program: 'Please select a program' });
        return;
      }

      // For verified users, check if phone matches stored phone
      if (isVerifiedUser) {
        const enteredPhone = `${formData.countryCode}-${formData.phone}`;
        const userStoredPhone = storedPhone
          ? `${storedPhone.countryCode}-${storedPhone.phone}`
          : '';

        if (enteredPhone !== userStoredPhone) {
          setErrors({
            phone: "Phone number doesn't match your registered number. Please use your registered phone number."
          });
          trackClick({
            click_type: 'phone_mismatch_error',
            custom: { ip: formIp, source: formSource }
          });
          return;
        }

        // Phone matches, call request-callback and go to success
        setIsSubmitting(true);

        try {
          await apiRequestWithHeaders('POST', '/request-callback', {
            attributions: {
              intent: formIntent,
              platform: deviceType,
              product: pageProduct,
              program:
                                ATTRIBUTION_PROGRAM_MAPPING[formData.program] ||
                                'online_mba'
            },
            user: {
              program:
                                PROGRAM_MAPPING[
                                  formData.program || 'online_mba'
                                ]
            }
          });

          trackFormSubmitStatus('verified_user_rcb_success');
          trackGtmFormSubmitStatus('verified_user_rcb_success', true);
          trackClick({
            click_type: 'lead_gen_verified_user',
            custom: { ip: formIp, source: formSource }
          });

          toast.success('Callback requested successfully!');

          // Store phone data and move to success step
          setStore((prev: AppStore) => ({
            ...prev,
            step: 'success',
            phoneFormData: formData
          }));
        } catch (error: any) {
          let message = 'Something went wrong';
          if (error?.isFromServer) {
            const { status } = error.response || {};
            if (status === 400) {
              message = error.responseJson?.message || message;
            }
          }
          trackClick({
            click_type: 'verified_user_rcb_error',
            custom: { message, ip: formIp, source: formSource }
          });
          trackGtmFormSubmitStatus('verified_user_rcb_error', false);
          trackError('verified_user_rcb_error', message);
          toast.error(message);
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      // For non-verified users, require turnstile
      if (!turnstileToken && !disableTurnstile) {
        setTurnstileError('Please complete the verification.');
        return;
      }

      setIsSubmitting(true);

      try {
        const payload: Record<string, any> = {
          method: 'mobile',
          identifier: `${formData.countryCode}-${formData.phone}`,
          whatsapp_consent: formData.whatsapp
            ? 'whatsapp_consent_yes'
            : 'whatsapp_consent_no'
        };

        // Only include turnstile response if token exists (not disabled)
        if (turnstileToken) {
          payload['cf-turnstile-response'] = turnstileToken;
        }

        await apiRequestWithHeaders(
          'POST',
          '/api/v3/auth/login-and-signup',
          payload
        );

        trackFormSubmitStatus('phone_step_success');
        trackGtmFormSubmitStatus('phone_step_success', true);
        trackClick({
          click_type: 'lead_gen_request',
          custom: { ip: formIp, source: formSource }
        });

        toast.success('OTP sent! Please check your phone.');

        // Store phone data and move to OTP step
        setStore((prev: AppStore) => ({
          ...prev,
          step: 'otp',
          phoneFormData: formData
        }));
      } catch (error: any) {
        let message = 'Something went wrong';
        if (error?.isFromServer) {
          const { status } = error.response || {};
          if (status === 400) {
            message = error.responseJson?.message || message;
          } else {
            message = ERRORS?.PHONE_FORM?.[status] || message;
          }
        }
        trackClick({
          click_type: 'lead_gen_error',
          custom: { message, ip: formIp, source: formSource }
        });
        trackGtmFormSubmitStatus('phone_step_error', false);
        trackError('phone_step_error', message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      turnstileToken,
      disableTurnstile,
      isVerifiedUser,
      storedPhone,
      formIntent,
      deviceType,
      pageProduct,
      setStore,
      trackClick,
      trackFormSubmitStatus,
      trackGtmFormSubmitStatus,
      trackError,
      formIp,
      formSource
    ]
  );

  const turnstileHandlers = useMemo(
    () => ({
      onVerify: (token: string) => {
        setTurnstileError(null);
        setTurnstileToken(token);
      },
      onExpire: () => {
        setTurnstileToken(null);
        setTurnstileError('Verification expired. Please retry.');
      },
      onError: () => {
        setTurnstileToken(null);
        setTurnstileError('Verification errored. Please retry.');
      }
    }),
    []
  );

  return (
    <div
      style={{
        ...localStyles.container,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <style>{localStyles.fontImport}</style>

      {/* Header */}
      <div
        style={{
          ...localStyles.formHeader,
          marginBottom: titleSubtitleGap
        }}
      >
        <h2
          style={{
            ...localStyles.formTitle,
            fontSize: titleFontSize,
            lineHeight: titleLineHeight
          }}
        >
          {phoneFormTitle}
        </h2>
        <p
          style={{
            ...localStyles.formSubtitle,
            fontSize: subtitleFontSize
          }}
        >
          {phoneFormSubtitle}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Program Selection */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Select Program
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <div style={localStyles.selectWrapper}>
              <select
                id="program"
                value={formData.program}
                onChange={(e) =>
                  onChangeField('program', e.target.value)
                }
                onBlur={(e) =>
                  handleBlur('program', e.target.value)
                }
                style={{
                  ...localStyles.select,
                  fontSize: inputFontSize,
                  ...(errors.program
                    ? localStyles.inputFieldError
                    : {})
                }}
                disabled={isSubmitting}
              >
                <option value="" disabled hidden>
                                    Select a Program
                </option>
                {PROGRAM_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.program && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.program}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Mobile Number
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <div style={localStyles.phoneRow}>
              <div style={localStyles.phonePrefix}>+91</div>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={(e) =>
                  onChangeField(
                    'phone',
                    formatPhoneInput(e.target.value)
                  )
                }
                onBlur={(e) =>
                  handleBlur('phone', e.target.value)
                }
                style={{
                  ...localStyles.phoneInput,
                  fontSize: inputFontSize,
                  ...(errors.phone
                    ? localStyles.inputFieldError
                    : {}),
                  ...(isSubmitting
                    ? localStyles.inputFieldDisabled
                    : {})
                }}
                inputMode="numeric"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.phone}
              </div>
            )}
            <div
              style={{
                ...localStyles.helperText,
                fontSize: helperFontSize
              }}
            >
              {isVerifiedUser
                ? 'Your phone number is already verified'
                : "You'll receive an OTP on this number for verification"}
            </div>
          </div>

          {/* WhatsApp Checkbox */}
          <label
            style={{
              ...localStyles.checkbox,
              fontSize: helperFontSize
            }}
          >
            <input
              type="checkbox"
              name="whatsapp"
              checked={formData.whatsapp}
              onChange={(e) =>
                onChangeField('whatsapp', e.target.checked)
              }
              disabled={isSubmitting}
            />
            <span>
                            I wish to receive updates &amp; confirmations via
                            WhatsApp
            </span>
          </label>

          {/* Turnstile - not shown for verified users */}
          {!disableTurnstile && !isVerifiedUser && (
            <div
              style={{
                marginTop: '0.75rem',
                marginBottom: '0.25rem'
              }}
            >
              <Turnstile
                siteKey="0x4AAAAAAATOoPzNrSMFG9jp"
                theme="light"
                onVerify={turnstileHandlers.onVerify}
                onExpire={turnstileHandlers.onExpire}
                onError={turnstileHandlers.onError}
              />
              {turnstileError && (
                <div
                  role="alert"
                  style={{
                    ...localStyles.errorText,
                    fontSize: helperFontSize
                  }}
                >
                  {turnstileError}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...localStyles.submitButton,
              fontSize: buttonFontSize,
              ...(isSubmitting
                ? localStyles.submitButtonDisabled
                : {})
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isVerifiedUser
                ? 'Requesting Callback...'
                : 'Sending OTP...'
              : isVerifiedUser
                ? 'Request Callback'
                : 'Continue'}
          </button>

          {/* Terms & Privacy Footer */}
          <div
            style={{
              ...localStyles.footer,
              fontSize: footerFontSize
            }}
          >
                        By continuing, I have read and agree to Scaler's{' '}
            <a
              href="https://www.scaler.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Terms
            </a>{' '}
                        and{' '}
            <a
              href="https://www.scaler.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Privacy Policy
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 2: OTP VERIFICATION
// ============================================================================

const OtpStep: React.FC<{
    content: FormContent
    globalStore: GlobalStore
}> = ({ content, globalStore }) => {
  const [store, setStore] = useStore();
  const { phoneFormData } = store;

  const {
    trackClick = () => {},
    trackFormSubmitStatus = () => {},
    trackGtmFormSubmitStatus = () => {},
    trackError = () => {},
    trackRawEvent = () => {}
  } = useTracking() || ({} as any);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [errors, setErrors] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    otpFormTitle,
    otpFormSubtitle,
    formIntent,
    otpFormIntent,
    deviceType,
    pageProduct,
    formIp,
    formSource,
    showCurriculum,
    labelFontSize,
    inputFontSize,
    helperFontSize,
    buttonFontSize,
    footerFontSize,
    titleFontSize,
    subtitleFontSize,
    titleLineHeight,
    titleSubtitleGap
  } = content;

  const phoneNumber = phoneFormData
    ? `${phoneFormData.countryCode}-${phoneFormData.phone}`
    : '';

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(
        () => setResendTimer((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Focus first OTP input on mount
  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });

    setErrors('');

    // Move to next input if digit entered
    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH);
      const digits = pasted.split('');
      setOtp((prev) => {
        const newOtp = [...prev];
        digits.forEach((digit, i) => {
          if (i < OTP_LENGTH) newOtp[i] = digit;
        });
        return newOtp;
      });

      // Focus appropriate input
      const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
      otpInputRefs.current[focusIndex]?.focus();
    },
    []
  );

  const handleEditPhone = useCallback(() => {
    setStore((prev: AppStore) => ({ ...prev, step: 'phone' }));
  }, [setStore]);

  const handleResendOtp = useCallback(async () => {
    if (!canResend || !phoneFormData) return;

    try {
      await apiRequestWithHeaders('POST', '/api/v3/auth/retry', {
        method: 'mobile',
        identifier: phoneNumber
      });
      toast.success('OTP sent successfully!');
      setResendTimer(30);
      setCanResend(false);
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  }, [canResend, phoneNumber, phoneFormData]);

  const checkUserProfileAndNavigate = useCallback(async () => {
    try {
      const response = await apiRequestWithHeaders(
        'GET',
        '/api/v3/profile'
      );
      const {
        data: { attributes }
      } = response;
      const { name, email, orgyear, orgname, job_title } = attributes;

      const isProfileComplete = Boolean(
        name && email && orgyear && orgname && job_title
      );

      if (isProfileComplete) {
        // Profile complete, handle RCB and go to success
        try {
          await apiRequestWithHeaders('POST', '/request-callback', {
            attributions: {
              intent: formIntent,
              platform: deviceType,
              product: pageProduct,
              program:
                                ATTRIBUTION_PROGRAM_MAPPING[
                                  phoneFormData?.program
                                ] || 'online_mba'
            },
            user: {
              program:
                                PROGRAM_MAPPING[
                                  phoneFormData?.program || 'online_mba'
                                ]
            }
          });
        } catch (rcbError) {
          console.error('RCB error:', rcbError);
        }

        if (showCurriculum) {
          setTimeout(() => {
            window.open(
              'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/170/767/original/Online_PGP_in_Business___AI-compressed.pdf?1765786211',
              '_blank'
            );
          });
        }

        toast.success('Verification successful!');
        setStore((prev: AppStore) => ({ ...prev, step: 'success' }));
      } else {
        // Profile incomplete, go to details step
        setStore((prev: AppStore) => ({
          ...prev,
          step: 'details',
          detailsFormData: {
            name: name || '',
            email: email || '',
            gradyear: orgyear || '',
            orgname: orgname || '',
            job_title: job_title || '',
            other_position: ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // On error, show details form
      setStore((prev: AppStore) => ({ ...prev, step: 'details' }));
    }
  }, [
    setStore,
    formIntent,
    deviceType,
    pageProduct,
    phoneFormData,
    showCurriculum
  ]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      trackClick({
        click_type: 'otp_step_submit_click',
        custom: { ip: formIp, source: formSource }
      });

      const otpValue = otp.join('');
      if (otpValue.length !== OTP_LENGTH) {
        setErrors('Please enter the complete OTP');
        return;
      }

      setIsSubmitting(true);

      try {
        const payload = {
          method: 'mobile',
          identifier: phoneNumber,
          code: otpValue
        };

        const response = await apiRequestWithHeaders(
          'POST',
          '/api/v3/auth/verify-otp',
          payload
        );

        if (response.success) {
          trackFormSubmitStatus('otp_step_success');
          trackGtmFormSubmitStatus('otp_step_success', true);
          trackClick({
            click_type: 'lead_gen',
            custom: { ip: formIp, source: formSource }
          });

          // Check user profile to determine next step
          await checkUserProfileAndNavigate();
        } else {
          const message = response.message || 'Invalid OTP';
          setErrors(message);
          trackGtmFormSubmitStatus('otp_step_error', false);
          trackError('otp_step_error', message);
        }
      } catch (error: any) {
        let message = 'Something went wrong';
        if (error?.isFromServer) {
          const { status } = error.response || {};
          if (status === 403) {
            message = 'Invalid OTP. Please try again.';
          } else if (error.responseJson?.message) {
            message = error.responseJson.message;
          }
        }
        setErrors(message);
        trackClick({
          click_type: 'lead_gen_error',
          custom: { message, ip: formIp, source: formSource }
        });
        trackGtmFormSubmitStatus('otp_step_error', false);
        trackError('otp_step_error', message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      otp,
      phoneNumber,
      checkUserProfileAndNavigate,
      trackClick,
      trackFormSubmitStatus,
      trackGtmFormSubmitStatus,
      trackError,
      formIp,
      formSource
    ]
  );

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div
      style={{
        ...localStyles.container,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <style>{localStyles.fontImport}</style>

      {/* Header */}
      <div
        style={{
          ...localStyles.formHeader,
          marginBottom: titleSubtitleGap
        }}
      >
        <h2
          style={{
            ...localStyles.formTitle,
            fontSize: titleFontSize,
            lineHeight: titleLineHeight
          }}
        >
          {otpFormTitle}
        </h2>
        <p
          style={{
            ...localStyles.formSubtitle,
            fontSize: subtitleFontSize
          }}
        >
          {otpFormSubtitle}
        </p>
      </div>

      {/* Phone Display with Edit */}
      <div style={localStyles.phoneDisplay}>
        <span>{phoneNumber}</span>
        <span
          style={localStyles.editPhoneBtn}
          onClick={handleEditPhone}
        >
                    Edit
        </span>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* OTP Inputs */}
          <div style={localStyles.otpContainer}>
            {Array(OTP_LENGTH)
              .fill(null)
              .map((_, index) => (
                <input
                  key={index}
                  ref={(el) =>
                    (otpInputRefs.current[index] = el)
                  }
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) =>
                    handleOtpChange(index, e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(index, e)
                  }
                  onPaste={handleOtpPaste}
                  style={{
                    ...localStyles.otpInput,
                    fontSize: inputFontSize,
                    ...(otp[index]
                      ? localStyles.otpInputFilled
                      : {}),
                    ...(errors
                      ? localStyles.otpInputError
                      : {})
                  }}
                  disabled={isSubmitting}
                  autoComplete={
                    index === 0 ? 'one-time-code' : 'off'
                  }
                />
              ))}
          </div>

          {errors && (
            <div
              role="alert"
              style={{
                ...localStyles.errorText,
                fontSize: helperFontSize,
                textAlign: 'center',
                marginTop: '0.5rem'
              }}
            >
              {errors}
            </div>
          )}

          {/* Resend OTP */}
          <div style={localStyles.resendContainer}>
            {canResend ? (
              <button
                type="button"
                style={localStyles.resendButton}
                onClick={handleResendOtp}
              >
                                Resend OTP
              </button>
            ) : (
              <span
                style={{
                  ...localStyles.helperText,
                  fontSize: helperFontSize
                }}
              >
                                Resend OTP in {resendTimer}s
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...localStyles.submitButton,
              fontSize: buttonFontSize,
              ...(isSubmitting || !isOtpComplete
                ? localStyles.submitButtonDisabled
                : {})
            }}
            disabled={isSubmitting || !isOtpComplete}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Terms & Privacy Footer */}
          <div
            style={{
              ...localStyles.footer,
              fontSize: footerFontSize
            }}
          >
                        By continuing, I have read and agree to Scaler's{' '}
            <a
              href="https://www.scaler.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Terms
            </a>{' '}
                        and{' '}
            <a
              href="https://www.scaler.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Privacy Policy
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 3: PERSONAL DETAILS FORM
// ============================================================================

const DetailsStep: React.FC<{
    content: FormContent
    globalStore: GlobalStore
}> = ({ content, globalStore }) => {
  const [store, setStore] = useStore();
  const { phoneFormData, detailsFormData } = store;

  const {
    trackClick = () => {},
    trackFormSubmitStatus = () => {},
    trackGtmFormSubmitStatus = () => {},
    trackError = () => {},
    trackRawEvent = () => {}
  } = useTracking() || ({} as any);

  const [formData, setFormData] = useState<DetailsFormData>({
    name: detailsFormData?.name || '',
    email: detailsFormData?.email || '',
    gradyear: detailsFormData?.gradyear || '',
    orgname: detailsFormData?.orgname || '',
    job_title: detailsFormData?.job_title || '',
    other_position: detailsFormData?.other_position || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    detailsFormTitle,
    detailsFormSubtitle,
    formIntent,
    deviceType,
    pageProduct,
    formIp,
    formSource,
    showCurriculum,
    labelGap,
    fieldGap,
    labelFontSize,
    inputFontSize,
    helperFontSize,
    buttonFontSize,
    footerFontSize,
    showLabels,
    titleFontSize,
    subtitleFontSize,
    titleLineHeight,
    titleSubtitleGap
  } = content;

  const showOtherPosition = formData.job_title?.toLowerCase() === 'other';

  // Update formData when detailsFormData changes (prefill from API)
  useEffect(() => {
    if (detailsFormData) {
      setFormData((prev) => ({
        ...prev,
        name: detailsFormData.name || prev.name,
        email: detailsFormData.email || prev.email,
        gradyear: detailsFormData.gradyear || prev.gradyear,
        orgname: detailsFormData.orgname || prev.orgname,
        job_title: detailsFormData.job_title || prev.job_title
      }));
    }
  }, [detailsFormData]);

  const onChangeField = useCallback(
        <K extends keyof DetailsFormData>(
      key: K,
      value: DetailsFormData[K]
    ) => {
          setFormData((prev) => ({ ...prev, [key]: value }));
          setErrors((prev) => ({ ...prev, [key]: '' }));

          // Clear other_position if job_title changes from "Other"
          if (
            key === 'job_title' &&
                value?.toString().toLowerCase() !== 'other'
          ) {
            setFormData((prev) => ({ ...prev, other_position: '' }));
          }
        },
        []
  );

  const handleBlur = useCallback(
    (field: string, value: string) => {
      if (!value) return;
      trackClick({
        click_type: 'form_input_filled',
        custom: { field, ip: formIp, source: formSource }
      });
    },
    [trackClick, formIp, formSource]
  );

  const validateForm = useCallback((): Record<string, string> => {
    const validationErrors: Record<string, string> = {};

    const nameError = validateName(formData.name);
    if (nameError) validationErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) validationErrors.email = emailError;

    const gradYearError = validateGradYear(formData.gradyear);
    if (gradYearError) validationErrors.gradyear = gradYearError;

    if (!formData.orgname) {
      validationErrors.orgname = 'Company name is required';
    }

    if (!formData.job_title) {
      validationErrors.job_title = 'Job title is required';
    }

    if (showOtherPosition && !formData.other_position) {
      validationErrors.other_position = 'Please specify your position';
    }

    return validationErrors;
  }, [formData, showOtherPosition]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      trackClick({
        click_type: 'details_step_submit_click',
        custom: { ip: formIp, source: formSource }
      });

      // Validate
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        const firstKey = Object.keys(validationErrors)[0];
        const el = document.getElementById(
          firstKey
        ) as HTMLInputElement | null;
        if (el) el.focus();
        return;
      }

      setIsSubmitting(true);

      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          orgyear: formData.gradyear,
          orgname: formData.orgname,
          job_title: formData.job_title,
          other_position: formData.other_position || undefined
        };

        await apiRequestWithHeaders('PUT', '/api/v3/profile', payload);

        // Now raise RCB
        try {
          await apiRequestWithHeaders('POST', '/request-callback', {
            attributions: {
              intent: formIntent,
              platform: deviceType,
              product: pageProduct,
              program:
                                ATTRIBUTION_PROGRAM_MAPPING[
                                  phoneFormData?.program
                                ] || 'online_mba'
            },
            user: {
              program:
                                PROGRAM_MAPPING[
                                  phoneFormData?.program || 'online_mba'
                                ],
              position: formData.job_title
            }
          });
        } catch (rcbError) {
          console.error('RCB error:', rcbError);
        }

        trackFormSubmitStatus('details_step_success');
        trackGtmFormSubmitStatus('details_step_success', true);
        trackClick({
          click_type: 'lead_gen_personal_details',
          custom: { ip: formIp, source: formSource }
        });
        trackRawEvent({
          event: 'set_user_attribute',
          user_attributes: {
            cu_year_of_graduation: formData.gradyear
          }
        });

        if (showCurriculum) {
          setTimeout(() => {
            window.open(
              'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/170/767/original/Online_PGP_in_Business___AI-compressed.pdf?1765786211',
              '_blank'
            );
          });
        }

        toast.success('Profile updated successfully!');
        setStore((prev: AppStore) => ({ ...prev, step: 'success' }));
      } catch (error: any) {
        let message = 'Something went wrong';
        if (error?.isFromServer) {
          const { status } = error.response || {};
          if (status === 400) {
            message = error.responseJson?.message || message;
          }
        }
        trackClick({
          click_type: 'lead_gen_personal_details_error',
          custom: { message, ip: formIp, source: formSource }
        });
        trackGtmFormSubmitStatus('details_step_error', false);
        trackError('details_step_error', message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      setStore,
      phoneFormData,
      formIntent,
      deviceType,
      pageProduct,
      showCurriculum,
      trackClick,
      trackFormSubmitStatus,
      trackGtmFormSubmitStatus,
      trackError,
      trackRawEvent,
      formIp,
      formSource
    ]
  );

  // Determine which fields should be disabled (already filled)
  const isNameDisabled = isSubmitting || Boolean(detailsFormData?.name);
  const isEmailDisabled =
        isSubmitting ||
        Boolean(
          detailsFormData?.email && !detailsFormData.email.includes('tmp.com')
        );
  const isGradYearDisabled =
        isSubmitting || Boolean(detailsFormData?.gradyear);
  const isOrgnameDisabled = isSubmitting || Boolean(detailsFormData?.orgname);
  const isJobTitleDisabled =
        isSubmitting || Boolean(detailsFormData?.job_title);

  return (
    <div
      style={{
        ...localStyles.container,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <style>{localStyles.fontImport}</style>

      {/* Header */}
      <div
        style={{
          ...localStyles.formHeader,
          marginBottom: titleSubtitleGap
        }}
      >
        <h2
          style={{
            ...localStyles.formTitle,
            fontSize: titleFontSize,
            lineHeight: titleLineHeight
          }}
        >
          {detailsFormTitle}
        </h2>
        <p
          style={{
            ...localStyles.formSubtitle,
            fontSize: subtitleFontSize
          }}
        >
          {detailsFormSubtitle}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Full Name */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Full Name
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                onChangeField('name', e.target.value)
              }
              onBlur={(e) => handleBlur('name', e.target.value)}
              style={{
                ...localStyles.inputField,
                fontSize: inputFontSize,
                ...(errors.name
                  ? localStyles.inputFieldError
                  : {}),
                ...(isNameDisabled
                  ? localStyles.inputFieldDisabled
                  : {})
              }}
              disabled={isNameDisabled}
              autoComplete="name"
            />
            {errors.name && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Email ID
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                onChangeField('email', e.target.value)
              }
              onBlur={(e) => handleBlur('email', e.target.value)}
              style={{
                ...localStyles.inputField,
                fontSize: inputFontSize,
                ...(errors.email
                  ? localStyles.inputFieldError
                  : {}),
                ...(isEmailDisabled
                  ? localStyles.inputFieldDisabled
                  : {})
              }}
              disabled={isEmailDisabled}
              inputMode="email"
              autoComplete="email"
            />
            {errors.email && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.email}
              </div>
            )}
          </div>

          {/* Graduation Year */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Graduation Year
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <input
              id="gradyear"
              name="gradyear"
              type="text"
              inputMode="numeric"
              placeholder="Enter graduation year"
              value={formData.gradyear}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, '')
                  .slice(0, 4);
                onChangeField('gradyear', value);
              }}
              onBlur={(e) =>
                handleBlur('gradyear', e.target.value)
              }
              style={{
                ...localStyles.inputField,
                fontSize: inputFontSize,
                ...(errors.gradyear
                  ? localStyles.inputFieldError
                  : {}),
                ...(isGradYearDisabled
                  ? localStyles.inputFieldDisabled
                  : {})
              }}
              disabled={isGradYearDisabled}
              autoComplete="off"
            />
            {errors.gradyear && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.gradyear}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Company Name
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <input
              id="orgname"
              name="orgname"
              type="text"
              placeholder="Enter company name"
              value={formData.orgname}
              onChange={(e) =>
                onChangeField('orgname', e.target.value)
              }
              onBlur={(e) =>
                handleBlur('orgname', e.target.value)
              }
              style={{
                ...localStyles.inputField,
                fontSize: inputFontSize,
                ...(errors.orgname
                  ? localStyles.inputFieldError
                  : {}),
                ...(isOrgnameDisabled
                  ? localStyles.inputFieldDisabled
                  : {})
              }}
              disabled={isOrgnameDisabled}
              autoComplete="organization"
            />
            {errors.orgname && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.orgname}
              </div>
            )}
          </div>

          {/* Job Title */}
          <div
            style={{
              ...localStyles.fieldGroup,
              marginBottom: fieldGap
            }}
          >
            {showLabels && (
              <label
                style={{
                  ...localStyles.label,
                  marginBottom: labelGap,
                  fontSize: labelFontSize
                }}
              >
                                Job Title
                <span style={localStyles.required}>*</span>
              </label>
            )}
            <div style={localStyles.selectWrapper}>
              <select
                id="job_title"
                value={formData.job_title}
                onChange={(e) =>
                  onChangeField('job_title', e.target.value)
                }
                onBlur={(e) =>
                  handleBlur('job_title', e.target.value)
                }
                style={{
                  ...localStyles.select,
                  fontSize: inputFontSize,
                  ...(errors.job_title
                    ? localStyles.inputFieldError
                    : {}),
                  ...(isJobTitleDisabled
                    ? localStyles.inputFieldDisabled
                    : {})
                }}
                disabled={isJobTitleDisabled}
              >
                <option value="" disabled hidden>
                                    Select Job Title
                </option>
                {JOB_TITLE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.job_title && (
              <div
                role="alert"
                style={{
                  ...localStyles.errorText,
                  fontSize: helperFontSize
                }}
              >
                {errors.job_title}
              </div>
            )}
          </div>

          {/* Other Position (conditional) */}
          {showOtherPosition && (
            <div
              style={{
                ...localStyles.fieldGroup,
                marginBottom: fieldGap
              }}
            >
              {showLabels && (
                <label
                  style={{
                    ...localStyles.label,
                    marginBottom: labelGap,
                    fontSize: labelFontSize
                  }}
                >
                                    Specify Position
                  <span style={localStyles.required}>*</span>
                </label>
              )}
              <input
                id="other_position"
                name="other_position"
                type="text"
                placeholder="Enter your position"
                value={formData.other_position}
                onChange={(e) =>
                  onChangeField(
                    'other_position',
                    e.target.value
                  )
                }
                onBlur={(e) =>
                  handleBlur('other_position', e.target.value)
                }
                style={{
                  ...localStyles.inputField,
                  fontSize: inputFontSize,
                  ...(errors.other_position
                    ? localStyles.inputFieldError
                    : {}),
                  ...(isSubmitting
                    ? localStyles.inputFieldDisabled
                    : {})
                }}
                disabled={isSubmitting}
              />
              {errors.other_position && (
                <div
                  role="alert"
                  style={{
                    ...localStyles.errorText,
                    fontSize: helperFontSize
                  }}
                >
                  {errors.other_position}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...localStyles.submitButton,
              fontSize: buttonFontSize,
              ...(isSubmitting
                ? localStyles.submitButtonDisabled
                : {})
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Submitting...'
              : 'Complete Registration'}
          </button>

          {/* Terms & Privacy Footer */}
          <div
            style={{
              ...localStyles.footer,
              fontSize: footerFontSize
            }}
          >
                        By continuing, I have read and agree to Scaler's{' '}
            <a
              href="https://www.scaler.com/terms/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Terms
            </a>{' '}
                        and{' '}
            <a
              href="https://www.scaler.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={localStyles.footerLink}
            >
                            Privacy Policy
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// STEP 4: SUCCESS STATE
// ============================================================================

const SuccessStep: React.FC<{
    redirectDelay?: number
    redirectUrl?: string
}> = ({ redirectDelay = 5, redirectUrl = '/online_mba/free-live-class' }) => {
  const [countdown, setCountdown] = useState(redirectDelay);
  const [store] = useStore();
  const { phoneFormData } = store;

  // Determine redirect URL based on program
  const finalRedirectUrl = useMemo(() => {
    if (phoneFormData?.program) {
      const programRoutes: Record<string, string> = {
        academy: '/academy/free-live-class',
        dsml: '/data-science/free-live-class',
        ai_ml: '/ai-ml/free-live-class',
        devops: '/devops/free-live-class',
        online_mba: '/online_mba/free-live-class'
      };
      return programRoutes[phoneFormData.program] || redirectUrl;
    }
    return redirectUrl;
  }, [phoneFormData, redirectUrl]);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.replace(finalRedirectUrl);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, finalRedirectUrl]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: '1rem',
        padding: '2.4rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <style>{localStyles.fontImport}</style>
      <div>
        <img
          src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/154/178/original/Like-badge-_remix__1.png?1758617264"
          alt="Success"
          style={{ width: '120px', height: '120px' }}
        />
      </div>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 600,
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        <span>You have Requested a Callback</span>
        <br />
        <span>We will reach out to you shortly!</span>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
      </div>
    </div>
  );
};

// ============================================================================
// LOADER COMPONENT
// ============================================================================

const Loader: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        backgroundColor: '#ffffff',
        borderRadius: 0
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          height: '100%',
          minHeight: '500px',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <style>{`
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }
                    .dot {
                        width: 0.8rem;
                        height: 0.8rem;
                        border-radius: 50%;
                        background: #B30159;
                        animation: bounce 1.4s infinite ease-in-out;
                    }
                    .dot:nth-child(1) { animation-delay: -0.32s; }
                    .dot:nth-child(2) { animation-delay: -0.16s; }
                `}</style>
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================

const Content: React.FC<{
    content: FormContent
    globalStore: GlobalStore
    padding: {
        paddingTop?: number
        paddingRight?: number
        paddingBottom?: number
        paddingLeft?: number
    }
}> = ({ content, globalStore, padding }) => {
  const [store] = useStore();
  const { step } = store;

  return (
    <div
      style={{
        ...styles.container,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderRadius: 0,
        paddingTop: padding.paddingTop,
        paddingRight: padding.paddingRight,
        paddingBottom: padding.paddingBottom,
        paddingLeft: padding.paddingLeft
      }}
    >
      <style>{localStyles.fontImport}</style>
      {step === 'phone' && (
        <PhoneStep content={content} globalStore={globalStore} />
      )}
      {step === 'otp' && (
        <OtpStep content={content} globalStore={globalStore} />
      )}
      {step === 'details' && (
        <DetailsStep content={content} globalStore={globalStore} />
      )}
      {step === 'success' && <SuccessStep />}
    </div>
  );
};

// ============================================================================
// MAIN EXPORT COMPONENT
// ============================================================================

type RcbFormProps = {
    store?: GlobalStore & { isLoading?: boolean }
    phoneFormTitle: string
    phoneFormSubtitle: string
    otpFormTitle: string
    otpFormSubtitle: string
    detailsFormTitle: string
    detailsFormSubtitle: string
    formIntent: string
    otpFormIntent: string
    deviceType: 'desktop' | 'mobile'
    pageProduct: string
    formIp: string
    formSource: string
    showCurriculum: boolean
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
    disableTurnstile: boolean
    labelGap: number
    fieldGap: number
    titleFontSize: number
    subtitleFontSize: number
    labelFontSize: number
    inputFontSize: number
    helperFontSize: number
    buttonFontSize: number
    footerFontSize: number
    showLabels: boolean
    titleLineHeight: number
    titleSubtitleGap: number
}

function RcbForm(props: RcbFormProps) {
  const globalStore = props.store;
  const { isLoading } = globalStore || {};

  const {
    phoneFormTitle,
    phoneFormSubtitle,
    otpFormTitle,
    otpFormSubtitle,
    detailsFormTitle,
    detailsFormSubtitle,
    formIntent,
    otpFormIntent,
    deviceType,
    pageProduct,
    formIp,
    formSource,
    showCurriculum,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    disableTurnstile,
    labelGap,
    fieldGap,
    titleFontSize,
    subtitleFontSize,
    labelFontSize,
    inputFontSize,
    helperFontSize,
    buttonFontSize,
    footerFontSize,
    showLabels,
    titleLineHeight,
    titleSubtitleGap
  } = props;

  const content: FormContent = {
    phoneFormTitle,
    phoneFormSubtitle,
    otpFormTitle,
    otpFormSubtitle,
    detailsFormTitle,
    detailsFormSubtitle,
    formIntent,
    otpFormIntent,
    deviceType,
    pageProduct,
    formIp,
    formSource,
    showCurriculum,
    disableTurnstile,
    labelGap,
    fieldGap,
    titleFontSize,
    subtitleFontSize,
    labelFontSize,
    inputFontSize,
    helperFontSize,
    buttonFontSize,
    footerFontSize,
    showLabels,
    titleLineHeight,
    titleSubtitleGap
  };

  const padding = {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  };

  if (isLoading) return <Loader />;
  return (
    <Content
      content={content}
      globalStore={globalStore || {}}
      padding={padding}
    />
  );
}

export default RcbForm;

// ============================================================================
// DEFAULT PROPS
// ============================================================================

RcbForm.defaultProps = {
  phoneFormTitle: 'Get Started',
  phoneFormSubtitle: 'Enter your details to begin your learning journey',
  otpFormTitle: 'Verify OTP',
  otpFormSubtitle: 'Enter the 6-digit code sent to your phone',
  detailsFormTitle: 'Complete Your Profile',
  detailsFormSubtitle:
        'Tell us a bit about yourself for a personalized experience',
  formIntent: 'rcb_form_intent',
  otpFormIntent: 'rcb_otp_intent',
  deviceType: 'desktop',
  pageProduct: 'scaler_page',
  formIp: 'rcb',
  formSource: 'landing_page',
  showCurriculum: false,
  paddingTop: 24,
  paddingRight: 24,
  paddingBottom: 24,
  paddingLeft: 24,
  disableTurnstile: false,
  labelGap: 8,
  fieldGap: 16,
  titleFontSize: 24,
  subtitleFontSize: 14,
  labelFontSize: 14,
  inputFontSize: 14,
  helperFontSize: 12,
  buttonFontSize: 16,
  footerFontSize: 12,
  showLabels: true,
  titleLineHeight: 1.3,
  titleSubtitleGap: 8
};

// ============================================================================
// FRAMER PROPERTY CONTROLS
// ============================================================================

addPropertyControls(RcbForm, {
  phoneFormTitle: {
    type: ControlType.String,
    title: 'Phone Form Title',
    defaultValue: 'Get Started'
  },
  phoneFormSubtitle: {
    type: ControlType.String,
    title: 'Phone Form Subtitle',
    defaultValue: 'Enter your details to begin your learning journey'
  },
  otpFormTitle: {
    type: ControlType.String,
    title: 'OTP Form Title',
    defaultValue: 'Verify OTP'
  },
  otpFormSubtitle: {
    type: ControlType.String,
    title: 'OTP Form Subtitle',
    defaultValue: 'Enter the 6-digit code sent to your phone'
  },
  detailsFormTitle: {
    type: ControlType.String,
    title: 'Details Form Title',
    defaultValue: 'Complete Your Profile'
  },
  detailsFormSubtitle: {
    type: ControlType.String,
    title: 'Details Form Subtitle',
    defaultValue:
            'Tell us a bit about yourself for a personalized experience'
  },
  formIntent: {
    type: ControlType.String,
    title: 'Form Intent',
    defaultValue: 'rcb_form_intent'
  },
  otpFormIntent: {
    type: ControlType.String,
    title: 'OTP Form Intent',
    defaultValue: 'rcb_otp_intent'
  },
  pageProduct: {
    type: ControlType.String,
    title: 'Page Product',
    defaultValue: 'scaler_page'
  },
  deviceType: {
    type: ControlType.Enum,
    title: 'Device Type',
    defaultValue: 'desktop',
    options: ['desktop', 'mobile'],
    optionTitles: ['Desktop', 'Mobile']
  },
  formIp: {
    type: ControlType.String,
    title: 'Form IP',
    defaultValue: 'rcb'
  },
  formSource: {
    type: ControlType.String,
    title: 'Form Source',
    defaultValue: 'landing_page'
  },
  showCurriculum: {
    type: ControlType.Boolean,
    title: 'Show Curriculum',
    defaultValue: false,
    enabledTitle: 'Show',
    disabledTitle: 'Hide'
  },
  paddingTop: {
    type: ControlType.Number,
    title: 'Padding Top',
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
    unit: 'px'
  },
  paddingRight: {
    type: ControlType.Number,
    title: 'Padding Right',
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
    unit: 'px'
  },
  paddingBottom: {
    type: ControlType.Number,
    title: 'Padding Bottom',
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
    unit: 'px'
  },
  paddingLeft: {
    type: ControlType.Number,
    title: 'Padding Left',
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
    unit: 'px'
  },
  disableTurnstile: {
    type: ControlType.Boolean,
    title: 'Disable Turnstile',
    defaultValue: false,
    enabledTitle: 'Disabled',
    disabledTitle: 'Enabled'
  },
  labelGap: {
    type: ControlType.Number,
    title: 'Label Gap',
    defaultValue: 8,
    min: 0,
    max: 32,
    step: 1,
    unit: 'px'
  },
  fieldGap: {
    type: ControlType.Number,
    title: 'Field Gap',
    defaultValue: 16,
    min: 0,
    max: 48,
    step: 1,
    unit: 'px'
  },
  titleFontSize: {
    type: ControlType.Number,
    title: 'Title Font Size',
    defaultValue: 24,
    min: 12,
    max: 48,
    step: 1,
    unit: 'px'
  },
  subtitleFontSize: {
    type: ControlType.Number,
    title: 'Subtitle Font Size',
    defaultValue: 14,
    min: 10,
    max: 24,
    step: 1,
    unit: 'px'
  },
  labelFontSize: {
    type: ControlType.Number,
    title: 'Label Font Size',
    defaultValue: 14,
    min: 10,
    max: 24,
    step: 1,
    unit: 'px'
  },
  inputFontSize: {
    type: ControlType.Number,
    title: 'Input Font Size',
    defaultValue: 14,
    min: 10,
    max: 24,
    step: 1,
    unit: 'px'
  },
  helperFontSize: {
    type: ControlType.Number,
    title: 'Helper Font Size',
    defaultValue: 12,
    min: 8,
    max: 18,
    step: 1,
    unit: 'px'
  },
  buttonFontSize: {
    type: ControlType.Number,
    title: 'Button Font Size',
    defaultValue: 16,
    min: 12,
    max: 24,
    step: 1,
    unit: 'px'
  },
  footerFontSize: {
    type: ControlType.Number,
    title: 'Footer Font Size',
    defaultValue: 12,
    min: 8,
    max: 18,
    step: 1,
    unit: 'px'
  },
  showLabels: {
    type: ControlType.Boolean,
    title: 'Show Labels',
    defaultValue: true,
    enabledTitle: 'Show',
    disabledTitle: 'Hide'
  },
  titleLineHeight: {
    type: ControlType.Number,
    title: 'Title Line Height',
    defaultValue: 1.3,
    min: 1,
    max: 2,
    step: 0.1
  },
  titleSubtitleGap: {
    type: ControlType.Number,
    title: 'Title-Subtitle Gap',
    defaultValue: 8,
    min: 0,
    max: 32,
    step: 1,
    unit: 'px'
  }
});
