import {
  CaretLeft,
  CaretRight
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

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

/* ── Layout ────────────────────────────────────────────────── */

const QuizContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f1f5f9;
  z-index: 300;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #0041ca;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
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
  width: 340px;
  flex-shrink: 0;
  background: #fafbfc;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 32px 28px;
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
  gap: 48px;
`;

const LogoWrap = styled.div`
  svg {
    height: 28px;
    width: auto;
  }
`;

const SidebarStepLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
`;

const SidebarHeading = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #475569;
  line-height: 1.6;
`;

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AlumniLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
`;

const LogoTicker = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    z-index: 2;
    pointer-events: none;
  }
  &::before {
    left: 0;
    background: linear-gradient(to right, #fafbfc, transparent);
  }
  &::after {
    right: 0;
    background: linear-gradient(to left, #fafbfc, transparent);
  }
`;

const LogoTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
  padding-right: 36px;
  animation: ${scroll} 25s linear infinite;
  width: fit-content;
  will-change: transform;
`;

const CompanyLogo = styled.img`
  height: 28px;
  width: auto;
  object-fit: contain;
  opacity: 0.6;
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

const TopNav = styled.div`
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
  padding: 16px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 900px) {
    padding: 12px 20px;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MobileLogoWrap = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    svg {
      height: 22px;
      width: auto;
    }
  }
`;

const StepLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NavBtn = styled.button`
  background: ${props => props.$primary ? '#1e293b' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#475569'};
  border: 1.5px solid ${props => props.$primary ? '#1e293b' : '#e2e8f0'};
  padding: ${props => props.$primary ? '10px 22px' : '10px 14px'};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
    border-color: ${props => props.$primary ? '#0f172a' : '#cbd5e1'};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (max-width: 900px) {
    padding: ${props => props.$primary ? '12px 20px' : '12px 14px'};
    font-size: 0.8125rem;
  }
`;

const QuizContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 56px 48px 80px;
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 900px) {
    padding: 32px 20px 100px;
  }
`;

/* ── Mobile Welcome ────────────────────────────────────────── */

const MobileWelcome = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 24px 20px 120px;
    background: #ffffff;
  }
`;

const WelcomeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.3;
`;

const MobileBottomCTA = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #1e293b;
  color: #ffffff;
  border: none;
  padding: 16px 24px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  z-index: 100;
  letter-spacing: 0.5px;

  &:hover {
    background: #0f172a;
  }
`;

/* ── "Why we ask" content per step ─────────────────────────── */

const SIDEBAR_TEXT = {
  start: {
    label: '',
    text: 'Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.'
  },
  'who-you-are-tech': {
    label: 'Why we ask',
    text: 'Your role shapes every gap, every recommendation, every alumni match in your report. We use this to pull the right data — not a generic readiness score.'
  },
  'where-you-want-to-go-tech': {
    label: 'Why we ask',
    text: 'Your goal shapes the entire recommendation in your report. We match you with the right alumni stories, salary targets, and path forward.'
  },
  'your-readiness-tech': {
    label: 'Why we ask',
    text: 'Fundamentals are still what separates candidates at the final round. Even in 2026, system design and problem solving come up in every senior interview.'
  },
  'who-you-are-nontech': {
    label: 'Why we ask',
    text: 'Your background shapes the roadmap — not just your destination. Career switchers from sales, finance, and design all have different strengths to leverage.'
  },
  'where-you-want-to-go-nontech': {
    label: 'Why we ask',
    text: 'Tell us where you want to land — we\'ll show you who got there from where you are. We match you with real alumni who made the same switch.'
  },
  'your-readiness-nontech': {
    label: 'Why we ask',
    text: 'Knowing where you are helps us show you the shortest path forward. No worries if you\'re just getting started.'
  }
};

const COMPANIES = [
  { name: 'Google', logo: 'https://cdn.brandfetch.io/google.com/w/400/h/400' },
  { name: 'Amazon', logo: 'https://cdn.brandfetch.io/amazon.com/w/400/h/400' },
  { name: 'Flipkart', logo: 'https://cdn.brandfetch.io/flipkart.com/w/400/h/400' },
  { name: 'Microsoft', logo: 'https://cdn.brandfetch.io/microsoft.com/w/400/h/400' },
  { name: 'Razorpay', logo: 'https://cdn.brandfetch.io/razorpay.com/w/400/h/400' },
  { name: 'Swiggy', logo: 'https://cdn.brandfetch.io/swiggy.com/w/400/h/400' },
  { name: 'CRED', logo: 'https://cdn.brandfetch.io/cred.club/w/400/h/400' },
  { name: 'PhonePe', logo: 'https://cdn.brandfetch.io/phonepe.com/w/400/h/400' }
];

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
    const screenTitles = {
      'who-you-are': background === 'tech' ? 'Your Profile' : 'Your Background',
      'where-you-want-to-go': 'Your Aspirations',
      'your-readiness': background === 'tech' ? 'Your Fundamentals' : 'Where You Stand'
    };
    if (screenIndex >= 0 && screenIndex < quizScreens.length) {
      return screenTitles[quizScreens[screenIndex].id] || '';
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

      let questionStartIndex = 2;
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

  // Mobile welcome
  if (isMobile && showMobileWelcome && currentStep === 0) {
    return (
      <MobileWelcome>
        <WelcomeContent>
          <LogoWrap><ScalerLogo aria-label="Scaler" /></LogoWrap>
          <div style={{ marginTop: '24px' }}>
            <WelcomeTitle>Your AI Career Report</WelcomeTitle>
            <WelcomeSubtitle style={{ marginTop: '12px' }}>
              Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.
            </WelcomeSubtitle>
          </div>
          <StatsRow>
            <StatItem>
              <StatValue>50K+</StatValue>
              <StatLabel>profiles evaluated<br />in the last 12 months</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>2.5×</StatValue>
              <StatLabel>average salary jump<br />for Scaler alumni</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>73%</StatValue>
              <StatLabel>of backend roles now<br />require AI fluency</StatLabel>
            </StatItem>
          </StatsRow>
        </WelcomeContent>
        <MobileBottomCTA onClick={() => setShowMobileWelcome(false)}>
          Get Started
        </MobileBottomCTA>
      </MobileWelcome>
    );
  }

  return (
    <QuizContainer>
      <ProgressBarContainer>
        <ProgressBarFill $progress={progress} />
      </ProgressBarContainer>

      <MainLayout>
        {/* Left sidebar */}
        <Sidebar>
          <SidebarTop>
            <LogoWrap><ScalerLogo aria-label="Scaler" /></LogoWrap>
            <div>
              {currentStep === 0 ? (
                <>
                  <SidebarStepLabel>Free · Takes 3 minutes</SidebarStepLabel>
                  <SidebarHeading>
                    Answer a few questions. Get a personalised report showing exactly where you stand — and what to do next.
                  </SidebarHeading>
                  <StatsRow style={{ marginTop: '24px' }}>
                    <StatItem>
                      <StatValue>50K+</StatValue>
                      <StatLabel>profiles evaluated</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatValue>2.5×</StatValue>
                      <StatLabel>avg salary jump</StatLabel>
                    </StatItem>
                  </StatsRow>
                </>
              ) : (
                <>
                  <SidebarStepLabel>{sidebarContent.label}</SidebarStepLabel>
                  <SidebarHeading>{sidebarContent.text}</SidebarHeading>
                </>
              )}
            </div>
          </SidebarTop>
          <SidebarBottom>
            <AlumniLabel>Alumni working at</AlumniLabel>
            <LogoTicker>
              <LogoTrack>
                {COMPANIES.map((c, i) => (
                  <CompanyLogo key={`a-${i}`} src={c.logo} alt={c.name} />
                ))}
                {COMPANIES.map((c, i) => (
                  <CompanyLogo key={`b-${i}`} src={c.logo} alt={c.name} />
                ))}
              </LogoTrack>
            </LogoTicker>
          </SidebarBottom>
        </Sidebar>

        {/* Right content */}
        <ContentArea>
          <TopNav>
            <NavLeft>
              <MobileLogoWrap><ScalerLogo aria-label="Scaler" /></MobileLogoWrap>
              {currentStep > 0 && (
                <StepLabel>
                  Step {currentStep} of {quizScreens.length}
                  {stepTitle && ` — ${stepTitle}`}
                </StepLabel>
              )}
            </NavLeft>
            <NavButtons>
              <NavBtn onClick={handlePrevious} disabled={currentStep === 0} aria-label="Back">
                <CaretLeft size={18} weight="bold" />
              </NavBtn>
              {isLastStep ? (
                <NavBtn $primary onClick={handleNext} disabled={!canProceed()}>
                  See My Report
                  <CaretRight size={16} weight="bold" />
                </NavBtn>
              ) : (
                <NavBtn onClick={handleNext} disabled={!canProceed()}>
                  Continue
                  <CaretRight size={18} weight="bold" />
                </NavBtn>
              )}
            </NavButtons>
          </TopNav>

          <QuizContent key={currentStep}>
            {renderContent()}
          </QuizContent>
        </ContentArea>
      </MainLayout>
    </QuizContainer>
  );
};

export default FinalModeQuiz;
