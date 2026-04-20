import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useStore } from '@nanostores/react';
import { ArrowUpRight, Play } from 'phosphor-react';
import { getCoursesForRole, getStructuredProgramForRole } from '../../../data/courses_by_role';
import { getProgramKeyForTargetRole } from '../../../utils/evaluationLogic';
import { createUpcomingMasterclassesStore } from '../../../store/upcomingMasterclasses';
import grainLeftSrc from '../../../assets/program_banners/grain-1.svg';
import grainRightSrc from '../../../assets/program_banners/grain-2.svg';
import aiPanelBackground from '../../../assets/program_banners/ai-background.png';

const Section = styled.section`
  padding: 80px 0;
  background: var(--white);
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
  @media (max-width: 768px) { font-size: 1.625rem; }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--ink3);
  margin: 0 0 48px;
  line-height: 1.5;
`;

/* ── Path 1: Free ──────────────────────────────────────────── */

const PathBadge = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: ${props => props.$free ? '#059669' : 'var(--accent)'};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
`;

const PathTitle = styled.h3`
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 8px;
  line-height: 1.25;
`;

const PathDesc = styled.p`
  font-size: 0.875rem;
  color: var(--ink3);
  margin: 0 0 28px;
  line-height: 1.5;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background: var(--white);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
`;

const CourseCardBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CourseSource = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 600;
  color: var(--accent-eye);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const CourseTitleContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CourseIcon = styled.img`
  width: 56px;
  height: 56px;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
`;

const CourseName = styled.div`
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 6px;
  line-height: 1.3;
`;

const CourseDesc = styled.div`
  font-size: 0.8125rem;
  color: var(--ink3);
  line-height: 1.4;
  flex: 1;
`;

const CourseMeta = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--ink4);
  margin-top: 12px;
`;

const CourseLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  font-family: var(--sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background 0.15s ease;

  &:hover {
    background: var(--bg);
  }
`;

/* ── Masterclasses ─────────────────────────────────────────── */

const MCSection = styled.div`
  margin-bottom: 48px;
`;

const MCLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
`;

const MCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MCCard = styled.article`
  background: var(--white);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--line2);
    box-shadow: 0 10px 28px rgba(17, 17, 17, 0.06);
  }
`;

const MCImageWrap = styled.div`
  position: relative;
  background: var(--bg);
`;

const MCImage = styled.img`
  width: 100%;
  object-fit: contain;
  display: block;
`;

const MCImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink4);
  background: linear-gradient(145deg, var(--bg) 0%, #e8eaef 100%);
`;

const MCBadge = styled.div`
  top: 12px;
  left: 12px;
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 700;
  color: var(--white);
  background: var(--accent);
  padding: 5px 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  line-height: 1.25;
  box-shadow: 0 2px 8px rgba(17, 17, 17, 0.12);
`;

const MCCardBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MCMeta = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--accent-eye);
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const MCTitle = styled.h3`
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  line-height: 1.35;
`;

const MCSpeaker = styled.div`
  font-size: 0.8125rem;
  color: var(--ink3);
  line-height: 1.4;
  margin-top: 2px;
`;

const MCLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--line);
  font-family: var(--sans);
  font-family: var(--sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background 0.15s ease;

  &:hover {
    background: var(--bg);
  }
`;

/* ── Path 2: Structured ────────────────────────────────────── */

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: var(--line);
  margin: 0 0 48px;
`;

const StructuredCard = styled.div`
  background: var(--white);
  border: 1px solid var(--line);
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

const StructuredInner = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 34%) 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StructuredVisual = styled.div`
  position: relative;
  min-height: 520px;
  padding: 36px 28px;
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) =>
    p.$bgUrl
      ? `
    background-color: #0d4f78;
    background-image:
      linear-gradient(
        168deg,
        rgba(6, 55, 90, 0.78) 0%,
        rgba(15, 70, 140, 0.72) 50%,
        rgba(25, 55, 150, 0.74) 100%
      ),
      url(${p.$bgUrl});
    background-size: cover, cover;
    background-position: center, center;
    background-repeat: no-repeat;
  `
      : `
    background:
      radial-gradient(125% 120% at 16% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 44%),
      linear-gradient(168deg, #0a8fbf 0%, #1f8fc8 42%, #245fdd 100%);
  `}

  @media (max-width: 768px) {
    padding: 24px;
    min-height: 360px;
  }
`;

const VisualTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const VisualLabel = styled.div`
  font-family: var(--sans);
  font-size: 0.625rem;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
`;

const ProgramName = styled.h4`
  font-family: var(--sans);
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 1.1;
  margin: 0;
  color: var(--white);

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`;

const ProgramDesc = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.88);
`;

const ProgramStatsRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
  width: 100%;
  padding-top: 8px;
`;

const ProgramStatColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 12px;
`;

const ProgramStatMainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LaurelImg = styled.img`
  width: 22px;
  height: 40px;
  flex: 0 0 auto;
  display: block;
  object-fit: contain;
`;

const ProgramStatBig = styled.div`
  font-family: var(--sans);
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1.05;
`;

const ProgramStatSub = styled.div`
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
  margin-top: 6px;
`;

const ProgramStatsDivider = styled.div`
  width: 1px;
  align-self: stretch;
  min-height: 52px;
  background: rgba(255, 255, 255, 0.38);
  flex: 0 0 auto;
  margin: 4px 8px;
`;

const StructuredRight = styled.div`
  background: #f8f8f8;
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
`;

const StructuredBody = styled.div`
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 24px 24px 20px;
  }
`;

const BodyLabel = styled.div`
  font-family: var(--sans);
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Feature = styled.li`
  font-size: 1.125rem;
  color: var(--ink2);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.4;
`;

const FeatureGrain = styled.img`
  width: 20px;
  height: auto;
  flex: 0 0 20px;
  object-fit: contain;
  opacity: 0.88;
  margin-top: 3px;
`;

const FeatureCore = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 14px;
`;

const FeatureIndex = styled.span`
  font-family: var(--mono);
  font-size: 1.125rem;
  color: #4b5563;
  width: 26px;
  flex: 0 0 26px;
`;

const FeatureText = styled.span`
  flex: 1;
`;

const FeatureStrong = styled.span`
  font-weight: 700;
  color: var(--ink);
`;

const FeatureLite = styled.span`
  color: var(--ink3);
`;

const AI_CAROUSEL_MS = 5200;

const AIPanel = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background-color: #e8f2fb;
  background-image: url(${aiPanelBackground});
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: min(58%, 320px) auto;
  padding: 22px 24px 18px;
  min-height: 176px;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    background-size: min(72%, 260px) auto;
    min-height: 200px;
  }
`;

const AIPanelLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.45);
  text-transform: uppercase;
  letter-spacing: 1.35px;
  margin-bottom: 10px;
`;

const AIPanelBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const AIPanelSlideWrap = styled.div`
  flex: 1;
  position: relative;
  min-height: 4.5rem;
`;

const AIPanelSlideText = styled.p`
  margin: 0;
  font-family: var(--sans);
  font-size: 1.0625rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.45;
  max-width: min(100%, 42rem);
  animation: aiPanelSlideIn 0.38s ease;

  @keyframes aiPanelSlideIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AIPanelDots = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
