import React from 'react';
import styled from 'styled-components';
import { Clock } from 'phosphor-react';

const Section = styled.section`
  padding: 80px 0;
  background: #ffffff;
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
  margin: 0 0 40px;
  line-height: 1.5;
`;

const RolesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const RoleBlock = styled.div`
  border: 1px solid ${props => props.$primary ? '#86efac' : '#e2e8f0'};
  background: ${props => props.$primary ? '#f0fdf4' : '#ffffff'};
`;

const RoleHeader = styled.div`
  padding: 24px 28px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid ${props => props.$primary ? '#bbf7d0' : '#f1f5f9'};
`;

const RoleHeaderLeft = styled.div``;

const RoleCategory = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.$primary ? '#059669' : '#64748b'};
  margin-bottom: 6px;
`;

const RoleTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const RoleTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
`;

const Milestones = styled.div`
  display: flex;
  flex-direction: column;
`;

const Milestone = styled.div`
  padding: 20px 28px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  border-bottom: 1px solid ${props => props.$primary ? '#dcfce7' : '#f1f5f9'};

  &:last-child {
    border-bottom: none;
  }
`;

const MilestoneBadge = styled.div`
  background: ${props => props.$primary ? '#059669' : '#64748b'};
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 4px 8px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const MilestoneContent = styled.div``;

const MilestoneTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const MilestoneDesc = styled.div`
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.4;
`;

const CARD_LABELS = {
  target: 'Your Target Role',
  alternative_1_easier_company: 'Easier Path',
  alternative_2_different_role: 'Alternative Path',
  intern_explore_1: 'Explore Path',
  intern_explore_2: 'Explore Path'
};

const DEFAULT_MILESTONES = [
  { badge: 'M1', title: 'Month 1–2: Deep technical preparation', desc: 'Master your specialisation fundamentals — DSA, system design, backend patterns' },
  { badge: 'M2', title: 'Month 3–4: Build portfolio projects', desc: 'Create 1–2 substantial projects showcasing your target skills' },
  { badge: 'M3', title: 'Month 5+: Interview readiness', desc: 'Polish profile, network, practice interviews, and apply to target roles' }
];

const TimelineChapter = ({ recommendedRoles }) => {
  return (
    <Section id="cpe-career-timeline">
      <Container>
        <ChapterLabel>05 · Career Timeline</ChapterLabel>
        <Title>Realistic timelines to achieve your target roles based on current skill gaps</Title>
        <Subtitle />

        <RolesList>
          {recommendedRoles.slice(0, 3).map((role, index) => {
            const isPrimary = index === 0;
            const cardType = role.card_type || 'target';
            const label = CARD_LABELS[cardType] || (index === 0 ? 'Your Target Role' : index === 1 ? 'Easier Path' : 'Alternative Path');
            const timeline = role.timeline_text || `${role.min_months || 4}–${role.max_months || 6} months`;

            const milestones = (role.milestones && role.milestones.length > 0)
              ? role.milestones.map((m, mi) => ({
                badge: `M${mi + 1}`,
                title: typeof m === 'string' ? m : m.title || m,
                desc: typeof m === 'object' ? m.description || '' : ''
              }))
              : DEFAULT_MILESTONES;

            return (
              <RoleBlock key={index} $primary={isPrimary}>
                <RoleHeader $primary={isPrimary}>
                  <RoleHeaderLeft>
                    <RoleCategory $primary={isPrimary}>{label}</RoleCategory>
                    <RoleTitle>{role.title}</RoleTitle>
                  </RoleHeaderLeft>
                  <RoleTimeline>
                    <Clock size={16} weight="bold" />
                    {timeline}
                  </RoleTimeline>
                </RoleHeader>
                <Milestones>
                  {milestones.map((m, mi) => (
                    <Milestone key={mi} $primary={isPrimary}>
                      <MilestoneBadge $primary={isPrimary}>{m.badge}</MilestoneBadge>
                      <MilestoneContent>
                        <MilestoneTitle>{m.title}</MilestoneTitle>
                        {m.desc && <MilestoneDesc>{m.desc}</MilestoneDesc>}
                      </MilestoneContent>
                    </Milestone>
                  ))}
                </Milestones>
              </RoleBlock>
            );
          })}
        </RolesList>
      </Container>
    </Section>
  );
};

export default TimelineChapter;
