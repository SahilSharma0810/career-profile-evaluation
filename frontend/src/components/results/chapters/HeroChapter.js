import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Phone, Lock } from 'phosphor-react';
import { HeroBackground } from '../HeroBackground';

const Section = styled.section`
  position: relative;
  overflow: hidden;
  background: var(--navy);
  color: var(--white);
  padding: 80px 0 56px;

  @media (max-width: 768px) {
    padding: 48px 0 40px;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Meta = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 32px;
`;

const HeroLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 48px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const HeroLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-family: var(--serif);
  font-size: 2.75rem;
  font-weight: 500;
  line-height: 1.12;
  margin: 0 0 20px;
  color: var(--white);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin: 0 0 32px;
  max-width: 440px;
`;

const CTAButton = styled.button`
  background: var(--white);
  color: var(--navy);
  border: none;
  padding: 14px 28px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f0f0f0;
  }

  @media print {
    display: none;
  }
`;

const CTASub = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const ScoreGauge = styled.div`
  position: relative;
  width: 180px;
  height: 116px;

  @media (max-width: 768px) {
    width: 140px;
    height: 92px;
  }
`;

const ScoreNumber = styled.div`
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreValue = styled.div`
  font-family: var(--serif);
  font-size: 3.5rem;
  font-weight: 500;
  color: var(--white);
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ScoreOutOf = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
`;

const ScoreBadge = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 16px;
  text-align: center;
`;

const BottomMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 48px;
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ROLE_DISPLAY_NAMES = {
  'senior-backend': 'Backend Engineer',
  'senior-fullstack': 'Full-Stack Engineer',
  'backend-sde': 'Backend Engineer',
  'fullstack-sde': 'Full-Stack Engineer',
  'data-ml': 'Data Science Engineer',
  'devops-sre': 'DevOps Engineer',
  'ai-ml-engineer': 'AI / ML Engineer',
  'tech-lead': 'Tech Lead',
  backend: 'Backend Engineer',
  fullstack: 'Full-Stack Engineer',
  frontend: 'Frontend Engineer',
  'not-sure': 'Software Engineer'
};

const HeroChapter = ({ score, targetRole, quizResponses, background, hideCTAs, isPreview, onCTAClick }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const hasAnimated = useRef(false);

  const roleName = ROLE_DISPLAY_NAMES[targetRole] || 'Software Engineer';

  const animateScore = useCallback(() => {
    if (!score || hasAnimated.current || isPreview) return;
    hasAnimated.current = true;
    const duration = 1800;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
  }, [score]);

  useEffect(() => {
    animateScore();
  }, [animateScore]);

  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const pct = isPreview ? 0.65 : displayScore / 100;
  const clampedPct = Math.max(0, Math.min(1, pct));
  const radius = 76;
  const semiCircumference = Math.PI * radius;
  const filledArc = semiCircumference * clampedPct;

  return (
    <Section id="cpe-hero-section">
      <HeroBackground />
      <Container>
        <Meta>Career Profile Evaluation · {monthNames[now.getMonth()]} {now.getFullYear()}</Meta>

        <HeroLayout>
          <HeroLeft>
            <Title>
              Hey There,<br />
              Become an AI-Powered<br />
              10× {roleName}.
            </Title>

            <Subtitle>
              Your profile. The AI shifts you can't ignore. The fastest path to hired.
            </Subtitle>

            {!hideCTAs && (
              <>
                <CTAButton onClick={onCTAClick}>
                  {isPreview ? (
                    'Complete the quiz to get yours'
                  ) : (
                    <>
                      <Phone size={18} weight="fill" />
                      BOOK FREE 1:1 CAREER CALL
                    </>
                  )}
                </CTAButton>
                {!isPreview && (
                  <CTASub>30 min · Free · Senior consuellort</CTASub>
                )}
              </>
            )}
          </HeroLeft>

          <ScoreSection>
            <ScoreGauge>
              <svg width="100%" height="100%" viewBox="0 0 180 116">
                <path
                  d={`M 14 104 A ${radius} ${radius} 0 0 1 166 104`}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d={`M 14 104 A ${radius} ${radius} 0 0 1 166 104`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="6"
                  strokeDasharray={`${filledArc} ${semiCircumference}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                />
              </svg>
              <ScoreNumber>
                {isPreview ? (
                  <Lock size={40} weight="fill" color="rgba(255,255,255,0.5)" />
                ) : (
                  <>
                    <ScoreValue>{displayScore}</ScoreValue>
                    <ScoreOutOf>out of 100</ScoreOutOf>
                  </>
                )}
              </ScoreNumber>
            </ScoreGauge>
            <ScoreBadge>Career & AI Readiness</ScoreBadge>
          </ScoreSection>
        </HeroLayout>

        <BottomMeta>
          <span>4 min read</span>
          <span>·</span>
          <span>6 chapters</span>
        </BottomMeta>
      </Container>
    </Section>
  );
};

export default HeroChapter;
