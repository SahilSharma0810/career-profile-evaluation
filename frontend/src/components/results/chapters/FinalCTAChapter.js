import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 80px 0;
  background: #0f172a;
  color: #ffffff;
  @media (max-width: 768px) { padding: 48px 0; }
`;

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
`;

const Label = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 12px;
  line-height: 1.3;
  @media (max-width: 768px) { font-size: 1.375rem; }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #94a3b8;
  margin: 0 0 32px;
  line-height: 1.5;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.button`
  background: #ffffff;
  color: #0f172a;
  border: none;
  padding: 16px 32px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const CTASub = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 10px;
`;

const StatsFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 48px;
  flex-wrap: wrap;
`;

const FooterStat = styled.div`
  font-size: 0.8125rem;
  color: #94a3b8;
`;

const FinalCTAChapter = ({ targetRole, onCTAClick }) => {
  return (
    <Section>
      <Container>
        <Label>One last thing</Label>
        <Title>You've seen the report. Now make the move.</Title>
        <Subtitle>
          30 minutes with a Scaler counsellor. They'll read your profile and tell you exactly what to do next.
        </Subtitle>

        <CTAButton onClick={onCTAClick}>
          Get free consultation →
        </CTAButton>
        <CTASub>30 min · No card · No pressure</CTASub>

        <StatsFooter>
          <FooterStat>Backend roles saw +22% competition in 2025</FooterStat>
          <FooterStat>AI-fluent devs earn 1.4× more</FooterStat>
        </StatsFooter>
      </Container>
    </Section>
  );
};

export default FinalCTAChapter;
