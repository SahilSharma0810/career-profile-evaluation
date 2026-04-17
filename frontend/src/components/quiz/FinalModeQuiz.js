import {
  ArrowLeft,
  ArrowRight
} from 'phosphor-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as ScalerLogo } from '../../assets/scaler-logo.svg';
import { useProfile } from '../../context/ProfileContext';
import tracker from '../../utils/tracker';
import { getPathWithQueryParams } from '../../utils/url';
import BackgroundSelectionSplit2 from './BackgroundSelectionSplit2';
import {
  NON_TECH_QUIZ_SCREENS,
  TECH_QUIZ_SCREENS
} from './ChattyQuizScreens';
import GroupedQuestionScreen from './GroupedQuestionScreen';
import SampleReportModal from './SampleReportModal';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const QuizContainer = styled.div`
  min-height: 100vh;
  background: var(--white);
  display: flex;
  flex-direction: column;
`;

const MainLayout = styled.div`
  flex: 1;
  display: flex;
  min-height: 100vh;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

/* ── Left Sidebar ──────────────────────────────────────────── */

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  background: var(--navy);
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 28px 24px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SidebarTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--white);

  svg {
    height: 22px;
    width: auto;
    filter: brightness(0) invert(1);
  }
`;

const LogoDivider = styled.span`
  color: rgba(255, 255, 255, 0.3);
`;

const StepDotsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StepDot = styled.div`
  height: 3px;
  flex: 1;
  background: ${props => props.$active ? 'var(--white)' : 'rgba(255, 255, 255, 0.2)'};
  transition: background 0.3s ease;
`;

const StepIndicator = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const SidebarCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
`;

const WhyLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 12px;
`;

const WhyText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
`;

const WhyDetail = styled.div`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin-top: 10px;
`;

const SidebarTitle = styled.h2`
  font-family: var(--serif);
  font-size: 1.625rem;
  font-weight: 500;
  color: var(--white);
  line-height: 1.25;
  margin: 0;
`;

const SidebarDesc = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 12px 0 0;
`;

const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
`;

const StatValue = styled.div`
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--white);
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
  margin-top: 2px;
`;

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlumniLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const CompanyPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CompanyPill = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  padding: 5px 10px;
`;

const SampleReportBtn = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--white);
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

/* ── Right Content ─────────────────────────────────────────── */

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;

  @media (max-width: 900px) {
    min-height: calc(100vh - 72px);
  }
`;

const MobileTopBar = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--navy);

    svg {
      height: 20px;
      width: auto;
      filter: brightness(0) invert(1);
    }
  }
`;

const MobileStepText = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentHeader = styled.div`
  padding: 0 48px;
  padding-top: 48px;
  max-width: 720px;

  @media (max-width: 900px) {
    padding: 32px 20px 0;
  }
`;

const StepMeta = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--accent-eye);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const ContentTitle = styled.h1`
  font-family: var(--serif);
  font-size: 2.25rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 40px;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 28px;
  }
`;

const QuizContent = styled.div`
  flex: 1;
  padding: 0 48px 120px;
  animation: ${fadeIn} 0.35s ease;

  @media (max-width: 900px) {
    padding: 0 20px 120px;
  }
`;

/* ── Bottom Nav ────────────────────────────────────────────── */

const BottomNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 280px;
  right: 0;
  background: var(--white);
  border-top: 1px solid var(--line);
  padding: 14px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 50;

  @media (max-width: 900px) {
    left: 0;
    padding: 12px 20px;
  }
`;

const BottomStepText = styled.div`
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink4);
  letter-spacing: 0.5px;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackBtn = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--line);
  cursor: pointer;
  color: var(--ink3);
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--line2);
    color: var(--ink);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ContinueBtn = styled.button`
  background: var(--accent);
  color: var(--white);
  border: none;
  padding: 10px 24px;
  font-family: var(--mono);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* ── Mobile Welcome ────────────────────────────────────────── */

const MobileWelcome = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--navy);
    color: var(--white);
  }
`;

const MobileWelcomeInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 24px 120px;
  gap: 20px;
`;

const MobileWelcomeTitle = styled.h1`
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 500;
  color: var(--white);
  margin: 0;
  line-height: 1.2;
`;

const MobileWelcomeDesc = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
`;

