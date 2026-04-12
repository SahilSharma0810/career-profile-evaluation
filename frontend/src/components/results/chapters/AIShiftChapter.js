import React, { useState } from 'react';
import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'phosphor-react';
import AI_SHIFT_COMPANIES from '../../../data/ai_shift_content';

const Section = styled.section`
  padding: 80px 0;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  @media (max-width: 768px) { padding: 48px 0; }
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
  @media (max-width: 768px) { font-size: 1.375rem; }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 36px;
  line-height: 1.5;
`;

const Card = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 32px;
  @media (max-width: 768px) { padding: 24px; }
`;

const CompanyName = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
`;

const QuoteText = styled.blockquote`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0 0 12px;
  font-style: italic;
`;

const Attribution = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 8px;
`;

const Context = styled.div`
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Bullet = styled.li`
  font-size: 0.8125rem;
  color: #475569;
  padding-left: 14px;
  position: relative;

  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #94a3b8;
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const StatBlock = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

const StatSource = styled.div`
  font-size: 0.625rem;
  color: #94a3b8;
  margin-top: 2px;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

const Counter = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
`;

const NavBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const NavBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #475569;

  &:hover:not(:disabled) {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const AIShiftChapter = () => {
  const [current, setCurrent] = useState(0);
  const data = AI_SHIFT_COMPANIES;
  const total = data.length;
  const item = data[current];

  return (
    <Section id="cpe-ai-shift">
      <Container>
        <ChapterLabel>07 · The AI Shift</ChapterLabel>
        <Title>How the top company expectations are changing and rising.</Title>
        <Subtitle>The biggest companies already made the shift. This is what they now expect.</Subtitle>

        <Card>
          <CompanyName>{item.company}</CompanyName>
          <QuoteText>"{item.quote}"</QuoteText>
          <Attribution>{item.attribution}</Attribution>
          <Context>{item.context}</Context>

          {item.bullets.length > 0 && (
            <BulletList>
              {item.bullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </BulletList>
          )}

          <StatsRow>
            {item.stats.map((s, i) => (
              <StatBlock key={i}>
                <StatValue>{s.value}</StatValue>
                <StatLabel>{s.label}</StatLabel>
                <StatSource>{s.source}</StatSource>
              </StatBlock>
            ))}
          </StatsRow>
        </Card>

        <NavRow>
          <Counter>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Counter>
          <NavBtns>
            <NavBtn onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
              <CaretLeft size={18} weight="bold" />
            </NavBtn>
            <NavBtn onClick={() => setCurrent(c => c + 1)} disabled={current === total - 1}>
              <CaretRight size={18} weight="bold" />
            </NavBtn>
          </NavBtns>
        </NavRow>
      </Container>
    </Section>
  );
};

export default AIShiftChapter;
