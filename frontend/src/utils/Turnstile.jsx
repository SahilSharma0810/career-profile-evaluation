import React from 'react';
import Turnstile from 'react-turnstile';

// Cloudflare-published "always passes" test sitekey — fine to ship as a
// fallback because Turnstile validation is enforced server-side, not client-side.
// The real production sitekey is set via REACT_APP_TURNSTILE_SITEKEY at build time.
const TURNSTILE_TEST_PASS_SITEKEY = '1x00000000000000000000AA';

const TurnstileWidget = React.forwardRef(({
  onTokenObtained,
  appearance = 'interaction-only',
  onReset
}, ref) => (
  <Turnstile
    ref={ref}
    sitekey={process.env.REACT_APP_TURNSTILE_SITEKEY || TURNSTILE_TEST_PASS_SITEKEY}
    onVerify={onTokenObtained}
    onLoad={onReset}
    appearance={appearance}
    refreshExpired="auto"
    fixedSize
    theme="light"
  />
));

export default TurnstileWidget;
