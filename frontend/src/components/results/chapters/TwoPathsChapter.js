import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useStore } from '@nanostores/react';
import { ArrowUpRight, Check, Play } from 'phosphor-react';
import { getCoursesForRole } from '../../../data/courses_by_role';
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

const CourseCardTop = styled.div`
  height: 80px;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CourseTopDots = styled.div`
  display: flex;
  gap: 6px;

  span {
    width: 8px;
    height: 12px;
    background: var(--line2);
    border-radius: 1px;
  }
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
  font-family: var(--mono);
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
  aspect-ratio: 16 / 10;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
`;

const MCImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  position: absolute;
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
  max-width: calc(100% - 24px);
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
  font-family: var(--mono);
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StructuredInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StructuredLeft = styled.div`
  padding: 36px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const StructuredRight = styled.div`
  background: var(--bg);
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px;
  min-height: 240px;

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid var(--line);
    padding: 24px;
    min-height: 180px;
  }
`;

const ProgramName = styled.div`
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 12px;
`;

const ProgramDesc = styled.div`
  font-size: 0.875rem;
  color: var(--ink3);
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ProgramStats = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ProgramStat = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgramStatVal = styled.div`
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--ink);
`;

const ProgramStatLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Feature = styled.li`
  font-size: 0.8125rem;
  color: var(--ink2);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  color: var(--white);
  padding: 12px 24px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.75rem;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background 0.15s ease;

  &:hover { background: #1d4ed8; }
`;

const OutlineBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--white);
  color: var(--ink);
  border: 1px solid var(--line);
  padding: 12px 24px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.75rem;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.15s ease;

  &:hover { border-color: var(--line2); }
`;

const WalkthroughBtn = styled.button`
  background: var(--white);
  border: 1px solid var(--line);
  padding: 10px 18px;
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--ink3);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
`;

const PlayButton = styled.div`
  width: 64px;
  height: 64px;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover { background: var(--ink2); }
`;

const VideoCaption = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  color: var(--ink4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 12px;
  text-align: center;
`;

const TwoPathsChapter = ({ targetRole, hideCTAs }) => {
  const courses = getCoursesForRole(targetRole);
  const programKey = getProgramKeyForTargetRole(targetRole);
  const $upcomingMc = useMemo(
    () => createUpcomingMasterclassesStore(programKey, 3),
    [programKey]
  );
  const { data: upcomingList } = useStore($upcomingMc);
  const masterclasses =
    Array.isArray(upcomingList) && upcomingList.length > 0 ? upcomingList : [];

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
              <CourseCardTop>
                <CourseTopDots>
                  <span /><span /><span />
                </CourseTopDots>
              </CourseCardTop>
              <CourseCardBody>
                <CourseSource>Scaler Topics</CourseSource>
                <CourseName>{course.title}</CourseName>
                <CourseDesc>{course.description}</CourseDesc>
                <CourseMeta>{course.type} · {course.duration} · Free</CourseMeta>
              </CourseCardBody>
              <CourseLink href={course.url} target="_blank" rel="noopener noreferrer">
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
                    {mc.imageWideUrl ? (
                      <picture>
                        <source media="(min-width: 769px)" srcSet={mc.imageWideUrl} />
                        <MCImage
                          src={mc.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    ) : mc.imageUrl ? (
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
                    <MCBadge>Live · {mc.day} · {mc.time}</MCBadge>
                  </MCImageWrap>
                  <MCCardBody>
                    <MCMeta>Free masterclass</MCMeta>
                    <MCTitle>{mc.title}</MCTitle>
                    <MCSpeaker>
                      {mc.speaker}
                      {mc.speakerTitle ? ` · ${mc.speakerTitle}` : ''}
                    </MCSpeaker>
                  </MCCardBody>
                  <MCLink href={mc.url} target="_blank" rel="noopener noreferrer">
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
            <StructuredLeft>
              <ProgramName>Scaler Software Engineering</ProgramName>
              <ProgramDesc>
                The fastest proven path from "stuck" to hired at a product company. Built by engineers who've been on both sides of the interview table.
              </ProgramDesc>

              <ProgramStats>
                <ProgramStat>
                  <ProgramStatVal>8 mo</ProgramStatVal>
                  <ProgramStatLabel>Job-ready</ProgramStatLabel>
                </ProgramStat>
                <ProgramStat>
                  <ProgramStatVal>900+</ProgramStatVal>
                  <ProgramStatLabel>Placed alumni</ProgramStatLabel>
                </ProgramStat>
                <ProgramStat>
                  <ProgramStatVal>2.5×</ProgramStatVal>
                  <ProgramStatLabel>Avg salary jump</ProgramStatLabel>
                </ProgramStat>
              </ProgramStats>

              <FeatureList>
                <Feature><Check size={14} weight="bold" color="#059669" />1:1 mentors from Google, Amazon, Flipkart</Feature>
                <Feature><Check size={14} weight="bold" color="#059669" />20+ mock interviews with sharp feedback</Feature>
                <Feature><Check size={14} weight="bold" color="#059669" />5 production-grade resume projects</Feature>
                <Feature><Check size={14} weight="bold" color="#059669" />Direct referrals to 400+ companies</Feature>
                <Feature><Check size={14} weight="bold" color="#059669" />Pay after placement (income share)</Feature>
              </FeatureList>

              {!hideCTAs && (
                <ButtonRow>
                  <PrimaryBtn href="https://www.scaler.com/courses/software-engineering/" target="_blank" rel="noopener noreferrer">
                    Go to program page →
                  </PrimaryBtn>
                  <OutlineBtn href="https://www.scaler.com/courses/software-engineering/" target="_blank" rel="noopener noreferrer">
                    Download curriculum
                  </OutlineBtn>
                </ButtonRow>
              )}
            </StructuredLeft>
            <StructuredRight>
              <WalkthroughBtn>2 min · Walkthrough</WalkthroughBtn>
              <PlayButton>
                <Play size={28} weight="fill" />
              </PlayButton>
              <VideoCaption>Hear from Anshuman in 2 minutes</VideoCaption>
            </StructuredRight>
          </StructuredInner>
        </StructuredCard>
      </Container>
    </Section>
  );
};

export default TwoPathsChapter;
