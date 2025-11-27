export const AUTH_ENDPOINTS = {
  SIGN_UP: `/users/v2/`,
  
  SIGN_UP_VERIFY: `/users/v2/verify`,
  
  LOGIN: `/users/v2/sessions`,
  
  LOGIN_VERIFY: `/users/v2/sessions/verify`,
  
  UPDATE_ACCOUNT: `/users/v2/account`,
  
  ACCOUNT_VERIFY: `/users/v2/account/verify`,
  
  CSRF_TOKEN: `/csrf-token`,
  
  USER_OPTIONS: `/get_user_options`,
  
  REQUEST_CALLBACK: `/request-callback`,
};

export default AUTH_ENDPOINTS;
