import React, { useState } from 'react';
import styled from 'styled-components';
import { Check } from 'phosphor-react';
import tracker from '../../utils/tracker';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const QuestionNumber = styled.div`
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ink);
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const QNum = styled.span`
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink4);
`;

const QuestionLabel = styled.span`
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.5;
`;

const HelperText = styled.div`
  font-size: 0.8125rem;
  color: var(--ink4);
  line-height: 1.4;
  margin-top: -4px;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled.button`
  background: ${props => props.$selected ? '#EFF4FF' : 'var(--white)'};
  color: ${props => props.$selected ? 'var(--accent)' : 'var(--ink)'};
  border: 1px solid ${props => props.$selected ? 'var(--accent)' : 'var(--line)'};
  padding: 14px 16px;
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  &:hover {
    border-color: ${props => props.$selected ? 'var(--accent)' : 'var(--line2)'};
    background: ${props => props.$selected ? '#EFF4FF' : 'var(--bg)'};
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
  }
`;

const OptionIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink4);

  ${OptionButton}[data-selected="true"] & {
    color: var(--accent);
  }
`;

const OptionLabel = styled.span`
  flex: 1;
  line-height: 1.4;
`;

const CheckContainer = styled.span`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$visible ? 1 : 0};
  color: var(--accent);
  transition: opacity 0.15s ease;
`;

const GroupedQuestionScreen = ({
  questions,
  responses,
  onResponse,
  initialChatText,
  chatResponseMap,
  questionStartIndex = 1,
  onAutoAdvance,
  onChatTextChange,
  hideChat = false
}) => {
  const [chatText, setChatText] = useState(initialChatText);

  const handleOptionSelect = (question, option, questionIndex) => {
    const questionId = question.id;

    if (responses[questionId] === option.value) {
      return;
    }

    tracker.click({
      click_type: 'question_clicked',
      custom: {
        question_number: questionStartIndex + questionIndex,
        question_id: questionId,
        question_text: question.question,
        option_selected: option.value,
        option_label: option.label ?? option.value
      }
    });

    tracker.formInput({
      click_type: 'question_clicked',
      custom: {
        question_number: questionStartIndex + questionIndex,
        question_id: questionId,
        question_text: question.question,
        option_selected: option.value,
        option_label: option.label ?? option.value
      }
    });

    onResponse(questionId, option, question);

    const updatedResponses = { ...responses, [questionId]: option.value };
    const allAnswered = questions.every((q) => {
      if (q.optional) return true;
      return updatedResponses[q.id] !== undefined && updatedResponses[q.id] !== null;
    });
    const isLastQuestion = questionIndex === questions.length - 1;
    const isSingleQuestion = questions.length === 1;

    if (!isSingleQuestion && !isLastQuestion) {
      if (chatResponseMap && chatResponseMap[questionId] && chatResponseMap[questionId][option.value]) {
        const newChatText = chatResponseMap[questionId][option.value];
        setChatText(newChatText);
        if (onChatTextChange) {
          onChatTextChange(newChatText);
        }
      }
    }

    if (!isLastQuestion) {
      setTimeout(() => {
        const nextQuestionElement = document.querySelector(`[data-question-index="${questionIndex + 1}"]`);
        if (nextQuestionElement) {
          nextQuestionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }

    if (allAnswered && onAutoAdvance) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onAutoAdvance();
      }, 1000);
    }
  };

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <Container>
      {questions.map((question, questionIndex) => (
        <QuestionGroup key={question.id} data-question-index={questionIndex}>
          <QuestionNumber>
            <QNum>{formatNumber(questionStartIndex + questionIndex)}</QNum>
            <QuestionLabel>{question.question}</QuestionLabel>
          </QuestionNumber>
          {(question.helperText || question.helper) && (
            <HelperText>{question.helperText || question.helper}</HelperText>
          )}
          <OptionsContainer>
            {question.options.map((option) => {
              const isSelected = responses[question.id] === option.value;
              return (
                <OptionButton
                  key={option.value}
                  $selected={isSelected}
                  data-selected={isSelected}
                  onClick={() => handleOptionSelect(question, option, questionIndex)}
                >
                  {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
                  <OptionLabel>{option.label}</OptionLabel>
                  <CheckContainer $visible={isSelected}>
                    <Check size={16} weight="bold" />
                  </CheckContainer>
                </OptionButton>
              );
            })}
          </OptionsContainer>
        </QuestionGroup>
      ))}
    </Container>
  );
};

export default GroupedQuestionScreen;
