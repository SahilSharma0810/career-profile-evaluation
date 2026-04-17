import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as ScalerLogo } from '../../assets/scaler-logo.svg';
import { AuthFlow } from './index';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--white);
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

/* ── Left Panel (Navy) ─────────────────────────────────────── */

const LeftPanel = styled.div`
  width: 400px;
  flex-shrink: 0;
  background: var(--navy);
  color: var(--white);
  padding: 32px 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LeftTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--white);

  svg {
    height: 22px;
    width: auto;
    filter: brightness(0) invert(1);
  }
`;

const LogoDivider = styled.span`
  color: rgba(255, 255, 255, 0.3);
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FreeLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4);
`;

const LeftTitle = styled.h1`
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--white);
  line-height: 1.2;
  margin: 0;
`;

const LeftDesc = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin: 0;
`;

const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const StatCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px;
`;

const StatValue = styled.div`
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--white);
`;

const StatLabel = styled.div`
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.4;
  margin-top: 2px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.65);
`;

const FeatureCheck = styled.span`
  color: #34d399;
  font-size: 0.875rem;
`;

const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlumniLabel = styled.div`
  font-family: var(--mono);
  font-size: 0.5625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const CompanyPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const CompanyPill = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 9px;
`;

/* ── Right Panel ───────────────────────────────────────────── */

const RightPanel = styled.div`
  flex: 1;
  background: var(--white);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
    min-height: calc(100vh - 72px);
    padding-bottom: 90px;
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 520px;
  animation: ${fadeIn} 0.4s ease;
`;

/* ── Mobile Welcome ────────────────────────────────────────── */

const MobileWelcomeScreen = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background: var(--navy);
    color: var(--white);
  }
`;

const MobileWelcomeInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 24px 120px;
  gap: 20px;
`;

const MobileWelcomeTitle = styled.h1`
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 500;
  color: var(--white);
  margin: 0;
  line-height: 1.2;
`;

const MobileWelcomeDesc = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin: 0;
`;

const MobileButtonsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
`;

const StickyMobileCTA = styled.button`
  background: var(--accent);
  color: white;
  border: none;
  padding: 16px 32px;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;

  &:hover {
    background: #1d4ed8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
`;

const ModalCard = styled.div`
  background: var(--white);
  width: 100%;
  max-width: 560px;
  border: 1px solid var(--line);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  padding: 0;

  @media (max-width: 768px) {
    min-height: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
`;

const ModalTitle = styled.div`
  font-family: var(--sans);
  font-weight: 700;
  color: var(--ink);
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg);
    border-color: var(--line2);
  }
`;

const ModalBody = styled.div`
  padding: 16px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const COMPANIES = ['Google', 'Amazon', 'Flipkart', 'Razorpay', 'Swiggy', 'PhonePe', 'CRED', 'Uber'];

const AuthSplitPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  if (isMobile) {
    return (
      <>
        <MobileWelcomeScreen>
          <MobileWelcomeInner>
            <LogoRow>
              <ScalerLogo aria-label="Scaler" />
              <LogoDivider>/</LogoDivider>
              <span>CPE</span>
            </LogoRow>
            <div style={{ marginTop: '16px' }}>
              <FreeLabel>Free · Takes 3 minutes</FreeLabel>
              <MobileWelcomeTitle style={{ marginTop: '8px' }}>
                Free Profile Evaluation
              </MobileWelcomeTitle>
              <MobileWelcomeDesc style={{ marginTop: '12px' }}>
                Get a comprehensive AI-powered evaluation of your tech career profile. Discover strengths, gaps, and a personalized roadmap.
              </MobileWelcomeDesc>
            </div>
          </MobileWelcomeInner>
          <MobileButtonsContainer>
            <StickyMobileCTA onClick={openAuth}>Continue →</StickyMobileCTA>
          </MobileButtonsContainer>
        </MobileWelcomeScreen>

        {showAuthModal && (
          <ModalOverlay>
            <ModalCard role="dialog" aria-modal="true">
              <ModalHeader>
                <ModalTitle>Continue to sign in</ModalTitle>
                <CloseButton aria-label="Close" onClick={closeAuth}>✕</CloseButton>
              </ModalHeader>
              <ModalBody>
                <AuthFlow
                  initialMode="login"
                  reloadOnSuccess={true}
                  showProfessionalFields={true}
                />
              </ModalBody>
            </ModalCard>
          </ModalOverlay>
        )}
      </>
    );
  }

  return (
    <PageContainer>
      <LeftPanel>
        <LeftTop>
          <LogoRow>
            <ScalerLogo aria-label="Scaler" />
            <LogoDivider>/</LogoDivider>
            <span>CPE</span>
          </LogoRow>

          <LeftContent>
            <FreeLabel>Free · Takes 3 minutes</FreeLabel>
            <LeftTitle>Your AI Career Report</LeftTitle>
            <LeftDesc>
              Get a comprehensive evaluation of your profile for tech roles. Discover strengths, identify gaps, and get a personalized roadmap.
            </LeftDesc>

            {/* <StatsColumn>
              <StatCard>
                <StatValue>50K+</StatValue>
                <StatLabel>profiles evaluated in the last 12 months</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>2.5×</StatValue>
                <StatLabel>average salary jump for Scaler alumni</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>73%</StatValue>
                <StatLabel>of backend roles now require AI fluency</StatLabel>
              </StatCard>
            </StatsColumn> */}

            <FeatureList>
              <Feature>
                <FeatureCheck>✓</FeatureCheck>
                Profile Strength Analysis
              </Feature>
              <Feature>
                <FeatureCheck>✓</FeatureCheck>
                Skill Gap Assessment
              </Feature>
              <Feature>
                <FeatureCheck>✓</FeatureCheck>
                Career Readiness Timeline
              </Feature>
              <Feature>
                <FeatureCheck>✓</FeatureCheck>
                Peer Comparison
              </Feature>
            </FeatureList>
          </LeftContent>
        </LeftTop>

        <LeftBottom>
          <AlumniLabel>Alumni working at</AlumniLabel>
          <CompanyPills>
            {COMPANIES.map((name, i) => (
              <CompanyPill key={i}>{name}</CompanyPill>
            ))}
          </CompanyPills>
        </LeftBottom>
      </LeftPanel>

      <RightPanel>
        <AuthCard>
          <AuthFlow
            initialMode="login"
            reloadOnSuccess={true}
          />
        </AuthCard>
      </RightPanel>
    </PageContainer>
  );
};

export default AuthSplitPage;
