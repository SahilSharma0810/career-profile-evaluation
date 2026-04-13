import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'phosphor-react';
import tracker from '../../utils/tracker';

const Root = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-eye);
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Heading = styled.h2`
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button`
  background: var(--white);
  border: 1px solid var(--line);
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  min-height: 160px;

  &:hover {
    border-color: var(--ink3);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  @media (max-width: 768px) {
    padding: 22px 20px;
    min-height: auto;
  }
`;

const OptionTitle = styled.div`
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
`;

const OptionDescription = styled.div`
  font-size: 0.875rem;
  color: var(--ink3);
  line-height: 1.5;
  margin-top: 4px;
`;

const Arrow = styled.div`
  color: var(--ink4);
  transition: color 0.2s ease, transform 0.2s ease;

  ${OptionCard}:hover & {
    color: var(--ink);
    transform: translateX(3px);
  }
`;

const BackgroundSelectionSplit2 = ({ onSelect, onAutoAdvance, hideChat = false, onChatTextChange }) => {
  const handleBackgroundSelect = (background) => {
    onSelect(background);

    tracker.click({
      click_type: 'question_clicked',
      custom: {
        question_number: 1,
        question_text: "What's your current background?",
        option_selected: background
      }
    });

    tracker.formInput({
      click_type: 'question_clicked',
      custom: {
        question_number: 1,
        question_text: "What's your current background?",
        option_selected: background
      }
    });

    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 1000);
    }
  };

  return (
    <Root>
      <SectionLabel>01 · Start</SectionLabel>
      <Heading>What's your current background?</Heading>

      <OptionsContainer>
        <OptionCard onClick={() => handleBackgroundSelect('non-tech')}>
          <div>
            <OptionTitle>Non-Tech / Career Switcher</OptionTitle>
            <OptionDescription>
              Looking to transition into tech from a non-technical background.
            </OptionDescription>
          </div>
          <Arrow>
            <ArrowRight size={20} />
          </Arrow>
        </OptionCard>

        <OptionCard onClick={() => handleBackgroundSelect('tech')}>
          <div>
            <OptionTitle>Software, Data & AI Professional</OptionTitle>
            <OptionDescription>
              Working in software, data, ML, AI, or DevOps — and looking to grow.
            </OptionDescription>
          </div>
          <Arrow>
            <ArrowRight size={20} />
          </Arrow>
        </OptionCard>
      </OptionsContainer>
    </Root>
  );
};

export default BackgroundSelectionSplit2;
