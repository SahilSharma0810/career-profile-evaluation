import React from 'react';
import Turnstile from 'react-turnstile';

const TurnstileWidget = React.forwardRef(({
  onTokenObtained,
  appearance = 'interaction-only',
  onReset
}, ref) => (
  <Turnstile
    ref={ref}
    sitekey={'1x00000000000000000000AA'}
    onVerify={onTokenObtained}
    onLoad={onReset}
    appearance={appearance}
    refreshExpired="auto"
    fixedSize
    theme="light"
  />
));

export default TurnstileWidget;
