import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '@nanostores/react';
import { ArrowClockwise, CaretDown, SignOut } from 'phosphor-react';
import { ReactComponent as ScalerLogo } from '../assets/scaler-logo.svg';
import { useProfile } from '../context/ProfileContext';
import { useRequestCallback } from '../app/context/RequestCallbackContext';
import { $initialData } from '../store/initial-data';
import authService from '../api/authService';
import tracker from '../utils/tracker';

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease;
  /* Match CSAT banner height: 41.5px */
  transform: translateY(${(props) => (props.showCSATBanner ? '0' : '-41.5px')});

  @media (max-width: 768px) {
    /* Mobile CSAT: 8px + 8px padding + column layout (~2 lines) = ~60px */
    transform: translateY(${(props) => (props.showCSATBanner ? '0' : '-60px')});
  }

  @media print {
    display: none;
    transform: none;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  gap: 24px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    padding: 0 12px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoGraphic = styled(ScalerLogo)`
  height: 28px;
  width: auto;
  display: block;

  @media (max-width: 768px) {
    height: 24px;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserMenuTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 7px 12px;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const UserName = styled.span`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    max-width: 96px;
  }
`;

const DropdownMenu = styled.div`
  position: fixed;
  min-width: 180px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 1000;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  color: #b30158;
  border: none;
  padding: 10px 12px;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #fdf2f7;
  }
