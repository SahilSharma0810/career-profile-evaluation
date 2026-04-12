import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 80px 0;
  background: var(--white);
  border-bottom: 1px solid var(--line);

  @media (max-width: 768px) {
    padding: 48px 0;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const ChapterLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--accent-eye);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-family: var(--serif);
  font-size: 2.25rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 12px;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 1.625rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0 0 40px;
  line-height: 1.5;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const PointsList = styled.ol`
  list-style: none;
  counter-reset: tenx;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Point = styled.li`
  counter-increment: tenx;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &::before {
    content: counter(tenx, decimal-leading-zero);
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--line2);
    flex-shrink: 0;
    width: 32px;
    padding-top: 0;
  }
`;

const PointText = styled.span`
  font-size: 0.9375rem;
  color: var(--ink2);
  line-height: 1.6;

  strong {
    color: var(--ink);
  }
`;

const StatsCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatCard = styled.div`
  background: var(--bg);
  border: 1px solid var(--line);
  padding: 28px;
`;

const LinkedInRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const LinkedInIcon = styled.div`
  width: 18px;
  height: 18px;
  background: #0A66C2;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.625rem;
`;

const LinkedInLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 600;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BigStatValue = styled.div`
  font-family: var(--serif);
  font-size: 2.75rem;
  font-weight: 500;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 6px;
`;

const BigStatLabel = styled.div`
  font-size: 0.8125rem;
  color: var(--ink3);
  line-height: 1.5;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BarYear = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: ${props => props.$highlight ? '700' : '500'};
  color: ${props => props.$highlight ? 'var(--ink)' : 'var(--ink4)'};
  width: 36px;
`;

const Bar = styled.div`
  height: 10px;
  background: ${props => props.$highlight ? 'var(--accent)' : 'var(--line2)'};
  width: ${props => props.$width}%;
  transition: width 0.5s ease;
`;

const BarLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  color: var(--ink4);
`;

const SecondStatCard = styled.div`
  background: var(--bg);
  border: 1px solid var(--line);
  padding: 28px;
`;

const SecondStatValue = styled.div`
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 8px;
`;

const SecondStatLabel = styled.div`
  font-size: 0.8125rem;
  color: var(--ink3);
  line-height: 1.5;
`;

const StatSource = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 0.5625rem;
  color: var(--ink4);
  margin-top: 10px;
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

        <TwoCol>
          <PointsList>
            <Point>
              <PointText>Uses <strong>Cursor or Copilot</strong> for every feature — not just autocomplete, full refactors</PointText>
            </Point>
            <Point>
              <PointText>Reviews <strong>AI-generated code critically</strong> — catches hallucinations before they ship</PointText>
            </Point>
            <Point>
              <PointText>Ships <strong>AI-integrated features</strong>: RAG pipelines, agents, AI-assisted workflows</PointText>
            </Point>
            <Point>
              <PointText>Designs <strong>systems with AI in the architecture</strong> — not bolted on after</PointText>
            </Point>
            <Point>
              <PointText>Answers <strong>"how would AI change your design?"</strong> in interviews without hesitation</PointText>
            </Point>
          </PointsList>

          <StatsCol>
            <StatCard>
              <LinkedInRow>
                <LinkedInIcon>in</LinkedInIcon>
                <LinkedInLabel>Generative AI in job postings · LinkedIn</LinkedInLabel>
              </LinkedInRow>
              <BigStatValue>4× growth</BigStatValue>
              <BigStatLabel>in job postings mentioning generative AI skills — since 2023</BigStatLabel>

              <BarChart>
                <BarRow>
                  <BarYear>2022</BarYear>
                  <Bar $width={25} />
                  <BarLabel>1×</BarLabel>
                </BarRow>
                <BarRow>
                  <BarYear>2023</BarYear>
                  <Bar $width={50} />
                  <BarLabel>2×</BarLabel>
                </BarRow>
                <BarRow>
                  <BarYear>2024</BarYear>
                  <Bar $width={75} />
                  <BarLabel>3×</BarLabel>
                </BarRow>
                <BarRow>
                  <BarYear $highlight>2025</BarYear>
                  <Bar $width={100} $highlight />
                  <BarLabel>4×</BarLabel>
                </BarRow>
              </BarChart>
            </StatCard>

            <SecondStatCard>
              <SecondStatValue>66%</SecondStatValue>
              <SecondStatLabel>of hiring managers won't hire engineers without demonstrated AI skills</SecondStatLabel>
              <StatSource>
                <LinkedInIcon style={{ width: 14, height: 14, fontSize: '0.5rem' }}>in</LinkedInIcon>
                LinkedIn Work Trend Index, 2024
              </StatSource>
            </SecondStatCard>
          </StatsCol>
        </TwoCol>
      </Container>
    </Section>
  );
};

export default TenXEngineerChapter;
