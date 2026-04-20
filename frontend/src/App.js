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
import MicrosoftClarity from './components/analytics/MicrosoftClarity';
import tracker from './utils/tracker';
import { getPathWithQueryParams } from './utils/url';

import '@vectord/ui/dist/style.css';
import '@vectord/fp-styles';

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthSplitPage initialMode="login" />} />
      <Route path="/signup" element={<AuthSplitPage initialMode="signup" />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// MBA App Content - separate from main app with isolated context
function MBAAppContent() {
  const [quizProgress, setQuizProgress] = useState(0);
  const { data, loading } = useStore($initialData);
  const location = useLocation();
  useGTMSectionTracking();
  
  // Hide nav for MBA quiz page
  const shouldShowNav = !location.pathname.includes('/business-and-ai-readiness/quiz') && 
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
  if (!data?.isLoggedIn) return <AuthRoutes />;

  return (
    <MBAProfileProvider>
      <AppLayout showNavigation={shouldShowNav} navigationProps={navigationProps}>
        <Routes>
          <Route
            path="/business-and-ai-readiness"
            element={<Navigate to={getPathWithQueryParams('/business-and-ai-readiness/quiz')} replace />}
          />
          <Route
            path="/business-and-ai-readiness/quiz"
            element={<MBAQuiz onProgressChange={setQuizProgress} />}
          />
          <Route path="/business-and-ai-readiness/mba-results" element={<MBAResultsPage />} />
          <Route 
            path="/business-and-ai-readiness/admin/view/response/:response_id" 
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
  const isMBARoute = location.pathname.startsWith('/business-and-ai-readiness');
  
  const shouldShowNav = !(
    quizMode === 'final' && location.pathname === '/quiz'
  ) && !location.pathname.startsWith('/admin') && !isMBARoute;

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const pageUrl = new URL(window.location.href);
    tracker.superAttributes = {
      attributes: {
        page_path: pageUrl.pathname,
        page_url: pageUrl.href,
        query_params: Object.fromEntries(pageUrl.searchParams.entries())
      }
    };
    if (!loading) {
      tracker.pageview({
        page_url: pageUrl
      });
    }
  }, [location.pathname, loading]);

  const navigationProps = useMemo(
    () => ({
      progress: quizProgress,
      quizMode,
      onQuizModeChange: setQuizMode
    }),
    [quizProgress, quizMode]
  );

  useEffect(() => {
    if (window.clarity) {
      if (isMBARoute) {
        window.clarity('set', 'experiment', 'online_mba_cpe');
      } else if (!isAdminRoute) {
        window.clarity('set', 'experiment', 'career_profile_tool');
      }
    }
  }, []);

  if (loading) return <LoadingScreen />;
  if (!data?.isLoggedIn) return (
    <div className={isMBARoute ? 'mba-cpe-theme' : 'cpe-theme'}>
      <AuthRoutes />
    </div>
  );

  // Route to MBA app for /business-and-ai-readiness/* paths
  if (isMBARoute) {
    return (
      <div className="mba-cpe-theme">
        <MBAAppContent />
      </div>
    );
  }

  return (
    <div className="cpe-theme">
      <AppLayout showNavigation={shouldShowNav} navigationProps={navigationProps}>
        <AppRoutes onQuizProgressChange={setQuizProgress} {...{ quizMode }} />
      </AppLayout>
    </div>
  );
}

function App() {
  return (
    <>
      <MicrosoftClarity />
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
    </>
  );
}

export default App;
