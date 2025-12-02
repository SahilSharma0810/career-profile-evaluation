import React from 'react';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import QuizPage from '../../components/QuizPage';
import ResultsPage from '../../components/ResultsPage';
import { getPathWithQueryParams, hasNudgeBeenShown } from '../../utils/url';

import AdminViewPage from '../../components/admin/AdminViewPage';

const AppRoutes = ({ quizMode, onQuizProgressChange }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={getPathWithQueryParams('/quiz')} replace />}
      />
      <Route
        path="/quiz"
        element={
          <QuizPage
            onProgressChange={onQuizProgressChange}
            quizMode={quizMode}
          />
        }
      />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/admin/view/response/:response_id" element={<AdminViewPage />} />
    </Routes>
  );
};

export default AppRoutes;
