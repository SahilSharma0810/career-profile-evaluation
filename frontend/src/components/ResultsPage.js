import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useProfile } from '../context/ProfileContext';
import { evaluateProfile } from '../utils/evaluationLogic';
import ReportPage from './results/ReportPage';
import tracker from '../utils/tracker';
import { getPathWithQueryParams } from '../utils/url';

/* ── Loading Screen ────────────────────────────────────────── */

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const LoadingWrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoadingBrand = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 48px;
  letter-spacing: 0.5px;
`;

const LoadingText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSubtext = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 40px;
`;

const ProgressTrack = styled.div`
  width: 280px;
  height: 3px;
  background: #f1f5f9;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #1e293b;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

/* ── Error ─────────────────────────────────────────────────── */

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

const RetryButton = styled.button`
  background: #1e293b;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: #0f172a;
  }
`;

/* ── Component ─────────────────────────────────────────────── */

const LOADING_MESSAGES = [
  'Reading your answers…',
  'Analyzing your profile…',
  'Comparing with industry benchmarks…',
  'Building your personalized report…',
  'Almost there…'
];

const ResultsPage = () => {
  const navigate = useNavigate();
  const {
    quizResponses,
    goals,
    background,
    questionsAndAnswers,
    evaluationResults,
    setEvaluationResults
  } = useProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      setLoadingMsgIndex(0);

      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) { clearInterval(progressInterval); return 95; }
          return prev + 1;
        });
      }, 150);

      const msgInterval = setInterval(() => {
        setLoadingMsgIndex(prev => {
          if (prev >= LOADING_MESSAGES.length - 1) { clearInterval(msgInterval); return prev; }
          return prev + 1;
        });
      }, 2500);

      return () => { clearInterval(progressInterval); clearInterval(msgInterval); };
    }
  }, [isLoading]);

  useEffect(() => {
    if (!quizResponses || !goals || !background) {
      navigate(getPathWithQueryParams('/'), { replace: true });
    }
  }, [quizResponses, goals, background, navigate]);

  useEffect(() => {
    if (evaluationResults) return;

    let isMounted = true;
    const controller = new AbortController();
    const startTime = Date.now();
    const MINIMUM_LOADING_TIME = 10000;

    const fetchEvaluation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await evaluateProfile(
          quizResponses, goals, background, questionsAndAnswers,
          { signal: controller.signal }
        );

        if (isMounted) {
          if (results && typeof results === 'object' && Object.keys(results).length > 0) {
            const remaining = Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - startTime));
            setTimeout(() => {
              if (isMounted) { setEvaluationResults(results); setIsLoading(false); }
            }, remaining);
          } else {
            throw new Error('Evaluation service returned an empty response.');
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (isMounted) {
          const remaining = Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - startTime));
          setTimeout(() => {
            if (isMounted) { setError(err.message || 'Failed to fetch evaluation results.'); setIsLoading(false); }
          }, remaining);
        }
      }
    };

    fetchEvaluation();
    return () => { isMounted = false; controller.abort(); };
  }, [quizResponses, goals, background, setEvaluationResults, retryCount, evaluationResults, questionsAndAnswers]);

  const handleReEvaluate = () => {
    setEvaluationResults(null);
    navigate(getPathWithQueryParams('/'));
  };

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingBrand>Scaler · Profile Evaluation</LoadingBrand>
        <LoadingText>{LOADING_MESSAGES[loadingMsgIndex]}</LoadingText>
        <LoadingSubtext>This usually takes about 10 seconds</LoadingSubtext>
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
        <RetryButton onClick={handleReEvaluate}>Try Again</RetryButton>
      </ErrorWrapper>
    );
  }

  if (!evaluationResults) {
    return (
      <ErrorWrapper>
        <ErrorMessage>Unable to generate evaluation results. Please try again.</ErrorMessage>
        <RetryButton onClick={handleReEvaluate}>Start Over</RetryButton>
      </ErrorWrapper>
    );
  }

  return (
    <ReportPage
      evaluationResults={evaluationResults}
      background={background}
      quizResponses={quizResponses}
      goals={goals}
    />
  );
};

export default ResultsPage;
