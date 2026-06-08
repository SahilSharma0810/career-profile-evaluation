import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '@nanostores/react';
import {
  ArrowClockwise,
  CaretDown,
  SignOut,
  Chalkboard,
  Users,
  Code,
  Database,
  Medal,
  FileText,
  Sparkle,
  Cloud,
  Briefcase,
  Bank,
  GraduationCap,
  CalendarBlank,
  Monitor,
  Article,
  BookOpen,
  DeviceMobile,
  ChartBar,
  Info,
  List,
  X
} from 'phosphor-react';
import { ReactComponent as ScalerLogo } from '../assets/scaler-logo.svg';
import { useProfile } from '../context/ProfileContext';
import { useRequestCallback } from '../app/context/RequestCallbackContext';
import { $initialData } from '../store/initial-data';
import authService from '../api/authService';
import tracker from '../utils/tracker';
import sstIcon from '../assets/sst.svg';
import ssbIcon from '../assets/ssb.svg';
import interviewbitIcon from '../assets/interviewbit.svg';

// ─────────────────────────────────────────────────────────────────────────────
// Center navigation menu config (shown on the results page only).
// URLs pre-filled with `''` are TODO — drop in the final scaler.com destinations.
// Pre-filled values were sourced from live scaler.com; verify before shipping.
// AI LABS is intentionally omitted.
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_MENU = {
  label: 'Program',
  align: 'left',
  sections: [
    {
      title: 'Online Programs',
      items: [
        { label: 'Modern Software and AI Engineering Program', Icon: Code, href: 'https://www.scaler.com/academy/' },
        { label: 'Modern Data Science and ML with specialisation in AI', Icon: Database, href: 'https://www.scaler.com/data-science-course/' },
        { label: 'Advanced AIML with Specialisation in Agentic AI', Icon: Sparkle, href: 'https://www.scaler.com/ai-machine-learning-course/' },
        { label: 'DevOps, Cloud & AI Platform Engineering', Icon: Cloud, href: 'https://www.scaler.com/devops-course/' },
        { label: 'Online PGP in Business & AI', Icon: Briefcase, href: 'https://www.scaler.com/online-pgp-in-business-and-ai' },
        { label: 'AI Engineering Advanced Certification by IIT-Roorkee, CEC', Icon: Bank, href: 'https://www.scaler.com/iit-roorkee-advanced-ai-engineering-course/' },
        { label: 'Masters In Software Development', Icon: Medal, href: 'https://www.scaler.com/neovarsity/v2/' },
        { label: 'Masters In Data Science', Icon: FileText, href: 'https://www.scaler.com/neovarsity/v2/' }
      ]
    },
    {
      title: 'On Campus Programs',
      items: [
        { label: 'Scaler School Of Technology', iconSrc: sstIcon, Icon: GraduationCap, href: 'https://www.scaler.com/school-of-technology' },
        { label: 'Scaler School Of Business', iconSrc: ssbIcon, Icon: GraduationCap, href: 'https://www.scaler.com/school-of-business' }
      ]
    }
  ]
};

const RESOURCES_MENU = {
  label: 'Resources',
  align: 'right',
  sections: [
    {
      title: 'Free Learning Experience',
      items: [
        { label: 'Masterclass', Icon: CalendarBlank, href: 'https://www.scaler.com/events' },
        { label: 'Video course', Icon: Monitor, href: 'https://www.scaler.com/topics/courses' },
        { label: 'Blogs', Icon: Article, href: 'https://www.scaler.com/blog' },
        { label: 'Coding Tutorials', Icon: BookOpen, href: 'https://www.scaler.com/topics/hubs' }
      ]
    },
    {
      title: 'Other Resources',
      items: [
        { label: 'Mobile App', Icon: DeviceMobile, href: 'https://play.google.com/store/apps/details?id=com.scaler.app' },
        { label: 'Interviewbit', iconSrc: interviewbitIcon, Icon: ChartBar, href: 'https://www.interviewbit.com/' },
        { label: 'About us', Icon: Info, href: 'https://www.scaler.com/about/' }
      ]
    }
  ]
};

