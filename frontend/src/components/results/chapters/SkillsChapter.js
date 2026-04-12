import React from 'react';
import styled from 'styled-components';
import { CheckCircle, Target } from 'phosphor-react';

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
  margin: 0 0 8px;
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

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ColumnTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.$type === 'strength' ? '#059669' : '#dc2626'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 4px;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SkillsChapter = ({ strengths, areasToImprove }) => {
  return (
    <Section id="cpe-skills-section">
      <Container>
        <ChapterLabel>03 · Where You Stand</ChapterLabel>
        <Title>Your strengths. Your gaps. No spin.</Title>
        <Subtitle>
          Based on what you've shipped, your DSA depth, and how you use AI today.
        </Subtitle>

        <TwoColumn>
          <Column>
            <ColumnTitle $type="strength">Your Strengths</ColumnTitle>
            {strengths.map((s, i) => (
              <Item key={i}>
                <CheckCircle size={18} weight="fill" color="#059669" />
                {s}
              </Item>
            ))}
          </Column>
          <Column>
            <ColumnTitle $type="improve">Areas to Improve</ColumnTitle>
            {areasToImprove.map((a, i) => (
              <Item key={i}>
                <Target size={18} weight="fill" color="#dc2626" />
                {a}
              </Item>
            ))}
          </Column>
        </TwoColumn>
      </Container>
    </Section>
  );
};

export default SkillsChapter;
