import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import {
  MagnifyingGlass,
  FileText,
  CheckCircle,
  House,
  Target,
  Lightbulb,
  Rocket,
  Books,
  ChartLine
} from 'phosphor-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import BasicAuthModal from '../auth/BasicAuthModal';
import { apiRequest } from '../../utils/api';
import {
  MBA_INTAKE_SCREEN_1,
  MBA_INTAKE_SCREEN_2,
  MBA_ROLE_SPECIFIC_SCREENS
} from '../quiz/MBAQuizScreens';

// Build a mapping of question IDs to their full question text and metadata
const buildQuestionMap = () => {
  const questionMap = {};
  
  // Add intake screen 1 questions
  MBA_INTAKE_SCREEN_1.questions.forEach(q => {
    questionMap[q.id] = {
      question: q.question,
      helperText: q.helperText,
      options: q.options?.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {})
    };
  });
  
  // Add intake screen 2 questions
  MBA_INTAKE_SCREEN_2.questions.forEach(q => {
    questionMap[q.id] = {
      question: q.question,
      helperText: q.helperText,
      options: q.options?.reduce((acc, opt) => {
        acc[opt.value] = opt.label;
        return acc;
      }, {})
    };
  });
  
  // Add role-specific questions
  // MBA_ROLE_SPECIFIC_SCREENS is now nested: { role: { '0-3': [...], '3-8': [...], '8+': [...] } }
  Object.values(MBA_ROLE_SPECIFIC_SCREENS).forEach(experienceLevels => {
    // experienceLevels is an object like { '0-3': [...], '3-8': [...], '8+': [...] }
    Object.values(experienceLevels).forEach(screens => {
      // screens is an array of screen objects
      screens.forEach(screen => {
        screen.questions.forEach(q => {
          questionMap[q.id] = {
            question: q.question,
            helperText: q.helperText,
            isScenario: q.isScenario,
            options: q.options?.reduce((acc, opt) => {
              acc[opt.value] = opt.label;
              return acc;
            }, {})
          };
        });
      });
    });
  });
  
  return questionMap;
};

const MBA_QUESTION_MAP = buildQuestionMap();

const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      margin: 12mm;
    }

    body {
      background: white !important;
      color: #1e293b;
    }
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const ResultsContainer = styled.div`
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 24px 0;
  }

  @media print {
    min-height: auto;
    background: white;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 100px;

  @media (max-width: 1024px) {
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media print {
    max-width: none;
    margin: 0;
    padding: 0 24px;
  }
`;

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  @media print {
    display: none;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MBABadge = styled.span`
  background: #D55D26;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 12px;
`;

const Section = styled.div`
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #D55D26;
  flex-shrink: 0;
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
`;

const LoadingSubtext = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  overflow: hidden;
  margin-top: 24px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #D55D26 0%, #ea580c 100%);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ErrorContainer = styled(LoadingContainer)`
  flex-direction: column;
  gap: 16px;
  color: #dc2626;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #b91c1c;
`;

const ErrorMessage = styled.p`
  font-size: 0.95rem;
  color: #7f1d1d;
  margin: 0;
`;

const PrimaryButton = styled.button`
  background: #D55D26;
  color: white;
  border: none;
  padding: 12px 24px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #b84d1f;
  }

  @media print {
    display: none;
  }
`;

const QASection = styled.div`
  background: white;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const QATitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QAList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QAItem = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-left: 3px solid #D55D26;
`;

const QuestionText = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

const QuestionBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.variant === 'scenario' ? '#fef3c7' : '#e0f2fe'};
  color: ${props => props.variant === 'scenario' ? '#92400e' : '#0369a1'};
`;

const QuestionHelperText = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
  margin-top: 4px;
`;

const AnswerText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1e293b;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  margin-top: 8px;
`;

// Score Section
const ScoreSection = styled.div`
  background: #0F2B48;
  color: white;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
`;

const ScoreInfo = styled.div`
  flex: 1;
`;

const ScoreTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const ScoreSubtitle = styled.p`
  font-size: 0.9375rem;
  margin: 0;
  opacity: 0.85;
`;

const ScoreDisplay = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: white;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
`;

// Quick Wins Section
const QuickWinsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuickWinItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e7e5e4;
`;

const QuickWinNumber = styled.div`
  background: #D55D26;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const QuickWinContent = styled.div`
  flex: 1;
