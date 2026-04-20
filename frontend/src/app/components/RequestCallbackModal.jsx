import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tracker from '../../utils/tracker';

const OVERLAY_ID = 'request-callback-modal';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 32px;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 4px;
  transition: color 0.2s ease;
  align-self: flex-end;

  &:hover {
    color: #1e293b;
  }
`;

const StatusIcon = styled.div`
  font-size: 3rem;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`;

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0052ff;
  border-radius: 0;
  padding: 9px 16px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  font-family: var(--mono);
  background: #0052ff;
  color: white;

  &:hover {
    background: #0047de;
    border-color: #0047de;
  }

  &:active {
    background: #003fc7;
    border-color: #003fc7;
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid #fca5a5;
  background: #fee2e2;
  color: #dc2626;
`;

const RetryButton = styled.button`
  border: 1px solid #cbd5e1;
  background: transparent;
  color: #64748b;
  border-radius: 0;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--sans);

  &:hover {
    color: #1e293b;
    background: #f8fafc;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: var(--accent-eye);
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RequestCallbackModal = ({
  isOpen,
  onClose,
  onRetry,
  submissionStatus = 'loading',
  errorMessage = '',
  programName = '',
  programUrl = ''
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback((event) => {
    if (event.target.id === OVERLAY_ID) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const isLoading = submissionStatus === 'loading';
  const isSuccess = submissionStatus === 'success';
  const isError = submissionStatus === 'error';

  const content = (
    <Overlay
      id={OVERLAY_ID}
      role="presentation"
      onClick={handleOverlayClick}
    >
      <Modal role="dialog" aria-modal="true" aria-labelledby="callback-title">
        {!isLoading && (
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            &times;
          </CloseButton>
        )}

        {isLoading && (
          <>
            <LoadingSpinner />
            <Title id="callback-title">Requesting callback...</Title>
            <Description>
              We're setting things up. This will only take a moment.
            </Description>
          </>
        )}

        {isSuccess && (
          <>
            <StatusIcon>&#10003;</StatusIcon>
            <Title id="callback-title">You're all set!</Title>
            <Description>
              Our team will reach out to you shortly with tailored guidance for your goals.
            </Description>
            {programUrl && (
              <Button
                href={programUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  tracker.click({
                    click_type: 'rcb_success_program_cta_clicked',
                    custom: { program_name: programName || 'default_program', program_url: programUrl }
                  });
                  tracker.ctaClick({
                    click_type: 'rcb_success_program_cta_clicked',
                    custom: { program_name: programName || 'default_program', program_url: programUrl }
                  });
                }}
              >
                {programName ? `Explore ${programName}` : 'Explore the program'} &rarr;
              </Button>
            )}
          </>
        )}

        {isError && (
          <>
            <ErrorMessage>
              {errorMessage || 'Something went wrong. Please try again.'}
            </ErrorMessage>
            <RetryButton type="button" onClick={onRetry}>
              Try again
            </RetryButton>
          </>
        )}
      </Modal>
    </Overlay>
  );

  return ReactDOM.createPortal(content, document.body);
};

RequestCallbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  submissionStatus: PropTypes.oneOf(['loading', 'success', 'error']),
  errorMessage: PropTypes.string,
  programName: PropTypes.string,
  programUrl: PropTypes.string
};

export default RequestCallbackModal;
