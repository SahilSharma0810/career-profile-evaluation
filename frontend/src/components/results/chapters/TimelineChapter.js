import React from 'react';
import styled from 'styled-components';
import { Clock, Target } from 'phosphor-react';

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
  margin: 0 0 40px;
  line-height: 1.15;
  @media (max-width: 768px) { font-size: 1.625rem; }
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const RoleCard = styled.div`
  border: 1px solid ${props => props.$primary ? '#86efac' : 'var(--line)'};
  background: var(--white);
  display: flex;
  flex-direction: column;
`;

const RoleCardHeader = styled.div`
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${props => props.$primary ? '#dcfce7' : 'var(--line)'};
`;

const RoleCategory = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${props => props.$primary ? '#059669' : props.$orange ? 'var(--accent-eye)' : 'var(--ink4)'};
  margin-bottom: 8px;
`;

const RoleTitle = styled.h3`
  font-family: var(--serif);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 4px;
  line-height: 1.25;
`;

const RoleSubtitle = styled.div`
  font-size: 0.75rem;
  color: var(--ink4);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TimelineBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.$primary ? '#059669' : 'var(--ink3)'};
  padding: 10px 20px;
  border-bottom: 1px solid ${props => props.$primary ? '#dcfce7' : 'var(--line)'};
`;

const MilestonesBody = styled.div`
  flex: 1;
`;

const Milestone = styled.div`
  padding: 14px 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border-bottom: 1px solid ${props => props.$primary ? '#dcfce7' : 'var(--line)'};

  &:last-child {
    border-bottom: none;
  }
`;

const MilestoneBadge = styled.div`
  background: ${props => props.$primary ? '#059669' : 'var(--ink4)'};
  color: var(--white);
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 3px 7px;
  flex-shrink: 0;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MilestoneContent = styled.div``;

const MilestoneTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 2px;
  line-height: 1.3;
`;

const MilestoneDesc = styled.div`
  font-size: 0.75rem;
  color: var(--ink3);
  line-height: 1.4;
`;

const CARD_LABELS = {
  target: 'Your Target Role',
  alternative_1_easier_company: 'Easier Path',
  alternative_2_different_role: 'Alternative Path',
  intern_explore_1: 'Explore Path',
  intern_explore_2: 'Explore Path'
};

const CARD_SUBTITLES = {
  target: 'Primary focus area',
  alternative_1_easier_company: 'Faster path to your goal',
  alternative_2_different_role: 'New specialisation'
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

        <RolesGrid>
          {recommendedRoles.slice(0, 3).map((role, index) => {
            const isPrimary = index === 0;
            const cardType = role.card_type || 'target';
            const label = CARD_LABELS[cardType] || (index === 0 ? 'Your Target Role' : index === 1 ? 'Easier Path' : 'Alternative Path');
            const subtitle = CARD_SUBTITLES[cardType] || '';
            const timeline = role.timeline_text || `${role.min_months || 4}–${role.max_months || 6} months`;

            const milestones = (role.milestones && role.milestones.length > 0)
              ? role.milestones.map((m, mi) => ({
                badge: `M${mi + 1}`,
                title: typeof m === 'string' ? m : m.title || m,
                desc: typeof m === 'object' ? m.description || '' : ''
              }))
              : DEFAULT_MILESTONES;

            return (
              <RoleCard key={index} $primary={isPrimary}>
                <RoleCardHeader $primary={isPrimary}>
                  <RoleCategory $primary={isPrimary} $orange={index === 1}>{label}</RoleCategory>
                  <RoleTitle>{role.title}</RoleTitle>
                  {subtitle && (
                    <RoleSubtitle>
                      <Target size={12} weight="bold" />
                      {subtitle}
                    </RoleSubtitle>
                  )}
                </RoleCardHeader>
                <TimelineBadge $primary={isPrimary}>
                  <Clock size={14} weight="bold" />
                  {timeline}
                </TimelineBadge>
                <MilestonesBody>
                  {milestones.map((m, mi) => (
                    <Milestone key={mi} $primary={isPrimary}>
                      <MilestoneBadge $primary={isPrimary}>{m.badge}</MilestoneBadge>
                      <MilestoneContent>
                        <MilestoneTitle>{m.title}</MilestoneTitle>
                        {m.desc && <MilestoneDesc>{m.desc}</MilestoneDesc>}
                      </MilestoneContent>
                    </Milestone>
                  ))}
                </MilestonesBody>
              </RoleCard>
            );
          })}
        </RolesGrid>
      </Container>
    </Section>
  );
};

export default TimelineChapter;