// Plain (no-dropdown) center links.
const MASTERCLASS_HREF = 'https://www.scaler.com/events';
const ALUMNI_HREF = 'https://www.scaler.com/review/'; // verify

const trackNavClick = (label) => {
  tracker.click({
    click_type: 'navbar_link_clicked',
    click_text: label,
    custom: { source: 'navbar', page: 'results_page' }
  });
};

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
  color: ${(props) => (props.light ? '#ffffff' : '#1e293b')};
  border: 1px solid ${(props) => (props.light ? 'rgba(255, 255, 255, 0.35)' : '#e2e8f0')};
  border-radius: 0;
  padding: 7px 12px;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;

  &:hover {
    background: ${(props) => (props.light ? 'rgba(255, 255, 255, 0.12)' : '#f8fafc')};
    border-color: ${(props) => (props.light ? 'rgba(255, 255, 255, 0.6)' : '#cbd5e1')};
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

const DashboardLinkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  color: #1e293b;
  border: none;
  padding: 10px 12px;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
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

// ── Center navigation (mega-menu) ───────────────────────────────────────────
const CenterNav = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
  justify-content: center;

  /* Mega-menus are desktop-only; hide on smaller viewports. */
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const navLinkStyles = `
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1a2b4a;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s ease;

  &:hover {
    color: #2f54eb;
  }
`;

const NavLinkAnchor = styled.a`
  ${navLinkStyles}
`;

const NavTrigger = styled.button`
  ${navLinkStyles}
  color: ${(props) => (props.open ? '#2f54eb' : '#1a2b4a')};

  svg {
    transition: transform 0.2s ease;
    transform: ${(props) => (props.open ? 'rotate(180deg)' : 'none')};
  }
`;

const MegaPanel = styled.div`
  /* Rendered via a portal with fixed coords so it isn't clipped by the
     navbar's overflow:hidden (StickyWrapper). Position set inline. */
  position: fixed;
  width: 760px;
  max-width: calc(100vw - 40px);
  background: #ffffff;
  border: 1px solid #eceff5;
  box-shadow: 0 12px 32px rgba(16, 24, 40, 0.12);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 900;

  /* Invisible bridge so the panel doesn't close when moving the cursor down. */
  &::before {
    content: '';
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    height: 18px;
  }
`;

const MegaSectionTitle = styled.div`
  font-family: var(--sans);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8a94a6;
  margin-bottom: 12px;
`;

const MegaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const MegaItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #eceff5;
  text-decoration: none;
  color: #1a2b4a;
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: #c7d2fe;
    background: #f8faff;
    box-shadow: 0 4px 12px rgba(16, 24, 40, 0.06);
  }

  svg {
    flex-shrink: 0;
    color: #52525b;
  }
