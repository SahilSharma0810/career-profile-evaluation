import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X, Lock } from 'phosphor-react';
import HeroChapter from '../results/chapters/HeroChapter';
import SkillsChapter from '../results/chapters/SkillsChapter';
import TwoPathsChapter from '../results/chapters/TwoPathsChapter';
import TimelineChapter from '../results/chapters/TimelineChapter';
import {
  sampleEvaluationResults,
  sampleQuizResponses,
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

const LockedWrapper = styled.div`
  position: relative;
`;

const BlurredContent = styled.div`
  filter: blur(6px);
  pointer-events: none;
  user-select: none;
  opacity: 0.4;
`;

const LockOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.85) 30%,
    rgba(255, 255, 255, 0.95) 60%,
    rgba(255, 255, 255, 1) 100%
  );
`;

const LockIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: var(--navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LockTitle = styled.h3`
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 8px;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const LockSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0 0 24px;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`;

const UnlockButton = styled.button`
  background: var(--navy);
  color: var(--white);
  border: none;
  padding: 14px 32px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #021e5e;
  }
`;

const LockMeta = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--ink4);
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ── Component ──────────────────────────────────────────────── */

const SampleReportModal = ({ onClose }) => {
  const targetRole = sampleQuizResponses.targetRole;
  const score = sampleEvaluationResults.profile_strength_score;
  const strengths = sampleEvaluationResults.skill_analysis.strengths;
  const areasToImprove = sampleEvaluationResults.skill_analysis.areas_to_develop;
  const recommendedRoles = sampleEvaluationResults.recommended_roles_based_on_interests;

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

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
        {/* Hero with locked score */}
        <HeroChapter
          score={score}
          targetRole={targetRole}
          quizResponses={sampleQuizResponses}
          background="tech"
          hideCTAs={true}
          isPreview={true}
        />

        {/* Locked/blurred chapters */}
        <LockedWrapper>
          <BlurredContent aria-hidden="true">
            <SkillsChapter
              strengths={strengths}
              areasToImprove={areasToImprove}
            />
            <TwoPathsChapter
              targetRole={targetRole}
              hideCTAs={true}
            />
            <TimelineChapter
              recommendedRoles={recommendedRoles}
            />
          </BlurredContent>

          <LockOverlay>
            <LockIconWrapper>
              <Lock size={24} weight="fill" color="#ffffff" />
            </LockIconWrapper>
            <LockTitle>Your full report is waiting.</LockTitle>
            <LockSubtitle>
              Complete the quiz to unlock your personalized strengths, career timeline, and AI-readiness score.
            </LockSubtitle>
            <UnlockButton onClick={onClose}>
              Complete the Quiz
            </UnlockButton>
            <LockMeta>Takes 2 min · 100% free</LockMeta>
          </LockOverlay>
        </LockedWrapper>
      </ModalBody>
    </Overlay>
  );
};

export default SampleReportModal;
