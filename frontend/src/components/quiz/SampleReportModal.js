import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'phosphor-react';
import ReportPage from '../results/ReportPage';
import {
  sampleEvaluationResults,
  sampleQuizResponses,
  sampleBackground,
  sampleGoals,
} from '../../data/sampleReportData';

/* ── Styled Components ──────────────────────────────────────── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background: var(--white);
  border-bottom: 1px solid var(--line);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const ModalTitle = styled.span`
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink);
`;

const ModalBadge = styled.span`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  background: rgba(37, 99, 235, 0.08);
  padding: 4px 10px;
  margin-left: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink3);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;

  &:hover {
    color: var(--ink);
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  background: var(--white);
`;

/* ── Component ──────────────────────────────────────────────── */

const SampleReportModal = ({ onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <ModalHeader onClick={(e) => e.stopPropagation()}>
        <div>
          <ModalTitle>Sample Report</ModalTitle>
          <ModalBadge>Preview</ModalBadge>
        </div>
        <CloseButton onClick={onClose} aria-label="Close sample report">
          <X size={20} weight="bold" />
        </CloseButton>
      </ModalHeader>

      <ModalBody onClick={(e) => e.stopPropagation()}>
        <ReportPage
          evaluationResults={sampleEvaluationResults}
          background={sampleBackground}
          quizResponses={sampleQuizResponses}
          goals={sampleGoals}
          isPreview={true}
          onPreviewCTAClick={onClose}
        />
      </ModalBody>
    </Overlay>
  );
};

export default SampleReportModal;