`;

// Renders a menu item's icon: an image (item.iconSrc) if provided, else the
// phosphor fallback (item.Icon).
const NavItemIcon = ({ item, size }) =>
  item.iconSrc ? (
    <img
      src={item.iconSrc}
      alt=""
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0 }}
    />
  ) : (
    <item.Icon size={size} />
  );

const MegaMenu = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  const computePos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 18;
    if (menu.align === 'right') {
      setPos({ top, right: window.innerWidth - rect.right });
    } else {
      setPos({ top, left: rect.left });
    }
  }, [menu.align]);

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    computePos();
    setOpen(true);
  }, [computePos]);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Keep the fixed-position panel aligned to the trigger on scroll/resize.
  useEffect(() => {
    if (!open) return undefined;
    const handler = () => computePos();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [open, computePos]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <NavItem ref={triggerRef} onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <NavTrigger
        open={open}
        type="button"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        {menu.label}
        <CaretDown size={12} weight="bold" />
      </NavTrigger>
      {open &&
        pos &&
        createPortal(
          <MegaPanel
            align={menu.align}
            style={pos}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {menu.sections.map((section) => (
              <div key={section.title}>
                <MegaSectionTitle>{section.title}</MegaSectionTitle>
                <MegaGrid>
                  {section.items.map((item) => (
                    <MegaItem
                      key={item.label}
                      href={item.href || undefined}
                      target={item.href ? '_blank' : undefined}
                      rel={item.href ? 'noopener noreferrer' : undefined}
                      onClick={() => trackNavClick(item.label)}
                    >
                      <NavItemIcon item={item} size={20} />
                      <span>{item.label}</span>
                    </MegaItem>
                  ))}
                </MegaGrid>
              </div>
            ))}
          </MegaPanel>,
          document.body
        )}
    </NavItem>
  );
};

const CenterNavLinks = () => (
  <CenterNav>
    <MegaMenu menu={PROGRAM_MENU} />
    <NavLinkAnchor
      href={MASTERCLASS_HREF || undefined}
      target={MASTERCLASS_HREF ? '_blank' : undefined}
      rel={MASTERCLASS_HREF ? 'noopener noreferrer' : undefined}
      onClick={() => trackNavClick('Masterclass')}
    >
      Masterclass
    </NavLinkAnchor>
    <NavLinkAnchor
      href={ALUMNI_HREF || undefined}
      target={ALUMNI_HREF ? '_blank' : undefined}
      rel={ALUMNI_HREF ? 'noopener noreferrer' : undefined}
      onClick={() => trackNavClick('Alumni')}
    >
      Alumni
    </NavLinkAnchor>
    <MegaMenu menu={RESOURCES_MENU} />
  </CenterNav>
);

// ── Mobile navigation (hamburger + slide-out drawer) ────────────────────────
const HamburgerButton = styled.button`
  display: none;

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #1a2b4a;
    padding: 4px;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 40, 0.45);
  z-index: 1000;
  opacity: ${(props) => (props.open ? 1 : 0)};
  pointer-events: ${(props) => (props.open ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
`;

const MobileDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 320px;
  max-width: 85vw;
  background: #ffffff;
  z-index: 1001;
  box-shadow: -8px 0 24px rgba(16, 24, 40, 0.18);
  transform: translateX(${(props) => (props.open ? '0' : '100%')});
  transition: transform 0.28s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const MobileDrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eceff5;
`;

const MobileDrawerTitle = styled.span`
  font-family: var(--sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8a94a6;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #1a2b4a;
  padding: 4px;
`;

const MobileNavList = styled.div`
  padding: 8px 12px 24px;
  display: flex;
  flex-direction: column;
`;

const mobileRowStyles = `
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 12px;
  background: none;
  border: none;
  border-bottom: 1px solid #f1f3f8;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1a2b4a;
  text-decoration: none;
`;

const MobileGroupTrigger = styled.button`
  ${mobileRowStyles}

  svg {
    transition: transform 0.2s ease;
    transform: ${(props) => (props.open ? 'rotate(180deg)' : 'none')};
    color: #8a94a6;
  }
`;

const MobilePlainLink = styled.a`
  ${mobileRowStyles}
`;

const MobileGroupBody = styled.div`
  padding: 8px 4px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MobileSubItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  text-decoration: none;
  color: #1a2b4a;
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3;

  svg {
    flex-shrink: 0;
    color: #52525b;
  }

  &:hover {
    background: #f8faff;
  }
`;

const MobileMenuGroup = ({ menu, onNavigate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <MobileGroupTrigger
        open={expanded}
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {menu.label}
        <CaretDown size={14} weight="bold" />
      </MobileGroupTrigger>
      {expanded && (
        <MobileGroupBody>
          {menu.sections.map((section) => (
            <div key={section.title}>
              <MegaSectionTitle>{section.title}</MegaSectionTitle>
              {section.items.map((item) => (
                <MobileSubItem
                  key={item.label}
                  href={item.href || undefined}
                  target={item.href ? '_blank' : undefined}
                  rel={item.href ? 'noopener noreferrer' : undefined}
                  onClick={() => {
                    trackNavClick(item.label);
                    onNavigate?.();
                  }}
                >
                  <NavItemIcon item={item} size={18} />
                  <span>{item.label}</span>
                </MobileSubItem>
              ))}
            </div>
          ))}
        </MobileGroupBody>
      )}
    </div>
  );
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <HamburgerButton
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <List size={24} weight="bold" />
      </HamburgerButton>
      {createPortal(
        <>
          <MobileOverlay open={open} onClick={close} />
          <MobileDrawer open={open} role="dialog" aria-modal="true">
            <MobileDrawerHeader>
              <MobileDrawerTitle>Menu</MobileDrawerTitle>
              <CloseButton type="button" aria-label="Close menu" onClick={close}>
                <X size={22} weight="bold" />
              </CloseButton>
            </MobileDrawerHeader>
            <MobileNavList>
              <MobileMenuGroup menu={PROGRAM_MENU} onNavigate={close} />
              <MobilePlainLink
                href={MASTERCLASS_HREF || undefined}
                target={MASTERCLASS_HREF ? '_blank' : undefined}
                rel={MASTERCLASS_HREF ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  trackNavClick('Masterclass');
                  close();
                }}
              >
                Masterclass
              </MobilePlainLink>
              <MobilePlainLink
                href={ALUMNI_HREF || undefined}
                target={ALUMNI_HREF ? '_blank' : undefined}
                rel={ALUMNI_HREF ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  trackNavClick('Alumni');
                  close();
                }}
              >
                Alumni
              </MobilePlainLink>
              <MobileMenuGroup menu={RESOURCES_MENU} onNavigate={close} />
            </MobileNavList>
          </MobileDrawer>
        </>,
        document.body
      )}
    </>
  );
};

