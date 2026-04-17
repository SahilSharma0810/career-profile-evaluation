import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useStore } from '@nanostores/react';
import { ArrowUpRight, Play } from 'phosphor-react';
import { getCoursesForRole, getStructuredProgramForRole } from '../../../data/courses_by_role';
import { getProgramKeyForTargetRole } from '../../../utils/evaluationLogic';
import { createUpcomingMasterclassesStore } from '../../../store/upcomingMasterclasses';

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
  font-weight: 700;
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
  background:
    radial-gradient(125% 120% at 16% 0%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 44%),
    linear-gradient(168deg, #0a8fbf 0%, #1f8fc8 42%, #245fdd 100%);
  padding: 36px 28px;
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
`;

const ProgramName = styled.h4`
  font-family: var(--sans);
  font-size: 2.25rem;
  font-weight: 700;
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

const ProgramStats = styled.div`
  display: flex;
  gap: 34px;
  flex-wrap: wrap;
`;

const ProgramStat = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgramStatVal = styled.div`
  font-family: var(--sans);
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1.1;
`;

const ProgramStatLabel = styled.div`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
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
  gap: 22px;

  @media (max-width: 768px) {
    padding: 24px 24px 20px;
  }
`;

const BodyLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1.4px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Feature = styled.li`
  font-size: 1.125rem;
  color: var(--ink2);
  display: flex;
  align-items: baseline;
  gap: 14px;
  line-height: 1.4;
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

const AIPanel = styled.div`
  background: linear-gradient(180deg, #e6f4fa 0%, #eaf7fd 100%);
  border-top: 1px solid #dcecf5;
  border-bottom: 1px solid #dcecf5;
  padding: 18px 20px;
`;

const AIPanelLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  color: #4a728a;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
`;

const AIPanelCopy = styled.p`
  margin: 0;
  font-size: 1.125rem;
  color: #234256;
  line-height: 1.4;
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
  font-weight: 700;
  font-size: 0.75rem;
  text-decoration: none;
  letter-spacing: 0;
  transition: background 0.15s ease;

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
  flex: 1;
  min-width: 180px;
  font-family: var(--sans);
  font-weight: 500;
  font-size: 1.125rem;
  text-decoration: none;
  letter-spacing: 0;
  transition: all 0.15s ease;

  &:hover { border-color: #4b5563; }
`;

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
  const structuredFeatures = Array.isArray(program?.features) ? program.features.slice(0, 3) : [];
  const aiPanelCopy = structuredFeatures[2] || 'Uses AI tools for delivery, debugging, and complete refactors.';

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
                <CourseName>{course.title}</CourseName>
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
            <StructuredVisual>
              <VisualTop>
                <VisualLabel>Structured program</VisualLabel>
                <ProgramName>{program.name}</ProgramName>
                <ProgramDesc>{program.description}</ProgramDesc>
              </VisualTop>
              <ProgramStats>
                {program.stats.map((stat, i) => (
                  <ProgramStat key={i}>
                    <ProgramStatVal>{stat.value}</ProgramStatVal>
                    <ProgramStatLabel>{stat.label}</ProgramStatLabel>
                  </ProgramStat>
                ))}
              </ProgramStats>
            </StructuredVisual>

            <StructuredRight>
              <StructuredBody>
                <BodyLabel>What you'll build</BodyLabel>
                <FeatureList>
                  {structuredFeatures.map((feature, i) => {
                    const { lead, detail } = getFeatureParts(feature);
                    return (
                      <Feature key={i}>
                        <FeatureIndex>{String(i + 1).padStart(2, '0')}</FeatureIndex>
                        <FeatureText>
                          <FeatureStrong>{lead}</FeatureStrong>
                          {detail ? (
                            <>
                              <FeatureLite>{' - '}</FeatureLite>
                              <FeatureLite>{detail}</FeatureLite>
                            </>
                          ) : null}
                        </FeatureText>
                      </Feature>
                    );
                  })}
                </FeatureList>
                <AIPanel>
                  <AIPanelLabel>How AI is integrated?</AIPanelLabel>
                  <AIPanelCopy>{aiPanelCopy}</AIPanelCopy>
                </AIPanel>
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
