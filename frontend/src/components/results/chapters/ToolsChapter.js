import React from 'react';
import styled from 'styled-components';
import CURATED_TOOLS from '../../../data/tools_curated';

const Section = styled.section`
  padding: 80px 0;
  background: var(--white);
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
  background: var(--white);
  border: 1px solid var(--line);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ToolCell = styled.div`
  padding: 24px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 14px;
  align-items: flex-start;

  &:nth-child(3n) {
    border-right: none;
  }

  &:nth-last-child(-n+3) {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    &:nth-child(3n) {
      border-right: 1px solid var(--line);
    }
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-last-child(-n+3) {
      border-bottom: 1px solid var(--line);
    }
    &:nth-last-child(-n+2) {
      border-bottom: none;
    }
  }

  @media (max-width: 480px) {
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-last-child(-n+2) {
      border-bottom: 1px solid var(--line);
    }
    &:last-child {
      border-bottom: none;
    }
  }
`;

const ToolIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.$bg || 'var(--ink)'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--white);
  font-weight: 700;
  font-size: 0.75rem;
`;

const ToolInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToolName = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
`;

const ToolTagline = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 600;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
`;

const ToolDesc = styled.div`
  font-size: 0.75rem;
  color: var(--ink3);
  line-height: 1.4;
  margin-top: 6px;
`;

const TOOL_ICONS = {
  'GitHub Copilot': { bg: '#000000', label: '' },
  'Cursor': { bg: '#7C3AED', label: '' },
  'ChatGPT + Excalidraw': { bg: '#10A37F', label: '' },
  'Datadog Watchdog': { bg: '#632CA6', label: '' },
  'Notion AI': { bg: '#000000', label: 'N' },
  'CodeRabbit': { bg: '#DC2626', label: '' },
  'Perplexity': { bg: '#1a73e8', label: '' },
  'v0 / Bolt': { bg: '#000000', label: '' },
  'Warp': { bg: '#000000', label: '' }
};

const ToolsChapter = ({ tools }) => {
  const displayTools = CURATED_TOOLS;

  return (
    <Section id="cpe-tools-section">
      <Container>
        <ChapterLabel>08 · Tools That 10× You</ChapterLabel>
        <Title>{displayTools.length} tools that separate the 10× engineer from the rest.</Title>
        <Subtitle>All have free tiers. Start using them this week.</Subtitle>

        <Card>
          <Grid>
            {displayTools.map((tool, i) => {
              const iconConfig = TOOL_ICONS[tool.name] || { bg: 'var(--ink)', label: tool.name.charAt(0) };
              return (
                <ToolCell key={i}>
                  <ToolIcon $bg={iconConfig.bg}>
                    {iconConfig.label}
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolTagline>{tool.tagline}</ToolTagline>
                    <ToolDesc>{tool.description}</ToolDesc>
                  </ToolInfo>
                </ToolCell>
              );
            })}
          </Grid>
        </Card>
      </Container>
    </Section>
  );
};

export default ToolsChapter;
