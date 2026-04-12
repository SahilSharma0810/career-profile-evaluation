import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef
} from 'react';

import RequestCallbackModal from "../components/RequestCallbackModal";
import { apiRequest } from "../../utils/api";
import tracker from "../../utils/tracker";
import attribution from "../../utils/attribution";
import { generateJWT } from "../../utils/api";
import { getURLWithUTMParams } from "../../utils/url";
import { sendLSQActivity } from "../../utils/leadSquared";
import { useProfile } from '../../context/ProfileContext';
import { getAdminPageLink, getRCBProgramForTargetRole } from '../../utils/evaluationLogic';

const RequestCallbackContext = createContext({
  open: () => {}
});

const SUBMISSION_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const PROGRAMS_MAPPING = {
  academy: 'software_development'
};

const PROGRAM_NAME_MAPPING = {
  data_science: "Data Science",
  academy: "Software Development",
  devops: "DevOps",
  ai_ml: "AI/ML",
};

const PROGRAM_URL_MAPPING = {
  academy: 'https://www.scaler.com/academy/',
  data_science: 'https://www.scaler.com/courses/data-science-course/',
  devops: 'https://www.scaler.com/courses/devops-course/',
  ai_ml: 'https://www.scaler.com/courses/ai-machine-learning-course/'
};

export const RequestCallbackProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(SUBMISSION_STATUS.LOADING);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentProgram, setCurrentProgram] = useState('');
  const [clickSource, setClickSource] = useState('');
  const submitRef = useRef(null);

  const { evaluationResults, quizResponses } = useProfile();

  const submit = useCallback(async (program, source) => {
    setSubmissionStatus(SUBMISSION_STATUS.LOADING);
    setErrorMessage('');

    attribution.setAttribution('cpe_requested_callback', {
      program: PROGRAMS_MAPPING[program] || program || 'software_development'
    });

    const programName = PROGRAM_NAME_MAPPING[program] || program || "";
    const adminPageLink = getAdminPageLink(evaluationResults?.response_id);

    try {
      await sendLSQActivity({
        activityName: 'rcb_from_cpe',
        fields: [programName, adminPageLink]
      });

      const jwt = await generateJWT();
      const refererUrl = getURLWithUTMParams();

      await apiRequest(
        'POST',
        '/api/v3/analytics/attributions/',
        {
          attributions: {
            ...attribution.getAttribution(),
            product: 'scaler',
            sub_product: 'career_profile_tool',
            element: 'cpe_requested_callback_btn'
          },
          owner: {
            id: 1,
            type: 'CareerProfileEvaluation',
          },
        },
        {
          headers: {
            'X-user-token': jwt,
            'X-REFERER': refererUrl.toString()
          }
        }
      );

      tracker.click({
        click_type: 'rcb_form_submitted',
        custom: {
          source,
          program,
          job_title: 'not_specified'
        }
      });

      setSubmissionStatus(SUBMISSION_STATUS.SUCCESS);
    } catch (error) {
      console.error('Request callback submission failed:', error);
      setSubmissionStatus(SUBMISSION_STATUS.ERROR);
      const errorMsg =
        error.responseJson?.error ||
        error.message ||
        'Failed to submit request. Please try again.';
      setErrorMessage(errorMsg);
    }
  }, [evaluationResults]);

  const open = useCallback((initialState = {}) => {
    const targetRole = quizResponses?.targetRole || '';
    const program = initialState.program || getRCBProgramForTargetRole(targetRole);
    const source = initialState.source || 'unknown';

    setCurrentProgram(program);
    setClickSource(source);
    setIsOpen(true);

    // Store params for retry
    submitRef.current = { program, source };

    submit(program, source);
  }, [quizResponses, submit]);

  const close = useCallback(() => {
    setIsOpen(false);
    setErrorMessage('');
    setClickSource('');
    setCurrentProgram('');
    submitRef.current = null;
  }, []);

  const retry = useCallback(() => {
    if (submitRef.current) {
      submit(submitRef.current.program, submitRef.current.source);
    }
  }, [submit]);

  const contextValue = useMemo(
    () => ({
      open
    }),
    [open]
  );

  return (
    <RequestCallbackContext.Provider value={contextValue}>
      {children}
      <RequestCallbackModal
        isOpen={isOpen}
        onClose={close}
        onRetry={retry}
        submissionStatus={submissionStatus}
        errorMessage={errorMessage}
        programName={PROGRAM_NAME_MAPPING[currentProgram] || ''}
        programUrl={PROGRAM_URL_MAPPING[currentProgram] || ''}
      />
    </RequestCallbackContext.Provider>
  );
};

export const useRequestCallback = () => useContext(RequestCallbackContext);
