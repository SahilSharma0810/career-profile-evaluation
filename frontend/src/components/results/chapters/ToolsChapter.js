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
  background: ${props => props.$bg || 'var(--white)'};
  border-radius: 6px;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--ink);
  font-weight: 700;
  font-size: 0.75rem;
  overflow: hidden;
`;

const ToolLogo = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
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
  'GitHub Copilot': { src: 'https://cdn.simpleicons.org/githubcopilot/000000', bg: '#ffffff', label: 'GC' },
  'Cursor': { src: 'https://cdn.simpleicons.org/cursor/000000', bg: '#ffffff', label: 'C' },
  'ChatGPT + Excalidraw': { src: 'https://cdn.simpleicons.org/openai/10A37F', bg: '#ffffff', label: 'AI' },
  'Datadog Watchdog': { src: 'https://cdn.simpleicons.org/datadog/632CA6', bg: '#ffffff', label: 'D' },
  'Notion AI': { src: 'https://cdn.simpleicons.org/notion/000000', bg: '#ffffff', label: 'N' },
  'CodeRabbit': { src: 'https://cdn.simpleicons.org/rabbitmq/FF6600', bg: '#ffffff', label: 'CR' },
  'Perplexity': { src: 'https://cdn.simpleicons.org/perplexity/000000', bg: '#ffffff', label: 'P' },
  'v0 / Bolt': { src: 'https://cdn.simpleicons.org/vercel/000000', bg: '#ffffff', label: 'v0' },
  'Warp': { src: 'https://cdn.simpleicons.org/warp/01A4FF', bg: '#ffffff', label: 'W' }
};

const ToolIconContent = ({ toolName, iconConfig }) => {
  const [hasLogoError, setHasLogoError] = React.useState(false);
  const showLogo = Boolean(iconConfig.src) && !hasLogoError;

  return (
    <>
      {showLogo ? (
        <ToolLogo
          src={iconConfig.src}
          alt={`${toolName} logo`}
          loading="lazy"
          onError={() => setHasLogoError(true)}
        />
      ) : (
        iconConfig.label
      )}
    </>
  );
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
              const iconConfig = TOOL_ICONS[tool.name] || { bg: '#ffffff', label: tool.name.charAt(0) };
              return (
                <ToolCell key={i}>
                  <ToolIcon $bg={iconConfig.bg}>
                    <ToolIconContent toolName={tool.name} iconConfig={iconConfig} />
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
