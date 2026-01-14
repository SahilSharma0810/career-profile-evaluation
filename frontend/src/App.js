import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@nanostores/react';

import { ProfileProvider } from './context/ProfileContext';
import { MBAProfileProvider } from './context/MBAProfileContext';
import { $initialData } from './store/initial-data';
import InitialDataBootstrapper from './app/bootstrap/InitialDataBootstrapper';
import AppLayout from './app/layouts/AppLayout';
import AppRoutes from './app/routing/AppRoutes';
import LoadingScreen from './app/screens/LoadingScreen';
import { RequestCallbackProvider } from './app/context/RequestCallbackContext';
import useGTMSectionTracking from './hooks/useGTMSectionTracking';
import AuthSplitPage from './components/auth/AuthSplitPage';
import MBAQuiz from './components/quiz/MBAQuiz';
import MBAResultsPage from './components/MBAResultsPage';
import MBAAdminViewPage from './components/admin/MBAAdminViewPage';
import { getPathWithQueryParams } from './utils/url';

import '@vectord/ui/dist/style.css';
import '@vectord/fp-styles';

// MBA App Content - separate from main app with isolated context
function MBAAppContent() {
  const [quizProgress, setQuizProgress] = useState(0);
  const { data, loading } = useStore($initialData);
  const location = useLocation();
  useGTMSectionTracking();
  
  // Hide nav for MBA quiz page
  const shouldShowNav = !location.pathname.includes('/online-mba-cpe/quiz') && 
                        !location.pathname.startsWith('/admin');

  const navigationProps = useMemo(
    () => ({
      progress: quizProgress,
      quizMode: 'mba',
      onQuizModeChange: () => {}
    }),
    [quizProgress]
  );

  if (loading) return <LoadingScreen />;
  if (!data?.isLoggedIn) return <AuthSplitPage />;

  return (
    <MBAProfileProvider>
      <AppLayout showNavigation={shouldShowNav} navigationProps={navigationProps}>
        <Routes>
          <Route
            path="/online-mba-cpe"
            element={<Navigate to={getPathWithQueryParams('/online-mba-cpe/quiz')} replace />}
          />
          <Route
            path="/online-mba-cpe/quiz"
            element={<MBAQuiz onProgressChange={setQuizProgress} />}
          />
          <Route path="/online-mba-cpe/mba-results" element={<MBAResultsPage />} />
          <Route 
            path="/online-mba-cpe/admin/view/response/:response_id" 
            element={<MBAAdminViewPage />} 
          />
        </Routes>
      </AppLayout>
    </MBAProfileProvider>
  );
}

function AppContent() {
  const [quizProgress, setQuizProgress] = useState(0);
  const [quizMode, setQuizMode] = useState('final');
  const { data, loading } = useStore($initialData);
  const location = useLocation();
  useGTMSectionTracking();
  
  // Check if we're on an MBA route
  const isMBARoute = location.pathname.startsWith('/online-mba-cpe');
  
  const shouldShowNav = !(
    quizMode === 'final' && location.pathname === '/quiz'
  ) && !location.pathname.startsWith('/admin') && !isMBARoute;

  const navigationProps = useMemo(
    () => ({
      progress: quizProgress,
      quizMode,
      onQuizModeChange: setQuizMode
    }),
    [quizProgress, quizMode]
  );

  if (loading) return <LoadingScreen />;
  if (!data?.isLoggedIn) return <AuthSplitPage />;
  
  // Route to MBA app for /online-mba-cpe/* paths
  if (isMBARoute) {
    return <MBAAppContent />;
  }

  return (
    <AppLayout showNavigation={shouldShowNav} navigationProps={navigationProps}>
      <AppRoutes onQuizProgressChange={setQuizProgress} {...{ quizMode }} />
    </AppLayout>
  );
}

function App() {
  return (
    <ProfileProvider>
      <Router basename="/career-profile-tool">
        <RequestCallbackProvider>
          <InitialDataBootstrapper
            product="career_profile_tool"
            subProduct="free_evaluation"
          />
          <AppContent />
        </RequestCallbackProvider>
      </Router>
    </ProfileProvider>
  );
}

export default App;