const MobileBottomCTA = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: var(--accent);
  color: var(--white);
  border: none;
  padding: 16px 24px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  z-index: 100;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  &:hover {
    background: #1d4ed8;
  }
`;

/* ── "Why we ask" content per step ─────────────────────────── */

const SIDEBAR_TEXT = {
  start: {
    label: '',
    heading: 'Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.',
    detail: ''
  },
  'who-you-are-tech': {
    label: 'Why we ask',
    heading: 'Your role shapes every gap, every recommendation, every alumni match in your report.',
    detail: 'We use this to pull the right data — not a generic readiness score.'
  },
  'where-you-want-to-go-tech': {
    label: 'Why we ask',
    heading: 'Your goal shapes the entire recommendation in your report.',
    detail: 'We match you with the right alumni stories, salary targets, and path forward.'
  },
  'your-readiness-tech': {
    label: 'Why we ask',
    heading: 'Fundamentals are still what separates candidates at the final round.',
    detail: 'Even in 2026, system design and problem solving come up in every senior interview.'
  },
  'who-you-are-nontech': {
    label: 'Why we ask',
    heading: 'Your background shapes the roadmap — not just your destination.',
    detail: 'Career switchers from sales, finance, and design all have different strengths to leverage.'
  },
  'where-you-want-to-go-nontech': {
    label: 'Why we ask',
    heading: "Tell us where you want to land — we'll show you who got there from where you are.",
    detail: 'We match you with real alumni who made the same switch.'
  },
  'your-readiness-nontech': {
    label: 'Why we ask',
    heading: 'Knowing where you are helps us show you the shortest path forward.',
    detail: "No worries if you're just getting started."
  }
};

const COMPANIES = ['Razorpay', 'Swiggy', 'PhonePe', 'Uber', 'CRED', 'Google', 'Amazon', 'Flipkart'];

const STEP_TITLES = {
  'who-you-are': { tech: 'Your Profile', nontech: 'Your Background' },
  'where-you-want-to-go': { tech: 'Your Aspirations', nontech: 'Your Aspirations' },
  'your-readiness': { tech: 'Your Fundamentals', nontech: 'Where You Stand' },
  'ai-fluency': { tech: 'AI Fluency', nontech: 'AI & Blockers' }
};

const SCREEN_HEADINGS = {
  'who-you-are': { tech: 'Tell us about your current role', nontech: 'Where are you coming from?' },
  'where-you-want-to-go': { tech: 'Where do you want to go?', nontech: 'Where do you want to go?' },
  'your-readiness': { tech: 'Where do you stand today?', nontech: 'How far along are you?' },
  'ai-fluency': { tech: 'How are you working with AI?', nontech: 'A couple more quick ones' }
};

/* ── Component ─────────────────────────────────────────────── */

const FinalModeQuiz = ({ onProgressChange }) => {
  const navigate = useNavigate();
  const {
    background,
    setBackground,
    quizResponses,
    setQuizResponse,
    addQAPair,
    clearQuizResponses,
    goals,
    evaluationResults
  } = useProfile();

  useEffect(() => {
    if (evaluationResults) {
      navigate(getPathWithQueryParams('/results'), { replace: true });
    }
  }, [evaluationResults, navigate]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [showMobileWelcome, setShowMobileWelcome] = useState(true);
  const [showSampleReport, setShowSampleReport] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getQuizScreens = () => {
    if (background === 'tech') return TECH_QUIZ_SCREENS;
    return NON_TECH_QUIZ_SCREENS;
  };

  const quizScreens = getQuizScreens();
  const totalSteps = 1 + quizScreens.length;

  useEffect(() => {
    const progress = ((currentStep + 1) / totalSteps) * 100;
    onProgressChange?.(progress);
  }, [currentStep, totalSteps, onProgressChange]);

  const handleBackgroundSelect = (selectedBackground) => {
    setBackground(selectedBackground);
    const backgroundLabels = {
      tech: 'Software, Data & AI Professional',
      'non-tech': 'Non-Tech / Career Switcher'
    };
    addQAPair(
      "What's your current background?",
      backgroundLabels[selectedBackground] || selectedBackground,
      'background'
    );
    setTimeout(() => handleNext(), 1000);
  };

  const handleQuizResponse = (questionId, option, question) => {
    setQuizResponse(questionId, option.value);
    const labelFields = ['currentRole', 'targetRole', 'targetCompany'];
    if (labelFields.includes(questionId)) {
      setQuizResponse(`${questionId}Label`, option.label);
    }
    if (question && question.question) {
      addQAPair(question.question, option.label || option.value, questionId);
    }
  };

  const handleNext = useCallback(() => {
    tracker.click({ click_type: 'quiz_next_button_clicked', custom: { source: 'final_mode_quiz' } });
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      tracker.ctaClick({ click_type: 'quiz_submit_button_clicked', custom: { source: 'final_mode_quiz' } });
      navigate(getPathWithQueryParams('/results'));
    }
  }, [currentStep, totalSteps, navigate]);

  const handlePrevious = useCallback(() => {
    tracker.click({ click_type: 'quiz_previous_step_clicked', custom: { source: 'final_mode_quiz' } });
    if (currentStep === 0) {
      navigate(getPathWithQueryParams('/'));
      return;
    }
    if (currentStep === 1) {
      clearQuizResponses();
      setBackground(null);
      setCurrentStep(0);
      return;
    }
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, clearQuizResponses, setBackground, navigate]);

  const canProceed = useCallback(() => {
    if (currentStep === 0) return !!background;
    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];
      return screen.questions.every((q) => {
        if (q.optional) return true;
        if (q.conditional && q.showIf) {
          if (!q.showIf(quizResponses)) return true;
        }
        return quizResponses[q.id] !== undefined && quizResponses[q.id] !== null;
      });
    }
    return false;
  }, [currentStep, quizScreens, quizResponses, background]);

  const getSidebarContent = () => {
    if (currentStep === 0) return SIDEBAR_TEXT.start;
    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];
      const suffix = background === 'tech' ? 'tech' : 'nontech';
      return SIDEBAR_TEXT[`${screen.id}-${suffix}`] || SIDEBAR_TEXT.start;
    }
    return SIDEBAR_TEXT.start;
  };

  const getStepTitle = () => {
    if (currentStep === 0) return null;
    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screenId = quizScreens[screenIndex].id;
      const variant = background === 'tech' ? 'tech' : 'nontech';
      return STEP_TITLES[screenId]?.[variant] || '';
    }
    return '';
  };

  const getContentHeading = () => {
    if (currentStep === 0) return null;
    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screenId = quizScreens[screenIndex].id;
      const variant = background === 'tech' ? 'tech' : 'nontech';
      return SCREEN_HEADINGS[screenId]?.[variant] || '';
    }
    return '';
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <BackgroundSelectionSplit2
          onSelect={handleBackgroundSelect}
          onAutoAdvance={handleNext}
        />
      );
    }
    const screenIndex = currentStep - 1;
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      const screen = quizScreens[screenIndex];
      const processedQuestions = screen.questions
        .filter((question) => {
          if (question.conditional && question.showIf) return question.showIf(quizResponses);
          return true;
        })
        .map((question) => {
          if (question.dynamicOptions && question.optionsByRole) {
            const currentRole = quizResponses.currentRole;
            const options = question.optionsByRole[currentRole] || question.optionsByRole['swe-product'] || [];
            return { ...question, options };
          }
          return question;
        });

      let questionStartIndex = 1;
      for (let i = 0; i < screenIndex; i++) {
        questionStartIndex += quizScreens[i].questions.length;
      }

      return (
        <GroupedQuestionScreen
          questions={processedQuestions}
          responses={quizResponses}
          onResponse={handleQuizResponse}
          initialChatText={screen.initialChatText}
          chatResponseMap={screen.chatResponseMap}
          questionStartIndex={questionStartIndex}
          onAutoAdvance={handleNext}
          hideChat={true}
        />
      );
    }
    return null;
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;
  const sidebarContent = getSidebarContent();
  const stepTitle = getStepTitle();
  const contentHeading = getContentHeading();

  if (isMobile && showMobileWelcome && currentStep === 0) {
    return (
      <MobileWelcome>
        <MobileWelcomeInner>
          <LogoRow>
            <ScalerLogo aria-label="Scaler" />
            <LogoDivider>/</LogoDivider>
            <span>CPE</span>
          </LogoRow>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Free · Takes 3 minutes</div>
            <MobileWelcomeTitle>Your AI Career Report</MobileWelcomeTitle>
            <MobileWelcomeDesc>
              Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.
            </MobileWelcomeDesc>
          </div>
        </MobileWelcomeInner>
        <MobileBottomCTA onClick={() => setShowMobileWelcome(false)}>
          Get Started →
        </MobileBottomCTA>
      </MobileWelcome>
    );
  }

  return (
    <>
      <QuizContainer>
        <MainLayout>
          <Sidebar>
            <SidebarTop>
              <LogoRow>
                <ScalerLogo aria-label="Scaler" />
                <LogoDivider>/</LogoDivider>
                <span>CPE</span>
              </LogoRow>

              {currentStep === 0 ? (
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
                  Free · Takes 3 minutes
                  </div>
                  <SidebarTitle>Your AI Career Report</SidebarTitle>
                  <SidebarDesc>
                  Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.
                  </SidebarDesc>
                  {/* <StatsColumn>
                    <StatCard>
                      <StatValue>50K+</StatValue>
                      <StatLabel>profiles evaluated in the last 12 months</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>2.5×</StatValue>
                      <StatLabel>average salary jump for Scaler alumni</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue>73%</StatValue>
                      <StatLabel>of backend roles now require AI fluency</StatLabel>
                    </StatCard>
                  </StatsColumn> */}
                </div>
              ) : (
                <div>
                  <StepIndicator>Step {currentStep} of {quizScreens.length}</StepIndicator>
                  <StepDotsRow>
                    {quizScreens.map((_, i) => (
                      <StepDot key={i} $active={i < currentStep} />
                    ))}
                  </StepDotsRow>
                  <div style={{ marginTop: '24px' }}>
                    <SidebarCard>
                      <WhyLabel>{sidebarContent.label}</WhyLabel>
                      <WhyText>{sidebarContent.heading}</WhyText>
                      {sidebarContent.detail && (
                        <WhyDetail>{sidebarContent.detail}</WhyDetail>
                      )}
                    </SidebarCard>
                  </div>
                </div>
              )}
            </SidebarTop>

            <SidebarBottom>
              <SampleReportBtn onClick={() => setShowSampleReport(true)}>
              View Sample Report
              </SampleReportBtn>
              <AlumniLabel>Alumni working at</AlumniLabel>
              <CompanyPills>
                {COMPANIES.map((name, i) => (
                  <CompanyPill key={i}>{name}</CompanyPill>
                ))}
              </CompanyPills>
            </SidebarBottom>
          </Sidebar>

          <ContentArea>
            <MobileTopBar>
              <ScalerLogo aria-label="Scaler" />
              {currentStep > 0 && (
                <MobileStepText>Step {currentStep} of {quizScreens.length}</MobileStepText>
              )}
            </MobileTopBar>

            {currentStep > 0 && (
              <ContentHeader>
                <StepMeta>
                Step {currentStep} of {quizScreens.length} — {stepTitle}
                </StepMeta>
                <ContentTitle>{contentHeading}</ContentTitle>
              </ContentHeader>
            )}

            <QuizContent key={currentStep}>
              {currentStep === 0 ? (
                <div style={{ padding: '48px 0 0' }}>
                  {renderContent()}
                </div>
              ) : (
                renderContent()
              )}
            </QuizContent>

            <BottomNav>
              <BottomStepText>
              Step {Math.max(currentStep, 1)} of {quizScreens.length}
              </BottomStepText>
              <NavButtons>
                <BackBtn onClick={handlePrevious} disabled={currentStep === 0} aria-label="Back">
                  <ArrowLeft size={18} />
                </BackBtn>
                {isLastStep ? (
                  <ContinueBtn onClick={handleNext} disabled={!canProceed()}>
                  See My Report
                    <ArrowRight size={14} />
                  </ContinueBtn>
                ) : (
                  <ContinueBtn onClick={handleNext} disabled={!canProceed()}>
                  Continue
                    <ArrowRight size={14} />
                  </ContinueBtn>
                )}
              </NavButtons>
            </BottomNav>
          </ContentArea>
        </MainLayout>
      </QuizContainer>
      {showSampleReport && (
        <SampleReportModal onClose={() => setShowSampleReport(false)} />
      )}
    </>
  );
};

export default FinalModeQuiz;
