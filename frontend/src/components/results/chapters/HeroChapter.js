import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  background: #0f172a;
  color: #ffffff;
  padding: 80px 0 64px;

  @media (max-width: 768px) {
    padding: 48px 0 40px;
  }
`;

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 0 32px;
`;

const Meta = styled.div`
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 40px;
  max-width: 600px;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 48px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const ScoreBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScoreValue = styled.div`
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
`;

const ScoreOutOf = styled.span`
  font-size: 1.5rem;
  font-weight: 400;
  color: #64748b;
`;

const MetaChips = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const Chip = styled.div`
  font-size: 0.8125rem;
  color: #94a3b8;
`;

const CTAButton = styled.button`
  margin-top: 40px;
  background: #ffffff;
  color: #0f172a;
  border: none;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }

  @media print {
    display: none;
  }
`;

const CTASub = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 8px;
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

const HeroChapter = ({ score, targetRole, quizResponses, background, hideCTAs, onCTAClick }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const hasAnimated = useRef(false);

  const roleName = ROLE_DISPLAY_NAMES[targetRole] || 'Software Engineer';

  const animateScore = useCallback(() => {
    if (!score || hasAnimated.current) return;
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

  return (
    <Section id="cpe-hero-section">
      <Container>
        <Meta>Career Profile Evaluation · {monthNames[now.getMonth()]} {now.getFullYear()}</Meta>

        <Title>
          Hey There,{'\n'}Become an <Highlight>AI-Powered</Highlight>{'\n'}10× {roleName}.
        </Title>

        <Subtitle>
          Your profile. The AI shifts you can't ignore. The fastest path to hired.
        </Subtitle>

        <ScoreRow>
          <ScoreBlock>
            <ScoreValue>
              {displayScore}<ScoreOutOf>out of 100</ScoreOutOf>
            </ScoreValue>
            <ScoreLabel>Career & AI Readiness</ScoreLabel>
          </ScoreBlock>

          <MetaChips>
            <Chip>4 min read</Chip>
            <Chip>·</Chip>
            <Chip>8 chapters</Chip>
          </MetaChips>
        </ScoreRow>

        {!hideCTAs && (
          <>
            <CTAButton onClick={onCTAClick}>
              Get a Free Career Consultation
            </CTAButton>
            <CTASub>30 min · Free · Senior mentor</CTASub>
          </>
        )}
      </Container>
    </Section>
  );
};

export default HeroChapter;