`;

const QuickWinTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const QuickWinDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`;

// Skills Section
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const SkillCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e7e5e4;
  padding: 16px;
`;

const SkillName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const SkillLevel = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    if (props.level === 1) return 'background: #fee2e2; color: #991b1b;';
    if (props.level === 2) return 'background: #fff4ed; color: #D55D26;';
    return 'background: #d1fae5; color: #065f46;';
  }}
`;

// AI Tools Section
const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ToolCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e7e5e4;
  padding: 16px;
`;

const ToolName = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const ToolDescription = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
`;

// Career Transitions Section
const TransitionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TransitionCard = styled.div`
  background: ${props => props.isPrimary ? '#fff7ed' : '#f8fafc'};
  border: 1px solid ${props => props.isPrimary ? '#fed7aa' : '#e7e5e4'};
  padding: 20px;
`;

const TransitionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TransitionTitle = styled.h4`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const TransitionSalary = styled.span`
  background: transparent;
  border: 1px solid #D55D26;
  color: #D55D26;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TransitionDescription = styled.p`
  font-size: 0.875rem;
  color: #475569;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const TransitionActions = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TransitionActionItem = styled.li`
  font-size: 0.8125rem;
  color: #1e293b;
  padding: 4px 0;
  padding-left: 20px;
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #D55D26;
    font-weight: bold;
  }
