import { AUTH_ENDPOINTS } from './endpoints';
import attribution from '../utils/attribution';
import { getURLWithUTMParams } from '../utils/url';
import { apiRequest, ApiError } from '../utils/api';

let csrfToken = null;

export async function fetchCsrfToken(forceRefresh = false) {
  if (csrfToken && !forceRefresh) {
    return csrfToken;
  }

  try {
    const data = await apiRequest('GET', AUTH_ENDPOINTS.CSRF_TOKEN);
    if (data?.csrf_token) {
      csrfToken = data.csrf_token;
      return csrfToken;
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }

  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  return csrfMeta?.content || null;
}

export async function authApiRequest(url, options = {}) {
  const token = await fetchCsrfToken();

  const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Accept-Flash': 'true',
    ...(token ? { 'X-CSRF-Token': token } : {})
  };

  const finalOptions = {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  };

  if (typeof window !== 'undefined') {
    finalOptions.referrer = getURLWithUTMParams();
  }

  const response = await fetch(url, finalOptions);

  let flashError = null;
  if (response.headers.has('X-Flash-Messages')) {
    try {
      const flashHeader = response.headers.get('X-Flash-Messages') || '{}';
      const { error, notice } = JSON.parse(flashHeader) || {};
      flashError = error || notice || null;
    } catch (e) {

    }
  }

  return {
    response,
    flashError,
    ok: response.ok,
    status: response.status
  };
}


async function getErrorMessage(response, status, flashError) {
  if (flashError) return flashError;

  let json = {};
  try {
    json = await response.json();
  } catch (e) {
  }

  const errorMessages = {
    400: json.message || 'Invalid request. Please check your details.',
    403: 'Email already registered with another account.',
    404: 'Account not found. Please sign up first.',
    406: 'Verification expired. Please refresh and try again.',
    409: 'Phone number is linked to a different email.',
    422: json.message || 'Please fill all required fields correctly.',
    429: 'Too many requests. Please try again in a few minutes.',
    500: 'Server error. Please try again later.'
  };

  return errorMessages[status] || json.message || 'Something went wrong. Please try again.';
}

