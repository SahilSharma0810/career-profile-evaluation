import React, { useState } from 'react';
import styled from 'styled-components';
import { CaretLeft, CaretRight, Star } from 'phosphor-react';
import alumniData from '../../../data/alumni_stories.json';

const Section = styled.section`
  padding: 80px 0;
  background: #f8fafc;
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

const CarouselWrapper = styled.div`
  position: relative;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 32px;
  @media (max-width: 768px) { padding: 24px; }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  background: #1e293b;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
`;

const NameBlock = styled.div``;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
`;

const CurrentTitle = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
`;

const JourneyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const JourneyLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
`;

const JourneyCompany = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
`;

const JourneyArrow = styled.span`
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
`;

const Quote = styled.blockquote`
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.7;
  margin: 0 0 16px;
  font-style: italic;
  border-left: 3px solid #e2e8f0;
  padding-left: 16px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
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

const AlumniChapter = ({ targetRole }) => {
  const [current, setCurrent] = useState(0);
  const stories = alumniData.length > 0 ? alumniData : [];
  const total = stories.length;

  if (total === 0) return null;

  const story = stories[current];

  return (
    <Section id="cpe-alumni-section">
      <Container>
        <ChapterLabel>06 · People Like You</ChapterLabel>
        <Title>They were exactly where you are. Here's what changed.</Title>
        <Subtitle>Engineers with your exact starting profile. Real numbers.</Subtitle>

        <CarouselWrapper>
          <Card>
            <CardTop>
              <Avatar>{story.initial}</Avatar>
              <NameBlock>
                <Name>{story.name}</Name>
                <CurrentTitle>{story.currentTitle} at {story.currentCompany}</CurrentTitle>
              </NameBlock>
            </CardTop>

            <JourneyRow>
              <JourneyLabel>Before</JourneyLabel>
              <JourneyCompany>{story.beforeCompany}</JourneyCompany>
              <JourneyArrow>→</JourneyArrow>
              <JourneyLabel>After</JourneyLabel>
              <JourneyCompany>{story.afterCompany}</JourneyCompany>
            </JourneyRow>

            <Quote>"{story.quote}"</Quote>

            <Stars>
              {Array.from({ length: story.rating }).map((_, i) => (
                <Star key={i} size={16} weight="fill" color="#facc15" />
              ))}
            </Stars>
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
        </CarouselWrapper>
      </Container>
    </Section>
  );
};

export default AlumniChapter;
