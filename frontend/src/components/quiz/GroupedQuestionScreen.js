import React, { useState } from 'react';
import styled from 'styled-components';
import { Check } from 'phosphor-react';
import tracker from '../../utils/tracker';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 32px;
  }
`;

const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuestionNumber = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
`;

const QuestionLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
`;

const HelperText = styled.div`
  font-size: 0.8125rem;
  color: #94a3b8;
  line-height: 1.4;
  margin-top: -4px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 520px;
`;

const OptionButton = styled.button`
  background: ${props => props.$selected ? '#f0f4ff' : '#ffffff'};
  color: ${props => props.$selected ? '#0041ca' : '#1e293b'};
  border: 1.5px solid ${props => props.$selected ? '#0041ca' : '#e2e8f0'};
  padding: 14px 18px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;

  &:hover {
    border-color: ${props => props.$selected ? '#0041ca' : '#cbd5e1'};
    background: ${props => props.$selected ? '#f0f4ff' : '#fafbfc'};
  }

  &:focus {
    outline: none;
    border-color: #0041ca;
    box-shadow: 0 0 0 3px rgba(0, 65, 202, 0.08);
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
  color: #0041ca;
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
            {formatNumber(questionStartIndex + questionIndex)}
          </QuestionNumber>
          <QuestionLabel>{question.question}</QuestionLabel>
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
                  onClick={() => handleOptionSelect(question, option, questionIndex)}
                >
                  <OptionLabel>{option.label}</OptionLabel>
                  <CheckContainer $visible={isSelected}>
                    <Check size={18} weight="bold" />
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
