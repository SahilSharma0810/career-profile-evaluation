import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ReactComponent as ScalerLogo } from '../../assets/scaler-logo.svg';
import { useRequestCallback } from '../../app/context/RequestCallbackContext';
import tracker from '../../utils/tracker';
import useSectionViewTracking from '../../hooks/useSectionViewTracking';
import HeroChapter from './chapters/HeroChapter';
import TenXEngineerChapter from './chapters/TenXEngineerChapter';
import SkillsChapter from './chapters/SkillsChapter';
import TwoPathsChapter from './chapters/TwoPathsChapter';
import TimelineChapter from './chapters/TimelineChapter';
import AlumniChapter from './chapters/AlumniChapter';
import AIShiftChapter from './chapters/AIShiftChapter';
import ToolsChapter from './chapters/ToolsChapter';
import FinalCTAChapter from './chapters/FinalCTAChapter';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--white);
`;

const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--white);
  border-bottom: 1px solid var(--line);
  padding: 14px 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--sans);

  @media (max-width: 768px) {
    padding: 12px 20px;
  }

  svg {
    height: 22px;
    width: auto;
  }
`;

const TopBarDivider = styled.span`
  color: var(--line2);
  font-size: 0.875rem;
`;

const TopBarLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink3);
`;

const StickyBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 110;
  background: #002a86;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  padding: 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 10px 14px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  @media print {
    display: none;
  }
`;

const StickyText = styled.div`
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  line-height: 1.2;
`;

const StickyTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
`;

const StickySubtitle = styled.div`
  font-size: 0.8125rem;
  opacity: 0.92;
`;

const StickyBtn = styled.button`
  background: transparent;
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 8px 12px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  letter-spacing: 0.2px;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: var(--white);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BottomSpacer = styled.div`
  height: 58px;
  @media (max-width: 768px) {
    height: 106px;
  }
`;

const ReportPage = ({
  evaluationResults,
  background,
  quizResponses,
  goals,
  hideCTAs = false,
  isPreview = false,
  onPreviewCTAClick = null
}) => {
  const { open: openCallbackModal } = useRequestCallback();

  const sectionTrackingConfig = useMemo(() => [
    { id: 'cpe-hero-section', name: 'CPE Hero Section' },
    { id: 'cpe-10x-section', name: 'CPE 10x Engineer' },
    { id: 'cpe-skills-section', name: 'CPE Skills Analysis' },
    { id: 'cpe-two-paths', name: 'CPE Two Paths' },
    { id: 'cpe-career-timeline', name: 'CPE Career Timeline' },
    { id: 'cpe-alumni-section', name: 'CPE Alumni Stories' },
    { id: 'cpe-ai-shift', name: 'CPE AI Shift' },
    { id: 'cpe-tools-section', name: 'CPE Tools Section' }
  ], []);

  useSectionViewTracking(sectionTrackingConfig, {
    enabled: !isPreview && !!evaluationResults,
    customAttributes: { page: 'cpe_results' }
  });

  const handleCTAClick = useCallback((source) => {
    if (isPreview) {
      onPreviewCTAClick?.();
      return;
    }
    tracker.click({ click_type: 'rcb_btn_clicked', custom: { source } });
    tracker.ctaClick({ click_type: 'rcb_btn_clicked', custom: { source } });
    openCallbackModal?.({ source });
  }, [isPreview, onPreviewCTAClick, openCallbackModal]);

  const score = evaluationResults?.profile_strength_score || 0;
  const strengths = evaluationResults?.skill_analysis?.strengths || [];
  const areasToImprove = evaluationResults?.skill_analysis?.areas_to_develop || [];
  const recommendedRoles = evaluationResults?.recommended_roles_based_on_interests || [];
  const tools = evaluationResults?.recommended_tools || [];
  const targetRole = quizResponses?.targetRole || quizResponses?.targetRoleLabel || '';

  return (
    <PageWrapper>
      <HeroChapter
        score={score}
        targetRole={targetRole}
        quizResponses={quizResponses}
        background={background}
        hideCTAs={hideCTAs}
        isPreview={isPreview}
        onCTAClick={() => handleCTAClick('report_hero_cta')}
      />

      <TenXEngineerChapter targetRole={targetRole} />

      {(strengths.length > 0 || areasToImprove.length > 0) && (
        <SkillsChapter
          strengths={strengths}
          areasToImprove={areasToImprove}
        />
      )}

      <TwoPathsChapter
        targetRole={targetRole}
        hideCTAs={hideCTAs}
      />

      {recommendedRoles.length > 0 && (
        <TimelineChapter
          recommendedRoles={recommendedRoles}
        />
      )}

      <AlumniChapter targetRole={targetRole} />

      <AIShiftChapter />

      <ToolsChapter tools={tools} />

      {!hideCTAs && (
        <FinalCTAChapter
          targetRole={targetRole}
          isPreview={isPreview}
          onCTAClick={() => handleCTAClick('report_final_cta')}
        />
      )}

      {!hideCTAs && (
        <>
          <StickyBottom>
            <StickyText>
              <StickyTitle>{isPreview ? 'Sample report.' : 'Need help?'}</StickyTitle>
              <StickySubtitle>
                {isPreview
                  ? 'Complete the quiz to get your personalized report.'
                  : 'Talk to us at 08047399623'}
              </StickySubtitle>
            </StickyText>
            <StickyBtn onClick={() => handleCTAClick('report_sticky_cta')}>
              {isPreview ? (
                'Back to Quiz'
              ) : (
                <>
                  Request a Call
                  <span aria-hidden="true">↗</span>
                </>
              )}
            </StickyBtn>
          </StickyBottom>
          <BottomSpacer />
        </>
      )}
    </PageWrapper>
  );
};

export default ReportPage;
