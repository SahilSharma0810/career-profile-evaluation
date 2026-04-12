import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 80px 0;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    padding: 48px 0;
  }
`;

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 0 32px;
`;

const ChapterLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 36px;
  line-height: 1.5;
`;

const PointsList = styled.ol`
  list-style: none;
  counter-reset: tenx;
  padding: 0;
  margin: 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Point = styled.li`
  counter-increment: tenx;
  display: flex;
  gap: 16px;
  align-items: flex-start;

  &::before {
    content: counter(tenx, decimal-leading-zero);
    font-size: 0.8125rem;
    font-weight: 700;
    color: #94a3b8;
    flex-shrink: 0;
    width: 24px;
    padding-top: 2px;
  }
`;

const PointText = styled.span`
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.6;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  padding: 32px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
`;

const StatBlock = styled.div`
  flex: 1;
  min-width: 200px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.4;
  margin-top: 4px;
`;

const StatSource = styled.div`
  font-size: 0.6875rem;
  color: #94a3b8;
  margin-top: 8px;
`;

const ROLE_NAMES = {
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

const TenXEngineerChapter = ({ targetRole }) => {
  const roleName = ROLE_NAMES[targetRole] || 'Software Engineer';

  return (
    <Section id="cpe-10x-section">
      <Container>
        <ChapterLabel>02 · The 10× Engineer</ChapterLabel>
        <Title>What a 10× {roleName} actually looks like in 2026.</Title>
        <Subtitle>
          Not a unicorn. A real engineer who uses AI as leverage — every single day.
        </Subtitle>

        <PointsList>
          <Point>
            <PointText>Uses Cursor or Copilot for every feature — not just autocomplete, full refactors</PointText>
          </Point>
          <Point>
            <PointText>Reviews AI-generated code critically — catches hallucinations before they ship</PointText>
          </Point>
          <Point>
            <PointText>Ships AI-integrated features: RAG pipelines, agents, AI-assisted workflows</PointText>
          </Point>
          <Point>
            <PointText>Designs systems with AI in the architecture — not bolted on after</PointText>
          </Point>
          <Point>
            <PointText>Answers "how would AI change your design?" in interviews without hesitation</PointText>
          </Point>
        </PointsList>

        <StatsRow>
          <StatBlock>
            <StatValue>4×</StatValue>
            <StatLabel>growth in job postings mentioning generative AI skills — since 2023</StatLabel>
            <StatSource>LinkedIn, Generative AI in job postings</StatSource>
          </StatBlock>
          <StatBlock>
            <StatValue>66%</StatValue>
            <StatLabel>of hiring managers won't hire engineers without demonstrated AI skills</StatLabel>
            <StatSource>LinkedIn Work Trend Index, 2024</StatSource>
          </StatBlock>
        </StatsRow>
      </Container>
    </Section>
  );
};

export default TenXEngineerChapter;