`;

const AIPanelDot = styled.button`
  display: block;
  border: none;
  padding: 0;
  height: 5px;
  border-radius: 999px;
  cursor: pointer;
  transition: width 0.28s ease, background 0.28s ease, opacity 0.28s ease;

  ${(p) =>
    p.$active
      ? `
    width: 32px;
    background: #0f172a;
    opacity: 1;
  `
      : `
    width: 14px;
    background: #94a3b8;
    opacity: 0.45;
  `}

  &:hover {
    opacity: ${(p) => (p.$active ? 1 : 0.75)};
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 14px;
  padding: 20px 36px 28px;
  margin-top: auto;

  @media (max-width: 768px) {
    padding: 18px 24px 24px;
    flex-wrap: wrap;
  }
`;

const PrimaryBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #1e57f0;
  color: var(--white);
  padding: 12px 24px;
  font-family: var(--sans);
  font-weight: 500;
  font-size: 1.125rem;
  text-decoration: none;
  letter-spacing: 0;
  transition: background 0.15s ease;
  width: 100%;

  &:hover { background: #1d4ed8; }
`;

const OutlineBtn = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: var(--ink);
  border: 1px solid #8b8b8b;
  padding: 14px 24px;
  font-family: var(--sans);
  font-weight: 500;
  font-size: 1.125rem;
  text-decoration: none;
  letter-spacing: 0;
  width: 100%;
  transition: all 0.15s ease;

  &:hover { border-color: #4b5563; }
`;

const normalizeProgramStats = (raw) => {
  if (!raw) {
    return { rating: '—', ratingsLine: '(— Ratings)', months: '—' };
  }
  if (Array.isArray(raw)) {
    const rating = raw[0]?.value ?? '—';
    const months = raw[1]?.value ?? raw[0]?.value ?? '—';
    const label =
      raw[0]?.label === undefined || raw[0]?.label === null ? '' : String(raw[0].label);
    const paren = label.match(/\(([^)]+)\)/);
    const ratingsLine = paren ? `(${paren[1]})` : '(Ratings)';
    return { rating, ratingsLine, months };
  }
  const ratings =
    raw.ratings === undefined || raw.ratings === null ? '' : String(raw.ratings).trim();
  const ratingsLine = ratings ? `(${ratings} Ratings)` : '(Ratings)';
  return {
    rating:
      raw.overallRating === undefined || raw.overallRating === null
        ? '—'
        : String(raw.overallRating),
    ratingsLine,
    months: raw.months === undefined || raw.months === null ? '—' : String(raw.months)
  };
};

const TwoPathsChapter = ({ targetRole, hideCTAs, onResourceClick }) => {
  const courses = getCoursesForRole(targetRole);
  const program = getStructuredProgramForRole(targetRole);
  const programKey = getProgramKeyForTargetRole(targetRole);
  const $upcomingMc = useMemo(
    () => createUpcomingMasterclassesStore(programKey, 3),
    [programKey]
  );
  const { data: upcomingList } = useStore($upcomingMc);
  const masterclasses =
    Array.isArray(upcomingList) && upcomingList.length > 0 ? upcomingList : [];
  const structuredFeatures = program.features;
  const aiPanel = program.aiPanel;
  const aiPanelItems = Array.isArray(aiPanel) ? aiPanel : [];
  const programStats = normalizeProgramStats(program.stats);
  const [aiSlideIndex, setAiSlideIndex] = useState(0);

  useEffect(() => {
    setAiSlideIndex(0);
  }, [programKey]);

  useEffect(() => {
    if (aiPanelItems.length <= 1) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setAiSlideIndex((i) => (i + 1) % aiPanelItems.length);
    }, AI_CAROUSEL_MS);
    return () => window.clearInterval(id);
  }, [aiPanelItems.length]);

  const getFeatureParts = (featureText) => {
    const normalized = String(featureText || '').trim();
    const separatorIndex = normalized.search(/\s[-:]\s/);
    if (separatorIndex === -1) {
      return {
        lead: normalized,
        detail: ''
      };
    }
    return {
      lead: normalized.slice(0, separatorIndex).trim(),
      detail: normalized.slice(separatorIndex + 3).trim()
    };
  };

  return (
    <Section id="cpe-two-paths">
      <Container>
        <ChapterLabel>04 · Two Paths Forward</ChapterLabel>
        <Title>Two paths to close your gaps.</Title>
        <Subtitle>One is free. One is faster. Both work.</Subtitle>

        {/* Path 1: Free */}
        <PathBadge $free>Path 01 · Free</PathBadge>
        <PathTitle>Start with your biggest gaps — free</PathTitle>
        <PathDesc>System design and distributed systems are weak spots. These three courses address exactly that.</PathDesc>

        <CourseGrid>
          {courses.map((course, i) => (
            <CourseCard key={i}>
              <CourseCardBody>
                <CourseSource>Scaler Topics</CourseSource>
                <CourseTitleContainer>
                  <CourseIcon src={course.icon} alt="" />
                  <CourseName>{course.title}</CourseName>
                </CourseTitleContainer>
                <CourseDesc>{course.description}</CourseDesc>
                <CourseMeta>{course.type} · {course.duration} · Free</CourseMeta>
              </CourseCardBody>
              <CourseLink
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onResourceClick?.('course_cta_clicked', {
                  section: 'two_paths',
                  resource_type: 'course',
                  resource_title: course.title,
                  resource_url: course.url
                })}
              >
                Start learning →
                <ArrowUpRight size={14} />
              </CourseLink>
            </CourseCard>
          ))}
        </CourseGrid>

        {masterclasses.length > 0 && (
          <MCSection>
            <MCLabel>Free masterclasses — Picked for your gaps</MCLabel>
            <MCGrid>
              {masterclasses.map((mc, i) => (
                <MCCard key={mc.id || `${mc.title}-${mc.url}-${i}`}>
                  <MCImageWrap>
                    {mc.imageUrl ? (
                      <MCImage
                        src={mc.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <MCImageFallback aria-hidden>
                        <Play size={36} weight="duotone" />
                      </MCImageFallback>
                    )}
                  </MCImageWrap>
                  <MCCardBody>
                    <MCMeta>Free masterclass</MCMeta>
                    <MCTitle>{mc.title}</MCTitle>
                    <MCSpeaker>
                      {mc.speaker}
                      {mc.speakerTitle ? ` · ${mc.speakerTitle}` : ''}
                    </MCSpeaker>
                    <MCBadge>Live · {mc.day} · {mc.time}</MCBadge>
                  </MCCardBody>
                  <MCLink
                    href={mc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onResourceClick?.('masterclass_cta_clicked', {
                      section: 'two_paths',
                      resource_type: 'masterclass',
                      resource_title: mc.title,
                      resource_url: mc.url
                    })}
                  >
                    Save my seat →
                    <ArrowUpRight size={14} />
                  </MCLink>
                </MCCard>
              ))}
            </MCGrid>
          </MCSection>
        )}

        <Divider />

        {/* Path 2: Structured */}
        <PathBadge>Path 02 · Structured · Faster</PathBadge>
        <PathTitle>Stop patching gaps alone. Get a system that closes all of them.</PathTitle>
        <PathDesc>
          Mentors from Google and Amazon. 20+ mock interviews. 5 production projects. Direct referrals to 400+ companies. The gaps you just read about? This is how people actually close them — in 8 months.
        </PathDesc>

        <StructuredCard>
          <StructuredInner>
            <StructuredVisual $bgUrl={program.background}>
              <VisualTop>
                <VisualLabel>For Engineers Building Apps & Systems</VisualLabel>
                <ProgramName>{program.name}</ProgramName>
                <ProgramDesc>{program.description}</ProgramDesc>
              </VisualTop>
              <ProgramStatsRow>
                <ProgramStatColumn>
                  <ProgramStatMainRow>
                    <LaurelImg src={grainLeftSrc} alt="" aria-hidden />
                    <ProgramStatBig>{programStats.rating}</ProgramStatBig>
                    <LaurelImg src={grainRightSrc} alt="" aria-hidden />
                  </ProgramStatMainRow>
                  <ProgramStatSub>{programStats.ratingsLine}</ProgramStatSub>
                </ProgramStatColumn>
                <ProgramStatsDivider aria-hidden />
                <ProgramStatColumn>
                  <ProgramStatBig>{programStats.months}</ProgramStatBig>
                  <ProgramStatSub>Months</ProgramStatSub>
                </ProgramStatColumn>
              </ProgramStatsRow>
            </StructuredVisual>

            <StructuredRight>
              <StructuredBody>
                <BodyLabel>What you'll build</BodyLabel>
                <FeatureList>
                  {structuredFeatures.map((feature, i) => {
                    const { title, description } = feature;
                    return (
                      <Feature key={i}>
                        <FeatureCore>
                          <FeatureIndex>{String(i + 1).padStart(2, '0')}</FeatureIndex>
                          <FeatureText>
                            <FeatureStrong>{title}</FeatureStrong>
                            <FeatureLite>{description}</FeatureLite>
                          </FeatureText>
                        </FeatureCore>                        
                      </Feature>
                    );
                  })}
                </FeatureList>
                {aiPanelItems.length > 0 && (
                  <AIPanel>
                    <AIPanelLabel>How roles evolve with AI?</AIPanelLabel>
                    <AIPanelBody>
                      <AIPanelSlideWrap aria-live="polite">
                        <AIPanelSlideText key={aiSlideIndex}>
                          {aiPanelItems[aiSlideIndex]}
                        </AIPanelSlideText>
                      </AIPanelSlideWrap>
                      {aiPanelItems.length > 1 && (
                        <AIPanelDots role="tablist" aria-label="AI highlights">
                          {aiPanelItems.map((_, i) => (
                            <AIPanelDot
                              key={i}
                              type="button"
                              role="tab"
                              aria-selected={i === aiSlideIndex}
                              aria-label={`Highlight ${i + 1} of ${aiPanelItems.length}`}
                              $active={i === aiSlideIndex}
                              onClick={() => setAiSlideIndex(i)}
                            />
                          ))}
                        </AIPanelDots>
                      )}
                    </AIPanelBody>
                  </AIPanel>
                )}
              </StructuredBody>

              {!hideCTAs && (
                <ButtonRow>
                  <PrimaryBtn
                    href={program.primaryCta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onResourceClick?.('program_cta_clicked', {
                      section: 'two_paths',
                      resource_type: 'program',
                      cta_type: 'primary',
                      cta_label: program.primaryCta.label,
                      resource_url: program.primaryCta.url
                    })}
                  >
                    {program.primaryCta.label}
                  </PrimaryBtn>
                  <OutlineBtn
                    href={program.secondaryCta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onResourceClick?.('curriculum_cta_clicked', {
                      section: 'two_paths',
                      resource_type: 'program',
                      cta_type: 'secondary',
                      cta_label: program.secondaryCta.label,
                      resource_url: program.secondaryCta.url
                    })}
                  >
                    {program.secondaryCta.label}
                  </OutlineBtn>
                </ButtonRow>
              )}
            </StructuredRight>
          </StructuredInner>
        </StructuredCard>
      </Container>
    </Section>
  );
};

export default TwoPathsChapter;
