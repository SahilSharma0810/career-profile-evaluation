import React from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle } from 'phosphor-react';

const Section = styled.section`
  padding: 80px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--line);

  @media (max-width: 768px) {
    padding: 48px 0;
  }
`;

const Container = styled.div`
  max-width: 1100px;
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
  margin: 0 0 8px;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 1.625rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0 0 36px;
  line-height: 1.5;
`;

const Card = styled.div`
  background: var(--white);
  border: 1px solid var(--line);
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: ${props => props.$right ? '0 0 0 40px' : '0 40px 0 0'};
  border-left: ${props => props.$right ? '1px solid var(--line)' : 'none'};

  @media (max-width: 768px) {
    padding: 0;
    border-left: none;
    border-top: ${props => props.$right ? '1px solid var(--line)' : 'none'};
    padding-top: ${props => props.$right ? '24px' : '0'};
    margin-top: ${props => props.$right ? '24px' : '0'};
  }
`;

const ColumnTitle = styled.h3`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: ${props => props.$type === 'strength' ? '#059669' : '#dc2626'};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.$type === 'strength' ? '#059669' : '#dc2626'};
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9375rem;
  color: var(--ink2);
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

        <Card>
          <TwoColumn>
            <Column>
              <ColumnTitle $type="strength">Your Strengths</ColumnTitle>
              {strengths.map((s, i) => (
                <Item key={i}>
                  <CheckCircle size={20} weight="fill" color="#059669" />
                  {s}
                </Item>
              ))}
            </Column>
            <Column $right>
              <ColumnTitle $type="improve">Areas to Improve</ColumnTitle>
              {areasToImprove.map((a, i) => (
                <Item key={i}>
                  <XCircle size={20} weight="fill" color="#dc2626" />
                  {a}
                </Item>
              ))}
            </Column>
          </TwoColumn>
        </Card>
      </Container>
    </Section>
  );
};

export default SkillsChapter;