`;

const CTAButton = styled.button`
  background: #0052ff;
  color: white;
  border: 1px solid #0052ff;
  padding: 9px 16px;
  border-radius: 0;
  font-weight: 700;
  font-size: 0.75rem;
  font-family: var(--mono);
  cursor: pointer;
  transition: all 0.15s ease;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1;
  white-space: nowrap;

  &:hover {
    background: #0047de;
    border-color: #0047de;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const TextReEvaluateButton = styled.button`
  background: transparent;
  color: #b30158;
  border: none;
  padding: 8px 12px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const DesktopDashboardButton = styled.button`
  background: transparent;
  color: #b30158;
  border: 2px solid #b30158;
  padding: 8px 18px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #b30158;
    color: white;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const OutlineCTAButton = styled.button`
  background: transparent;
  color: #b30158;
  border: none;
  padding: 8px 12px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: none;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const IconButton = styled.button`
  background: transparent;
  color: #b30158;
  border: 2px solid #b30158;
  padding: 8px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: none;

  &:hover {
    background: #b30158;
    color: white;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TextCTAButton = styled.button`
  background: transparent;
  color: #64748b;
  border: none;
  padding: 8px 16px;
  border-radius: 0;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    color: #1e293b;
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
`;

const SegmentedControl = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 3px;
  gap: 2px;
`;

const SegmentButton = styled.button`
  background: ${(props) => (props.active ? '#FFFFFF' : 'transparent')};
  color: ${(props) => (props.active ? '#1e293b' : '#64748b')};
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: ${(props) =>
    props.active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    background: ${(props) => (props.active ? '#FFFFFF' : '#e2e8f0')};
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e2e8f0;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: #0041ca;
  transition: width 0.3s ease;
  width: ${(props) => props.width}%;
`;

const StickyWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 800;
  overflow: hidden;

  @media print {
    position: relative;
    overflow: visible;
  }
`;

const CSATBanner = styled.button`
  background: #472472;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: none;
  width: 100%;
  transition: opacity 0.2s linear, visibility 0.2s linear;
  will-change: opacity;
  opacity: ${(props) => (props.isVisible ? '1' : '0')};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  pointer-events: ${(props) => (props.isVisible ? 'auto' : 'none')};

  &:hover {
    background: #5a2e8a;
  }

  &:active {
    background: #3a1d5e;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

  @media print {
    display: none;
  }
`;

const CSATContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
  pointer-events: none;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

const CSATText = styled.span`
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: 500;
  font-family: var(--sans);

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const CSATLink = styled.span`
  font-size: 0.875rem;
  color: #ffffff;
  font-weight: 600;
  text-decoration: underline;
  font-family: var(--sans);

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const UserDropdown = () => {
  const { data } = useStore($initialData);
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      const insideTrigger =
        triggerRef.current && triggerRef.current.contains(event.target);
      const insideMenu = menuRef.current && menuRef.current.contains(event.target);
      if (!insideTrigger && !insideMenu) {
        setOpen(false);
      }
    };

    const handleReposition = () => updateMenuPos();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, updateMenuPos]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) updateMenuPos();
      return next;
    });
  }, [updateMenuPos]);

  const handleLogout = useCallback(async () => {
    tracker.click({
      click_type: 'logout',
      click_source: 'navbar'
    });

    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }

    window.location.reload();
  }, []);

  const userData = data?.userData;

  if (!data?.isLoggedIn || !userData) return null;

  const displayName = userData.name || userData.full_name || userData.email || 'Account';

  return (
    <UserMenu>
      <UserMenuTrigger ref={triggerRef} onClick={handleToggle}>
        <UserName>{displayName}</UserName>
        <CaretDown size={14} weight="bold" />
      </UserMenuTrigger>
      {open && menuPos &&
        createPortal(
          <DropdownMenu
            ref={menuRef}
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <LogoutButton onClick={handleLogout}>
              <SignOut size={16} weight="bold" />
              Logout
            </LogoutButton>
          </DropdownMenu>,
          document.body
        )}
    </UserMenu>
  );
};

const NavigationBar = ({
  progress = 0,
  quizMode = 'grouped',
  onQuizModeChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetProfile, evaluationResults } = useProfile();
  const { open: openCallbackModal } = useRequestCallback();

  const showProgress =
    location.pathname === '/quiz' || location.pathname === '/goals';
  const showModeToggle = location.pathname === '/quiz';
  const isResultsPage = ['/results/', '/results'].includes(location.pathname);

  const [showCSATBanner, setShowCSATBanner] = useState(true);
  const lastScrollYRef = useRef(0);
  const lastVisibilityRef = useRef(true);

  const handleRCBClick = useCallback(() => {
    tracker.click({
      click_type: 'rcb_btn_clicked',
      custom: {
        source: 'navbar'
      }
    });
    tracker.ctaClick({
      click_type: 'rcb_btn_clicked',
      custom: {
        source: 'navbar'
      }
    });
    openCallbackModal?.({ source: 'navbar' });
  }, [openCallbackModal]);

  const handleFeedbackClick = useCallback(() => {
    tracker.click({
      click_type: 'feedback_btn_clicked',
      custom: {
        source: 'csat_banner',
        page: 'results_page'
      }
    });
  }, []);

  // Scroll direction detection for CSAT banner
  useEffect(() => {
    if (!isResultsPage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      let newVisibility;

      if (currentScrollY < 10) {
        newVisibility = true;
      } else if (currentScrollY < lastScrollYRef.current) {
        // Scrolling up - show banner
        newVisibility = true;
      } else if (currentScrollY > lastScrollYRef.current) {
        // Scrolling down - hide banner
        newVisibility = false;
      } else {
        // No change in direction, keep current visibility
        newVisibility = lastVisibilityRef.current;
      }

      // Only update state if visibility actually changed
      if (newVisibility !== lastVisibilityRef.current) {
        setShowCSATBanner(newVisibility);
        lastVisibilityRef.current = newVisibility;
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isResultsPage]);

  // const handleReEvaluate = useCallback(() => {
  //   tracker.click({
  //     click_type: 're_evaluate_btn_clicked',
  //     custom: {
  //       source: 'navbar'
  //     }
  //   });
  //   resetProfile?.();
  //   navigate?.('/quiz');
  // }, [resetProfile, navigate]);

  return (
    <StickyWrapper>
      {isResultsPage && (
        <CSATBanner
          isVisible={showCSATBanner}
          onClick={handleFeedbackClick}
          data-tally-open="m6XrjY"
          data-tally-layout="modal"
          data-tally-width="600"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
        >
          <CSATContent>
            <CSATText>How was your profile evaluation experience?</CSATText>
            <CSATLink>Share your feedback</CSATLink>
          </CSATContent>
        </CSATBanner>
      )}
      <NavContainer showCSATBanner={isResultsPage && showCSATBanner}>
        <NavContent>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo>
              <LogoGraphic aria-label="Scaler" />
            </Logo>
          </Link>
          {showModeToggle && (
            <SegmentedControl>
              <SegmentButton
                active={quizMode === 'single'}
                onClick={() => onQuizModeChange?.('single')}
              >
                Single Question
              </SegmentButton>
              <SegmentButton
                active={quizMode === 'grouped'}
                onClick={() => onQuizModeChange?.('grouped')}
              >
                Grouped Questions
              </SegmentButton>
              <SegmentButton
                active={quizMode === 'split'}
                onClick={() => onQuizModeChange?.('split')}
              >
                Split View
              </SegmentButton>
              <SegmentButton
                active={quizMode === 'split-view2'}
                onClick={() => onQuizModeChange?.('split-view2')}
              >
                Split View 2
              </SegmentButton>
              <SegmentButton
                active={quizMode === 'final'}
                onClick={() => onQuizModeChange?.('final')}
              >
                Final Mode
              </SegmentButton>
            </SegmentedControl>
          )}
          <NavActions>
            {/* {isResultsPage && evaluationResults && (
              <>
                <TextReEvaluateButton onClick={handleReEvaluate}>
                  Re-evaluate
                </TextReEvaluateButton>
                <IconButton onClick={handleReEvaluate} title="Re-evaluate">
                  <ArrowClockwise size={20} weight="bold" />
                </IconButton>
              </>
            )} */}
            <CTAButton onClick={handleRCBClick}>BOOK FREE 1:1 CAREER CALL</CTAButton>
            <UserDropdown />
          </NavActions>
        </NavContent>
        {showProgress && (
          <ProgressBarContainer>
            <ProgressBarFill width={progress} />
          </ProgressBarContainer>
        )}
      </NavContainer>
    </StickyWrapper>
  );
};

export default NavigationBar;
