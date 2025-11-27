export { AUTH_ENDPOINTS } from './endpoints';

export {
  default as authService,
  fetchCsrfToken,
  authApiRequest,
  signUp,
  verifySignUpOtp,
  login,
  verifyLoginOtp,
  resendOtp,
  getCurrentUser
} from './authService';

