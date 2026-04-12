import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'phosphor-react';
import tracker from '../../utils/tracker';

const Root = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;
`;

const Heading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
`;

const OptionCard = styled.button`
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  padding: 22px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  &:hover {
    border-color: #0041ca;
    box-shadow: 0 2px 8px rgba(0, 65, 202, 0.08);
  }

  &:focus {
    outline: none;
    border-color: #0041ca;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.1);
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
  }
`;

const OptionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OptionTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
`;

const OptionDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
`;

const Arrow = styled.div`
  color: #94a3b8;
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.2s ease;

  ${OptionCard}:hover & {
    color: #0041ca;
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
          <OptionContent>
            <OptionTitle>Non-Tech / Career Switcher</OptionTitle>
            <OptionDescription>
              Looking to transition into tech from a non-technical background.
            </OptionDescription>
          </OptionContent>
          <Arrow>
            <ArrowRight size={22} weight="bold" />
          </Arrow>
        </OptionCard>

        <OptionCard onClick={() => handleBackgroundSelect('tech')}>
          <OptionContent>
            <OptionTitle>Software, Data & AI Professional</OptionTitle>
            <OptionDescription>
              Working in software, data, ML, AI, or DevOps — and looking to grow.
            </OptionDescription>
          </OptionContent>
          <Arrow>
            <ArrowRight size={22} weight="bold" />
          </Arrow>
        </OptionCard>
      </OptionsContainer>
    </Root>
  );
};

export default BackgroundSelectionSplit2;
