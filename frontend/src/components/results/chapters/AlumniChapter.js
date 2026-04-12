import React, { useState } from 'react';
import styled from 'styled-components';
import { CaretLeft, CaretRight, Star, Briefcase } from 'phosphor-react';
import alumniData from '../../../data/alumni_stories.json';

const Section = styled.section`
  padding: 80px 0;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  @media (max-width: 768px) { padding: 48px 0; }
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

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--white);
  border: 1px solid var(--line);
  overflow: hidden;
`;

const AvatarBlock = styled.div`
  height: 120px;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarLetter = styled.div`
  font-family: var(--serif);
  font-size: 3.5rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.15);
`;

const CardBody = styled.div`
  padding: 24px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
`;

const Name = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: var(--ink);
`;

const CurrentTitle = styled.div`
  font-size: 0.8125rem;
  color: var(--ink3);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const JourneyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const JourneyItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const JourneyLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 600;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const JourneyCompany = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
`;

const JourneyArrow = styled.span`
  font-size: 1rem;
  color: var(--ink4);
`;

const Quote = styled.blockquote`
  font-size: 0.875rem;
  color: var(--ink2);
  line-height: 1.7;
  margin: 0 0 16px;
  font-style: italic;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
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

const AlumniChapter = ({ targetRole }) => {
  const [page, setPage] = useState(0);
  const stories = alumniData.length > 0 ? alumniData : [];
  const cardsPerPage = 2;
  const totalPages = Math.ceil(stories.length / cardsPerPage);

  if (stories.length === 0) return null;

  const startIdx = page * cardsPerPage;
  const visibleStories = stories.slice(startIdx, startIdx + cardsPerPage);

  return (
    <Section id="cpe-alumni-section">
      <Container>
        <ChapterLabel>06 · People Like You</ChapterLabel>
        <Title>They were exactly where you are. Here's what changed.</Title>
        <Subtitle>Engineers with your exact starting profile. Real numbers.</Subtitle>

        <CardsRow>
          {visibleStories.map((story, i) => (
            <Card key={startIdx + i}>
              <AvatarBlock>
                <AvatarLetter>{story.initial}</AvatarLetter>
              </AvatarBlock>
              <CardBody>
                <NameRow>
                  <div>
                    <Name>{story.name}</Name>
                    <CurrentTitle>
                      <Briefcase size={12} weight="bold" />
                      {story.currentTitle} at {story.currentCompany}
                    </CurrentTitle>
                  </div>
                </NameRow>

                <JourneyRow>
                  <JourneyItem>
                    <JourneyLabel>Before</JourneyLabel>
                    <JourneyCompany>{story.beforeCompany}</JourneyCompany>
                  </JourneyItem>
                  <JourneyArrow>→</JourneyArrow>
                  <JourneyItem>
                    <JourneyLabel>After</JourneyLabel>
                    <JourneyCompany>{story.afterCompany}</JourneyCompany>
                  </JourneyItem>
                </JourneyRow>

                <Quote>"{story.quote}"</Quote>

                <Stars>
                  {Array.from({ length: story.rating }).map((_, si) => (
                    <Star key={si} size={16} weight="fill" color="#facc15" />
                  ))}
                </Stars>
              </CardBody>
            </Card>
          ))}
        </CardsRow>

        {totalPages > 1 && (
          <NavRow>
            <NavBtn onClick={() => setPage(p => p - 1)} disabled={page === 0}>
              <CaretLeft size={18} weight="bold" />
            </NavBtn>
            <Counter>
              {String(page + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </Counter>
            <NavBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>
              <CaretRight size={18} weight="bold" />
            </NavBtn>
          </NavRow>
        )}
      </Container>
    </Section>
  );
};

export default AlumniChapter;