`;

const MBAAdminViewPage = () => {
  const { response_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: <MagnifyingGlass size={28} weight="bold" />, text: 'Authenticating...', subtext: 'Verifying your credentials' },
    { icon: <FileText size={28} weight="bold" />, text: 'Loading MBA evaluation...', subtext: 'Fetching Business <> AI readiness report' },
    { icon: <CheckCircle size={28} weight="bold" />, text: 'Preparing results...', subtext: 'Almost there!' }
  ];

  // Loading animation effect
  useEffect(() => {
    if (loading && !showAuthModal) {
      setLoadingProgress(0);
      setLoadingStep(0);

      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 2;
        });
      }, 100);

      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
      };
    }
  }, [loading, showAuthModal]);

  // Fetch MBA response data
  const fetchResponse = useCallback(async (authUsername, authPassword) => {
    setError(null);
    setAuthError('');
    setLoading(true);

    try {
      const credentials = btoa(`${authUsername}:${authPassword}`);
      const response = await fetch(
        `/career-profile-tool/api/mba/admin/view/${response_id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Accept': 'application/json'
          }
        }
      );

      if (response.status === 401) {
        const errorJson = await response.json().catch(() => ({}));
        setShowAuthModal(true);
        setAuthError(errorJson.detail || 'Invalid username or password. Please try again.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        setShowAuthModal(false);
        setError(errorJson.detail || 'MBA response not found for the given ID.');
        setLoading(false);
        return;
      }

      const result = await response.json();
      setData(result);
      setShowAuthModal(false);
      setAuthError('');
      setLoading(false);
    } catch (err) {
      console.error('Error fetching MBA response:', err);
      setError('Failed to fetch MBA evaluation. Please try again.');
      setLoading(false);
    }
  }, [response_id]);

  useEffect(() => {
    if (response_id) {
      setShowAuthModal(true);
      setLoading(false);
    }
  }, [response_id]);

  const handleAuthSubmit = (username, password) => {
    fetchResponse(username, password);
  };

  const handleCancel = () => {
    setShowAuthModal(false);
    setAuthError('');
    navigate('/');
  };

  if (showAuthModal) {
    return (
      <BasicAuthModal
        show={showAuthModal}
        onSubmit={handleAuthSubmit}
        onCancel={handleCancel}
        title="Sign in"
        origin={window.location.origin}
        error={authError}
        loading={loading}
      />
    );
  }

  if (loading) {
    const currentStep = loadingSteps[loadingStep];
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>
            <LoadingContent>
              <LoadingIcon>
                {currentStep.icon}
              </LoadingIcon>
              <div>
                <LoadingText>{currentStep.text}</LoadingText>
                <LoadingSubtext>{currentStep.subtext}</LoadingSubtext>
              </div>
            </LoadingContent>
            <ProgressBarContainer>
              <ProgressBarFill progress={loadingProgress} />
            </ProgressBarContainer>
          </LoadingContainer>
        </Container>
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <Container>
          <ErrorContainer>
            <ErrorTitle>We ran into a problem</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <PrimaryButton onClick={() => navigate('/')}>
              <House size={20} weight="bold" />
              Back to Home
            </PrimaryButton>
          </ErrorContainer>
        </Container>
      </ResultsContainer>
    );
  }

  if (!data || !data.response) {
    return (
      <ResultsContainer>
        <Container>
          <ErrorContainer>
            <ErrorTitle>Invalid Data Format</ErrorTitle>
            <ErrorMessage>Unable to display MBA evaluation results. The response data may be corrupted.</ErrorMessage>
            <PrimaryButton onClick={() => navigate('/')}>
              <House size={20} weight="bold" />
              Back to Home
            </PrimaryButton>
          </ErrorContainer>
        </Container>
      </ResultsContainer>
    );
  }

  const evaluationResults = data.response;
  const userInput = data.user_input || {};
  const quizResponses = userInput.quizResponses || {};

  // Extract quiz Q&A pairs for display with full question text
  const qaPairs = Object.entries(quizResponses)
    .filter(([key]) => !['currentRole', 'experience', 'careerGoal', 'role', 'career_goal', 'primaryGoal'].includes(key))
    .map(([key, value]) => {
      const questionData = MBA_QUESTION_MAP[key];
      const displayAnswer = questionData?.options?.[value] || value;
      
      return {
        questionId: key,
        question: questionData?.question || key.replace(/-/g, ' ').replace(/_/g, ' '),
        helperText: questionData?.helperText,
        isScenario: questionData?.isScenario,
        answer: displayAnswer,
        rawValue: value
      };
    });

  // Helper to get readable answer for core fields
  const getReadableAnswer = (questionId, value) => {
    const questionData = MBA_QUESTION_MAP[questionId];
    
    // Handle arrays (for multiselect questions like primaryGoal)
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Not specified';
      return value.map(v => questionData?.options?.[v] || v).join(', ');
    }
    
    return questionData?.options?.[value] || value || 'Not specified';
  };

  const getSkillLevelLabel = (level) => {
    if (level === 1) return 'Weak';
    if (level === 2) return 'Needs Improvement';
    return 'Proficient';
  };

  return (
    <ResultsContainer>
      <PrintStyles />
      <Container>
        <PageHeader>
          <PageTitle>
            Admin Response Viewer
            <MBABadge>MBA CPE</MBABadge>
          </PageTitle>
        </PageHeader>

        {/* Score Section */}
        {evaluationResults.readiness && (
          <ScoreSection>
            <ScoreInfo>
              <ScoreTitle>Business {'<>'} AI Readiness Report</ScoreTitle>
              <ScoreSubtitle>
                {evaluationResults.persona?.variant_description || 
                  'Comprehensive evaluation of AI-powered business transformation readiness'}
              </ScoreSubtitle>
              {evaluationResults.persona?.persona_tags && (
                <TagsContainer>
                  {evaluationResults.persona.persona_tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </TagsContainer>
              )}
            </ScoreInfo>
            <ScoreDisplay>{evaluationResults.readiness.overall_score}%</ScoreDisplay>
          </ScoreSection>
        )}

        {/* Quiz Responses */}
        <QASection>
          <QATitle>
            <FileText size={20} weight="bold" color="#D55D26" />
            Quiz Questions & Answers
          </QATitle>
          <QAList>
            {/* Role and Experience - Core Profile Questions */}
            <QAItem>
              <QuestionMeta>
                <QuestionBadge>Profile</QuestionBadge>
              </QuestionMeta>
              <QuestionText>What's your current role or background?</QuestionText>
              <AnswerText>{getReadableAnswer('currentRole', quizResponses.currentRole || quizResponses.role)}</AnswerText>
            </QAItem>
            <QAItem>
              <QuestionMeta>
                <QuestionBadge>Profile</QuestionBadge>
              </QuestionMeta>
              <QuestionText>How many years of total work experience do you have?</QuestionText>
              <AnswerText>{getReadableAnswer('experience', quizResponses.experience)}</AnswerText>
            </QAItem>
            <QAItem>
              <QuestionMeta>
                <QuestionBadge>Profile</QuestionBadge>
              </QuestionMeta>
              <QuestionText>What's your primary career goal?</QuestionText>
              <AnswerText>{getReadableAnswer('primaryGoal', quizResponses.primaryGoal || quizResponses.careerGoal || quizResponses.career_goal)}</AnswerText>
            </QAItem>
            
            {/* Role-specific deep-dive questions */}
            {qaPairs.length > 0 && (
              <>
                {qaPairs.map((qa, index) => (
                  <QAItem key={index}>
                    <QuestionMeta>
                      {qa.isScenario && <QuestionBadge variant="scenario">Scenario</QuestionBadge>}
                      <QuestionBadge>Q{index + 4}</QuestionBadge>
                    </QuestionMeta>
                    <QuestionText>{qa.question}</QuestionText>
                    {qa.helperText && <QuestionHelperText>{qa.helperText}</QuestionHelperText>}
                    <AnswerText>{qa.answer}</AnswerText>
                  </QAItem>
                ))}
              </>
            )}
          </QAList>
        </QASection>

        {/* Skills Analysis */}
        {evaluationResults.skills?.skills && (
          <Section>
            <SectionTitle>Skills Analysis</SectionTitle>
            <SkillsGrid>
              {Object.entries(evaluationResults.skills.skills).map(([skillName, skillData]) => (
                <SkillCard key={skillName}>
                  <SkillName>{skillData.title || skillName.replace(/_/g, ' ')}</SkillName>
                  <SkillLevel level={skillData.level}>
                    {getSkillLevelLabel(skillData.level)}
                  </SkillLevel>
                </SkillCard>
              ))}
            </SkillsGrid>
          </Section>
        )}

        {/* Career Transitions */}
        {evaluationResults.career_transitions && evaluationResults.career_transitions.length > 0 && (
          <Section>
            <SectionTitle>Career Transitions</SectionTitle>
            <TransitionsList>
              {evaluationResults.career_transitions.slice(0, 3).map((transition, index) => (
                <TransitionCard key={index} isPrimary={index === 0}>
                  <TransitionHeader>
                    <TransitionTitle>{transition.title}</TransitionTitle>
                    {transition.salary && (
                      <TransitionSalary>{transition.salary}</TransitionSalary>
                    )}
                  </TransitionHeader>
                  {transition.description && (
                    <TransitionDescription>{transition.description}</TransitionDescription>
                  )}
                  {transition.action_items && transition.action_items.length > 0 && (
                    <TransitionActions>
                      {transition.action_items.map((item, idx) => (
                        <TransitionActionItem key={idx}>{item}</TransitionActionItem>
                      ))}
                    </TransitionActions>
                  )}
                </TransitionCard>
              ))}
            </TransitionsList>
          </Section>
        )}

        {/* Quick Wins */}
        {evaluationResults.quick_wins && evaluationResults.quick_wins.length > 0 && (
          <Section>
            <SectionTitle>Quick Wins</SectionTitle>
            <QuickWinsList>
              {evaluationResults.quick_wins.slice(0, 4).map((win, index) => (
                <QuickWinItem key={index}>
                  <QuickWinNumber>{index + 1}</QuickWinNumber>
                  <QuickWinContent>
                    <QuickWinTitle>{win.title}</QuickWinTitle>
                    <QuickWinDescription>{win.description}</QuickWinDescription>
                  </QuickWinContent>
                </QuickWinItem>
              ))}
            </QuickWinsList>
          </Section>
        )}

        {/* AI Tools */}
        {evaluationResults.ai_tools && evaluationResults.ai_tools.length > 0 && (
          <Section>
            <SectionTitle>AI Tools & Technologies</SectionTitle>
            <ToolsGrid>
              {evaluationResults.ai_tools.slice(0, 8).map((tool, index) => (
                <ToolCard key={index}>
                  <ToolName>{tool.name}</ToolName>
                  <ToolDescription>{tool.use_case}</ToolDescription>
                </ToolCard>
              ))}
            </ToolsGrid>
          </Section>
        )}

        {/* Industry Stats */}
        {evaluationResults.industry_stats && evaluationResults.industry_stats.length > 0 && (
          <Section>
            <SectionTitle>Industry Statistics</SectionTitle>
            <ToolsGrid>
              {evaluationResults.industry_stats.slice(0, 3).map((stat, index) => (
                <ToolCard key={index}>
                  <ToolName>{stat.stat}</ToolName>
                  <ToolDescription>{stat.description}</ToolDescription>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Source: {stat.source}
                  </div>
                </ToolCard>
              ))}
            </ToolsGrid>
          </Section>
        )}
      </Container>
    </ResultsContainer>
  );
};

export default MBAAdminViewPage;

