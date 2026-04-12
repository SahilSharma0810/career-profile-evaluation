import React from 'react';
import styled from 'styled-components';
import CURATED_TOOLS from '../../../data/tools_curated';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ToolCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const ToolName = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
`;

const ToolTagline = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0041ca;
`;

const ToolDesc = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
`;

const ToolsChapter = ({ tools }) => {
  const displayTools = CURATED_TOOLS;

  return (
    <Section id="cpe-tools-section">
      <Container>
        <ChapterLabel>08 · Tools That 10× You</ChapterLabel>
        <Title>{displayTools.length} tools that separate the 10× engineer from the rest.</Title>
        <Subtitle>All have free tiers. Start using them this week.</Subtitle>

        <Grid>
          {displayTools.map((tool, i) => (
            <ToolCard key={i}>
              <ToolName>{tool.name}</ToolName>
              <ToolTagline>{tool.tagline}</ToolTagline>
              <ToolDesc>{tool.description}</ToolDesc>
            </ToolCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ToolsChapter;