export async function signUp(userData, intent = 'career_profile_signup') {
  attribution.setAttribution(intent, {
    program: userData.program
  });

  const payload = {
    user: {
      name: userData.name,
      email: userData.email,
      phone_number: `+91-${userData.phone_number}`,
      country_code: '+91',
      program: userData.program,
      orgyear: userData.grad_year || '',
      orgname: userData.company || '',
      position: userData.position || '',
      whatsapp_consent: 'whatsapp_consent_yes',
      skip_existing_user_check: true
    },
    type: 'marketing',
    attributions: attribution.getAttribution()
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.SIGN_UP, payload);
    return {
      success: true,
      phone_number: `+91-${userData.phone_number}`,
      email: userData.email
    };

  } catch (error) {
    console.error('Sign up error:', error);
    if (error instanceof ApiError) {
      const status = error.response?.status;
      const json = error.responseJson || {};
      const flashError = json?.flashError;
      const errorMessages = {
        400: json.message || 'Invalid request. Please check your details.',
        403: 'Email already registered with another account.',
        404: 'Account not found. Please sign up first.',
        406: 'Verification expired. Please refresh and try again.',
        409: 'Phone number is linked to a different email.',
        422: json.message || 'Please fill all required fields correctly.',
        429: 'Too many requests. Please try again in a few minutes.',
        500: 'Server error. Please try again later.'
      };
      const errorMessage =
        flashError || errorMessages[status] || json.message || 'Something went wrong. Please try again.';
      return { success: false, error: errorMessage };
    }
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

export async function verifySignUpOtp(phoneNumber, otp, email) {
  const payload = {
    user: {
      phone_number: phoneNumber,
      otp: otp,
      email: email,
      skip_existing_user_check: true
    },
    attributions: attribution.getAttribution()
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.SIGN_UP_VERIFY, payload);
    return { success: true };

  } catch (error) {
    console.error('Verify sign up OTP error:', error);
    if (error instanceof ApiError) {
      const status = error.response?.status;
      const json = error.responseJson || {};
      const flashError = json?.flashError;
      if (status === 422) {
        return { success: false, error: 'Invalid OTP. Please try again.' };
      }
      const errorMessages = {
        400: json.message || 'Invalid request. Please check your details.',
        403: 'Email already registered with another account.',
        404: 'Account not found. Please sign up first.',
        406: 'Verification expired. Please refresh and try again.',
        409: 'Phone number is linked to a different email.',
        422: json.message || 'Please fill all required fields correctly.',
        429: 'Too many requests. Please try again in a few minutes.',
        500: 'Server error. Please try again later.'
      };
      const errorMessage =
        flashError || errorMessages[status] || json.message || 'Something went wrong. Please try again.';
      return { success: false, error: errorMessage };
    }
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

export async function login(phoneNumber) {
  attribution.setAttribution('career_profile_login');

  const formattedPhone = `+91-${phoneNumber}`;
  const payload = {
    user: { phone_number: formattedPhone },
    attributions: attribution.getAttribution()
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.LOGIN, payload);
    return {
      success: true,
      phone_number: formattedPhone
    };

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof ApiError) {
      const status = error.response?.status;
      const json = error.responseJson || {};
      const flashError = json?.flashError;
      if (status === 404) {
        return {
          success: false,
          error: 'Account not found. Please sign up first.',
          notFound: true
        };
      }
      const errorMessages = {
        400: json.message || 'Invalid request. Please check your details.',
        403: 'Email already registered with another account.',
        404: 'Account not found. Please sign up first.',
        406: 'Verification expired. Please refresh and try again.',
        409: 'Phone number is linked to a different email.',
        422: json.message || 'Please fill all required fields correctly.',
        429: 'Too many requests. Please try again in a few minutes.',
        500: 'Server error. Please try again later.'
      };
      const errorMessage =
        flashError || errorMessages[status] || json.message || 'Something went wrong. Please try again.';
      return { success: false, error: errorMessage };
    }
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

export async function verifyLoginOtp(phoneNumber, otp) {
  const payload = {
    user: {
      phone_number: phoneNumber,
      otp: otp,
      skip_existing_user_check: true
    },
    attributions: attribution.getAttribution()
  };

  try {
    await apiRequest('POST', AUTH_ENDPOINTS.LOGIN_VERIFY, payload);
    return { success: true };

  } catch (error) {
    console.error('Verify login OTP error:', error);
    if (error instanceof ApiError) {
      const status = error.response?.status;
      const json = error.responseJson || {};
      const flashError = json?.flashError;
      if (status === 422) {
        return { success: false, error: 'Invalid OTP. Please try again.' };
      }
      const errorMessages = {
        400: json.message || 'Invalid request. Please check your details.',
        403: 'Email already registered with another account.',
        404: 'Account not found. Please sign up first.',
        406: 'Verification expired. Please refresh and try again.',
        409: 'Phone number is linked to a different email.',
        422: json.message || 'Please fill all required fields correctly.',
        429: 'Too many requests. Please try again in a few minutes.',
        500: 'Server error. Please try again later.'
      };
      const errorMessage =
        flashError || errorMessages[status] || json.message || 'Something went wrong. Please try again.';
      return { success: false, error: errorMessage };
    }
    return {
      success: false,
      error: 'Network error. Please check your connection.'
    };
  }
}

export async function resendOtp(phoneNumber, type = 'signup') {
  const endpoint = type === 'login' ? AUTH_ENDPOINTS.LOGIN : AUTH_ENDPOINTS.SIGN_UP;
  
  const payload = {
    user: { phone_number: phoneNumber },
    attributions: attribution.getAttribution()
  };

  try {
    await apiRequest('POST', endpoint, payload);
    return { success: true };

  } catch (error) {
    console.error('Resend OTP error:', error);
    if (error instanceof ApiError) {
      const json = error.responseJson || {};
      const flashError = json?.flashError;
      const message = flashError || json.message || 'Failed to resend OTP. Please try again.';
      return { success: false, error: message };
    }
    return { success: false, error: 'Failed to resend OTP. Please try again.' };
  }
}

export async function getCurrentUser() {
  try {
    const data = await apiRequest('GET', AUTH_ENDPOINTS.USER_OPTIONS);
    return {
      isLoggedIn: true,
      user: data
    };

  } catch (error) {
    console.error('Get current user error:', error);
    return { isLoggedIn: false };
  }
}

export default {
  fetchCsrfToken,
  authApiRequest,
  signUp,
  verifySignUpOtp,
  login,
  verifyLoginOtp,
  resendOtp,
  getCurrentUser
};
