import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'v4auhhvil3';

/**
 * Microsoft Clarity Analytics Component
 *
 * Loads the Clarity tracking script for session recordings and heatmaps.
 * Uses useEffect to inject the script after component mounts, avoiding blocking page load.
 *
 * @see https://clarity.microsoft.com/
 */
const MicrosoftClarity = () => {
  useEffect(() => {
    // Prevent duplicate initialization
    if (window.clarity) return;

    // Initialize the clarity function queue before script loads
    window.clarity =
      window.clarity ||
      function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

    // Create and inject the Clarity script
    const script = document.createElement('script');
    script.id = 'microsoft-clarity';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup: remove script on unmount (optional, rarely needed)
      const clarityScript = document.getElementById('microsoft-clarity');
      if (clarityScript) {
        clarityScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

/**
 * Set a custom tag/identifier in Clarity for segmentation
 * @param {string} key - The tag key
 * @param {string} value - The tag value
 */
export const setClarityTag = (key, value) => {
  if (window.clarity) {
    window.clarity('set', key, value);
  }
};

/**
 * Identify a user in Clarity
 * @param {string} userId - Unique user identifier
 * @param {string} [sessionId] - Optional session identifier
 * @param {string} [pageId] - Optional page identifier
 */
export const identifyClarityUser = (userId, sessionId, pageId) => {
  if (window.clarity) {
    window.clarity('identify', userId, sessionId, pageId);
  }
};

/**
 * Trigger a custom Clarity event
 * @param {string} eventName - Name of the event
 */
export const triggerClarityEvent = (eventName) => {
  if (window.clarity) {
    window.clarity('event', eventName);
  }
};

export default MicrosoftClarity;
