import React from 'react';
import styled from 'styled-components';
import { Phone, Warning } from 'phosphor-react';

const Section = styled.section`
  padding: 80px 0;
  background: var(--navy);
  color: var(--white);
  @media (max-width: 768px) { padding: 48px 0; }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 40px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 16px;
`;

const Title = styled.h2`
  font-family: var(--serif);
  font-size: 2.25rem;
  font-weight: 500;
  margin: 0 0 16px;
  line-height: 1.15;
  @media (max-width: 768px) { font-size: 1.625rem; }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 36px;
  line-height: 1.6;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.button`
  background: var(--white);
  color: var(--navy);
  border: none;
  padding: 16px 32px;
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f0f0f0;
  }
`;

const CTASub = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;
  flex-wrap: wrap;
`;

const StatPill = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  strong {
    color: ${props => props.$highlight === 'green' ? '#34d399' : '#60a5fa'};
    font-weight: 700;
  }
`;

const FinalCTAChapter = ({ targetRole, isPreview, onCTAClick }) => {
  return (
    <Section>
      <Container>
        <BadgeRow>
          <Badge>
            <Warning size={14} weight="bold" />
            {isPreview ? 'Sample Report' : 'One last thing'}
          </Badge>
        </BadgeRow>

        <Title>
          {isPreview
            ? 'Like what you see? Get your own report.'
            : "You've seen the report. Now make the move."}
        </Title>
        <Subtitle>
          {isPreview
            ? 'Complete the quiz to receive a personalized career evaluation tailored to your profile, skills, and goals.'
            : "30 minutes with a Scaler counsellor. They'll read your profile and tell you exactly what to do next."}
        </Subtitle>

        <CTAButton onClick={onCTAClick}>
          {isPreview ? 'Back to Quiz' : (<><Phone size={18} weight="fill" /> Get free consultation →</>)}
        </CTAButton>
        {!isPreview && <CTASub>30 min · No card · No pressure</CTASub>}

        {!isPreview && (
          <StatsFooter>
            <StatPill $highlight="green">
              Backend roles saw <strong>+22% competition</strong> in 2025
            </StatPill>
            <StatPill $highlight="blue">
              AI-fluent devs earn <strong>1.4× more</strong>
            </StatPill>
          </StatsFooter>
        )}
      </Container>
    </Section>
  );
};

export default FinalCTAChapter;
