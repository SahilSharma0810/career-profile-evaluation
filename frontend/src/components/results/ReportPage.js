import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Phone } from 'phosphor-react';
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
  background: #ffffff;
`;

const ReportPage = ({
  evaluationResults,
  background,
  quizResponses,
  goals,
  hideCTAs = false
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
    enabled: !!evaluationResults,
    customAttributes: { page: 'cpe_results' }
  });

  const handleCTAClick = useCallback((source) => {
    tracker.click({ click_type: 'rcb_btn_clicked', custom: { source } });
    tracker.ctaClick({ click_type: 'rcb_btn_clicked', custom: { source } });
    openCallbackModal?.({ source });
  }, [openCallbackModal]);

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
          onCTAClick={() => handleCTAClick('report_final_cta')}
        />
      )}
    </PageWrapper>
  );
};

export default ReportPage;
