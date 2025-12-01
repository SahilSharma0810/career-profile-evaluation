import React from 'react';
import PropTypes from 'prop-types';
import Turnstile from 'react-turnstile';

const TurnstileWidget = React.forwardRef(({
  onTokenObtained,
  appearance = 'interaction-only',
  onReset
}, ref) => (
  <Turnstile
    ref={ref}
    sitekey={'XXXX.DUMMY.TOKEN.XXXX'}
    onVerify={onTokenObtained}
    onLoad={onReset}
    appearance={appearance}
    refreshExpired="auto"
    fixedSize
    theme="light"
  />
));

export default TurnstileWidget;
