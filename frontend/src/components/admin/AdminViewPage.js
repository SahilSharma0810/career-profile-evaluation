import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { MagnifyingGlass, FileText, CheckCircle, House } from 'phosphor-react';
import ReportPage from '../results/ReportPage';
import BasicAuthModal from '../auth/BasicAuthModal';
import { fetchAdminResponse } from '../../utils/adminAuth';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 32px;
`;

const PageHeader = styled.div`
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }

  @media print {
    display: none;
  }
`;

const PageTitle = styled.h1`
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const QASection = styled.div`
  background: #ffffff;
  padding: 32px;
  border-bottom: 1px solid #f1f5f9;
`;

const QATitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #94a3b8;
  margin: 0 0 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QAList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QAItem = styled.div`
  padding: 14px 16px;
  background: #f8fafc;
  border-left: 3px solid #0041ca;
`;

const QuestionText = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const AnswerText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1e293b;
`;

const LoadingWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
  color: #64748b;
`;

const LoadingText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
`;

const LoadingSub = styled.div`
  font-size: 0.8125rem;
  color: #94a3b8;
`;

const ProgressTrack = styled.div`
  width: 240px;
  height: 3px;
  background: #f1f5f9;
  overflow: hidden;
  margin-top: 16px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #1e293b;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ErrorWrapper = styled(LoadingWrapper)`
  gap: 16px;
`;

const ErrorTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
`;

const PrimaryButton = styled.button`
  background: #1e293b;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: #0f172a;
  }

  @media print {
    display: none;
  }
`;

const EvalSection = styled.div`
  border-top: 1px solid #f1f5f9;
`;

const EvalLabel = styled.div`
  padding: 20px 32px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const AdminViewPage = () => {
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
    { icon: <MagnifyingGlass size={24} weight="bold" />, text: 'Authenticating...', sub: 'Verifying credentials' },
    { icon: <FileText size={24} weight="bold" />, text: 'Loading response...', sub: 'Fetching evaluation' },
    { icon: <CheckCircle size={24} weight="bold" />, text: 'Preparing results...', sub: 'Almost there' }
  ];

  useEffect(() => {
    if (loading && !showAuthModal) {
      setLoadingProgress(0);
      setLoadingStep(0);

      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) { clearInterval(progressInterval); return 95; }
          return prev + 2;
        });
      }, 100);

      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingSteps.length - 1) { clearInterval(stepInterval); return prev; }
          return prev + 1;
        });
      }, 1500);

      return () => { clearInterval(progressInterval); clearInterval(stepInterval); };
    }
  }, [loading, showAuthModal]);

  const fetchResponse = async (authUsername, authPassword) => {
    setError(null);
    setAuthError('');

    await fetchAdminResponse(response_id, authUsername, authPassword, {
      onLoadingChange: setLoading,
      onSuccess: (result) => {
        setData(result);
        setShowAuthModal(false);
        setAuthError('');
      },
      onError: (errorJson) => {
        setShowAuthModal(false);
        setError(errorJson.detail || 'Response not found for the given ID.');
      },
      onAuthError: (errorJson) => {
        setShowAuthModal(true);
        setAuthError(errorJson.detail || 'Invalid username or password. Please try again.');
      }
    });
  };

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
      <LoadingWrapper>
        <LoadingContent>
          <LoadingIcon>{currentStep.icon}</LoadingIcon>
          <div>
            <LoadingText>{currentStep.text}</LoadingText>
            <LoadingSub>{currentStep.sub}</LoadingSub>
          </div>
        </LoadingContent>
        <ProgressTrack>
          <ProgressFill $progress={loadingProgress} />
        </ProgressTrack>
      </LoadingWrapper>
    );
  }

  if (error) {
    return (
      <ErrorWrapper>
        <ErrorTitle>We ran into a problem</ErrorTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <PrimaryButton onClick={() => navigate('/')}>
          <House size={18} weight="bold" /> Back to Home
        </PrimaryButton>
      </ErrorWrapper>
    );
  }

  if (!data || !data.response?.profile_evaluation) {
    return (
      <ErrorWrapper>
        <ErrorTitle>Invalid Data Format</ErrorTitle>
        <ErrorMessage>Unable to display evaluation results. The response data may be corrupted.</ErrorMessage>
        <PrimaryButton onClick={() => navigate('/')}>
          <House size={18} weight="bold" /> Back to Home
        </PrimaryButton>
      </ErrorWrapper>
    );
  }

  const evaluationResults = data.response.profile_evaluation;
  const userInput = data.user_input || {};
  const adminBackground = userInput.background || 'non-tech';
  const quizResponses = userInput.quizResponses || {};
  const adminGoals = userInput.goals || {};
  const qaPairs = Array.isArray(userInput.questionsAndAnswers) ? userInput.questionsAndAnswers : [];

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Admin Response Viewer</PageTitle>
      </PageHeader>

      <QASection>
        <Container>
          <QATitle>
            <FileText size={18} weight="bold" color="#0041ca" />
            Quiz Questions & Answers
          </QATitle>
          <QAList>
            {qaPairs.map((qa, index) => (
              <QAItem key={index}>
                <QuestionText>Q{index + 1}: {qa.question}</QuestionText>
                <AnswerText>{qa.answer}</AnswerText>
              </QAItem>
            ))}
          </QAList>
        </Container>
      </QASection>

      <EvalSection>
        <EvalLabel>Evaluation Output</EvalLabel>
        <ReportPage
          evaluationResults={evaluationResults}
          background={adminBackground}
          quizResponses={quizResponses}
          goals={adminGoals}
          hideCTAs={true}
        />
      </EvalSection>
    </PageWrapper>
  );
};

export default AdminViewPage;
