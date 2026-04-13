import React, { useState } from 'react';
import styled from 'styled-components';
import { CaretLeft, CaretRight } from 'phosphor-react';
import AI_SHIFT_COMPANIES from '../../../data/ai_shift_content';

const Section = styled.section`
  padding: 80px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  @media (max-width: 768px) { padding: 48px 0; }
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
  @media (max-width: 768px) { font-size: 1.625rem; }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0 0 36px;
  line-height: 1.5;
`;

const Card = styled.div`
  background: var(--navy);
  color: var(--white);
  padding: 40px;

  @media (max-width: 768px) {
    padding: 28px 24px;
  }
`;

const CardInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const CardLeft = styled.div``;

const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const CompanyIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const CompanyName = styled.div`
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CompanyDivider = styled.div`
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin-left: 8px;
`;

const QuoteText = styled.blockquote`
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--white);
  line-height: 1.4;
  margin: 0 0 24px;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Bullet = styled.li`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.6);
  padding-left: 16px;
  position: relative;
  line-height: 1.5;

  &::before {
    content: "—";
    position: absolute;
    left: 0;
    color: rgba(255, 255, 255, 0.3);
  }
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartPlaceholder = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChartLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ChartLine = styled.div`
  height: 2px;
  background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0.4));
  width: 100%;
`;

const ChartYear = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.3);
  text-align: right;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatBox = styled.div`
  background: ${props => props.$variant === 'green' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(37, 99, 235, 0.12)'};
  border: 1px solid ${props => props.$variant === 'green' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(37, 99, 235, 0.2)'};
  padding: 18px;
`;

const StatValue = styled.div`
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--white);
  line-height: 1;
  margin-bottom: 6px;
`;

const StatLabel = styled.div`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  text-transform: uppercase;
`;

const StatSource = styled.div`
  font-family: var(--mono);
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.25);
  margin-top: 6px;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
`;

const Counter = styled.div`
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ink4);
`;

const NavBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--ink3);

  &:hover:not(:disabled) {
    border-color: var(--line2);
    color: var(--ink);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const COMPANY_ICONS = {
  Google: '🔍',
  Amazon: '📦',
  Meta: '🔵',
  Klarna: '🟣'
};

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
          <CardInner>
            <CardLeft>
              <CompanyRow>
                <CompanyIcon>{COMPANY_ICONS[item.company] || '🏢'}</CompanyIcon>
                <CompanyName>{item.company}</CompanyName>
                <CompanyDivider />
              </CompanyRow>

              <QuoteText>"{item.quote}"</QuoteText>

              {item.bullets.length > 0 && (
                <BulletList>
                  {item.bullets.map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                  ))}
                </BulletList>
              )}
            </CardLeft>

            <CardRight>
              <ChartPlaceholder>
                <ChartLabel>Code Velocity</ChartLabel>
                <ChartLine />
                <ChartYear>2024+</ChartYear>
              </ChartPlaceholder>

              <StatsRow>
                {item.stats.map((s, i) => (
                  <StatBox key={i} $variant={i === 0 ? 'green' : 'blue'}>
                    <StatValue>{s.value}</StatValue>
                    <StatLabel>{s.label}</StatLabel>
                    <StatSource>{s.source}</StatSource>
                  </StatBox>
                ))}
              </StatsRow>
            </CardRight>
          </CardInner>
        </Card>

        <NavRow>
          <NavBtn onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
            <CaretLeft size={18} weight="bold" />
          </NavBtn>
          <Counter>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Counter>
          <NavBtn onClick={() => setCurrent(c => c + 1)} disabled={current === total - 1}>
            <CaretRight size={18} weight="bold" />
          </NavBtn>
        </NavRow>
      </Container>
    </Section>
  );
};

export default AIShiftChapter;
