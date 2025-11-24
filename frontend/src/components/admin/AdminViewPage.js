import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import ProfileMatchHeroV2 from '../results/ProfileMatchHeroV2';
import BasicAuthModal from '../auth/BasicAuthModal';
import { fetchAdminResponse } from '../../utils/adminAuth';

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

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 0;
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-align: center;
`;

const ResultsContainer = styled.div`
  min-height: 100vh;
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

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const ErrorContainer = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 24px;
  color: #991b1b;
`;

const ErrorTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 0.9375rem;
`;

const AdminButton = styled.button`
  background: ${props => props.primary ? '#c71f69' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: 1px solid ${props => props.primary ? '#c71f69' : '#e2e8f0'};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#a01855' : '#f8fafc'};
  }
`;

const QASection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const QATitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
`;

const QAList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QAItem = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #c71f69;
`;

const QuestionText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
`;

const AnswerText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1e293b;
`;


const AdminViewPage = () => {
  const { response_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  // Fetch response data using the admin auth utility
  const fetchResponse = async (authUsername, authPassword) => {
    setError(null);
    setAuthError('');

    await fetchAdminResponse(
      response_id,
      authUsername,
      authPassword,
      {
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
        },
      }
    );
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
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>
            <LoadingText>Loading response data...</LoadingText>
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
            <ErrorTitle>Error Loading Response</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <AdminButton primary onClick={() => navigate('/')} style={{ marginTop: '16px' }}>← Back to Home</AdminButton>
          </ErrorContainer>
        </Container>
      </ResultsContainer>
    );
  }

  if (!data || !data.response?.profile_evaluation) {
    return (
      <ResultsContainer>
        <Container>
          <LoadingContainer>
            <LoadingText>Invalid response data format</LoadingText>
          </LoadingContainer>
        </Container>
      </ResultsContainer>
    );
  }

  const evaluationResults = data.response.profile_evaluation;
  const userInput = data.user_input || {};
  const background = userInput.background || 'non-tech';
  const quizResponses = userInput.quizResponses || {};
  const goals = userInput.goals || {};
  
  // Use questionsAndAnswers directly from the payload
  const qaPairs = Array.isArray(userInput.questionsAndAnswers) 
    ? userInput.questionsAndAnswers 
    : [];

  return (
    <ResultsContainer>
      <PrintStyles />
      <Container>
        <PageHeader>
          <PageTitle>Career Profile Tool Result Analysis</PageTitle>
        </PageHeader>

        <QASection>
          <QATitle>Quiz Questions & Answers</QATitle>
          <QAList>
            {qaPairs.map((qa, index) => (
              <QAItem key={index}>
                <QuestionText>Q: {qa.question}</QuestionText>
                <AnswerText>A: {qa.answer}</AnswerText>
              </QAItem>
            ))}
          </QAList>
        </QASection>

        <Section>
          <SectionTitle>Output</SectionTitle>
          <ProfileMatchHeroV2
            score={evaluationResults.profile_strength_score}
            notes={evaluationResults.profile_strength_notes}
            badges={evaluationResults.badges}
            evaluationResults={evaluationResults}
            background={background}
            quizResponses={quizResponses}
            goals={goals}
            hideCTAs={true}
          />
        </Section>
      </Container>
    </ResultsContainer>
  );
};

export default AdminViewPage;

