import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'phosphor-react';
import { getCoursesForRole, getMasterclasses } from '../../../data/courses_by_role';

const Section = styled.section`
  padding: 80px 0;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    padding: 48px 0;
  }
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
  margin: 0 0 40px;
  line-height: 1.5;
`;

const PathsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const PathSection = styled.div``;

const PathHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const PathBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.$free ? '#059669' : '#0041ca'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PathTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px;
  line-height: 1.3;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const CourseCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
  }
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseSource = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const CourseName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const CourseDesc = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.4;
`;

const CourseMeta = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 8px;
`;

const CourseLink = styled.a`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0041ca;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  white-space: nowrap;
  margin-top: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const MasterclassSection = styled.div`
  margin-top: 8px;
`;

const MCLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
`;

const MCList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MCCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const MCInfo = styled.div`
  flex: 1;
`;

const MCBadge = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
`;

const MCTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
`;

const MCSpeaker = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 2px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #e2e8f0;
  margin: 0;
`;

const StructuredCard = styled.div`
  background: #0f172a;
  color: #ffffff;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 28px 24px;
  }
`;

const StructuredTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StructuredDesc = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatVal = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const StatLbl = styled.div`
  font-size: 0.6875rem;
  color: #94a3b8;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Feature = styled.li`
  font-size: 0.8125rem;
  color: #cbd5e1;
  padding-left: 16px;
  position: relative;

  &::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #64748b;
  }
`;

const StructuredCTA = styled.a`
  display: inline-block;
  background: #ffffff;
  color: #0f172a;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const TwoPathsChapter = ({ targetRole, hideCTAs }) => {
  const courses = getCoursesForRole(targetRole);
  const masterclasses = getMasterclasses();

  return (
    <Section id="cpe-two-paths">
      <Container>
        <ChapterLabel>04 · Two Paths Forward</ChapterLabel>
        <Title>Two paths to close your gaps.</Title>
        <Subtitle>One is free. One is faster. Both work.</Subtitle>

        <PathsGrid>
          {/* Path 1: Free */}
          <PathSection>
            <PathHeader>
              <PathBadge $free>Path 01 · Free</PathBadge>
            </PathHeader>
            <PathTitle>Start with your biggest gaps — free</PathTitle>

            <CourseList>
              {courses.map((course, i) => (
                <CourseCard key={i}>
                  <CourseInfo>
                    <CourseSource>Scaler Topics</CourseSource>
                    <CourseName>{course.title}</CourseName>
                    <CourseDesc>{course.description}</CourseDesc>
                    <CourseMeta>{course.type} · {course.duration} · Free</CourseMeta>
                  </CourseInfo>
                  <CourseLink href={course.url} target="_blank" rel="noopener noreferrer">
                    Start learning <ArrowRight size={14} weight="bold" />
                  </CourseLink>
                </CourseCard>
              ))}
            </CourseList>

            <MasterclassSection>
              <MCLabel>Free masterclasses — picked for your gaps</MCLabel>
              <MCList>
                {masterclasses.map((mc, i) => (
                  <MCCard key={i}>
                    <MCInfo>
                      <MCBadge>Live · {mc.day} {mc.time}</MCBadge>
                      <MCTitle>{mc.title}</MCTitle>
                      <MCSpeaker>{mc.speaker} · {mc.speakerTitle}</MCSpeaker>
                    </MCInfo>
                    <CourseLink href={mc.url} target="_blank" rel="noopener noreferrer">
                      Save my seat <ArrowRight size={14} weight="bold" />
                    </CourseLink>
                  </MCCard>
                ))}
              </MCList>
            </MasterclassSection>
          </PathSection>

          <Divider />

          {/* Path 2: Structured */}
          <PathSection>
            <PathHeader>
              <PathBadge>Path 02 · Structured · Faster</PathBadge>
            </PathHeader>
            <PathTitle>Stop patching gaps alone. Get a system that closes all of them.</PathTitle>

            <StructuredCard>
              <StructuredTitle>Scaler Software Engineering</StructuredTitle>
              <StructuredDesc>
                The fastest proven path from "stuck" to hired at a product company. Built by engineers who've been on both sides of the interview table.
              </StructuredDesc>

              <StatsGrid>
                <Stat>
                  <StatVal>8 mo</StatVal>
                  <StatLbl>Job-ready</StatLbl>
                </Stat>
                <Stat>
                  <StatVal>900+</StatVal>
                  <StatLbl>Placed alumni</StatLbl>
                </Stat>
                <Stat>
                  <StatVal>2.5×</StatVal>
                  <StatLbl>Avg salary jump</StatLbl>
                </Stat>
              </StatsGrid>

              <FeatureList>
                <Feature>1:1 mentors from Google, Amazon, Flipkart</Feature>
                <Feature>20+ mock interviews with sharp feedback</Feature>
                <Feature>5 production-grade resume projects</Feature>
                <Feature>Direct referrals to 400+ companies</Feature>
                <Feature>Pay after placement (income share)</Feature>
              </FeatureList>

              {!hideCTAs && (
                <StructuredCTA href="https://www.scaler.com/courses/software-engineering/" target="_blank" rel="noopener noreferrer">
                  Go to program page →
                </StructuredCTA>
              )}
            </StructuredCard>
          </PathSection>
        </PathsGrid>
      </Container>
    </Section>
  );
};

export default TwoPathsChapter;