export const UserDropdown = ({ light = false } = {}) => {
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

    window.location.href = 'https://scaler.com';
  }, []);

  const handleInstructorDashboard = useCallback(() => {
    tracker.click({
      click_type: 'instructor_dashboard',
      click_source: 'navbar'
    });
    window.location.href = 'https://www.scaler.com/academy/instructor-dashboard/';
  }, []);

  const handleMentorDashboard = useCallback(() => {
    tracker.click({
      click_type: 'mentor_dashboard',
      click_source: 'navbar'
    });
    window.location.href = 'https://www.scaler.com/academy/mentor-dashboard/';
  }, []);

  const userData = data?.userData;

  if (!data?.isLoggedIn || !userData) return null;

  const displayName = userData.name || userData.full_name || userData.email || 'Account';

  return (
    <UserMenu>
      <UserMenuTrigger ref={triggerRef} onClick={handleToggle} light={light}>
        <UserName>{displayName}</UserName>
        <CaretDown size={14} weight="bold" />
      </UserMenuTrigger>
      {open && menuPos &&
        createPortal(
          <DropdownMenu
            ref={menuRef}
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            {userData.is_instructor === true && (
              <DashboardLinkButton onClick={handleInstructorDashboard}>
                <Chalkboard size={16} weight="bold" />
                Instructor
              </DashboardLinkButton>
            )}
            {userData.is_mentor === true && (
              <DashboardLinkButton onClick={handleMentorDashboard}>
                <Users size={16} weight="bold" />
                Mentor
              </DashboardLinkButton>
            )}
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
  const isMBAResultsPage = [
    '/business-and-ai-readiness/mba-results',
    '/business-and-ai-readiness/mba-results/'
  ].includes(location.pathname);
  // Show the scaler center nav (mega-menus + CTA + profile) on both results pages.
  const showCenterNav = isResultsPage || isMBAResultsPage;

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
      <NavContainer showCSATBanner={!isResultsPage || showCSATBanner}>
        <NavContent>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo>
              <LogoGraphic aria-label="Scaler" />
            </Logo>
          </Link>
          {showCenterNav && <CenterNavLinks />}
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
            {!isMBAResultsPage && (
              <CTAButton onClick={handleRCBClick}>BOOK FREE 1:1 CAREER CALL</CTAButton>
            )}
            <UserDropdown />
            {showCenterNav && <MobileNav />}
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
