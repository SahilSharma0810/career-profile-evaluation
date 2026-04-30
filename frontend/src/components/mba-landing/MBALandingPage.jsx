import React, { useEffect } from 'react';
import LeadCard from './LeadCard';
import logoColour from '../../assets/mba-landing/logo-colour.svg';
import logoWhite from '../../assets/mba-landing/logo-white.svg';
import starOutline from '../../assets/mba-landing/gradients/star-16-outline.svg';
import pmScenario from '../../assets/mba-landing/scenarios/pm-retention.png';
import salesScenario from '../../assets/mba-landing/scenarios/sales-pipeline.png';
import marketingScenario from '../../assets/mba-landing/scenarios/marketing-cac.png';
import './styles/landing-tokens.css';
import './styles/landing.css';
import tracker from '../../utils/tracker';

const Pointer = ({ children }) => (
  <li className="hero__pointer">
    <svg className="hero__pointer-tick" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
    <span>{children}</span>
  </li>
);

const HERO_LOGOS = [
  { name: 'Razorpay', src: 'https://cdn.brandfetch.io/razorpay.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'Swiggy', src: 'https://cdn.brandfetch.io/swiggy.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'CRED', src: 'https://cdn.brandfetch.io/cred.club/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'PhonePe', src: 'https://cdn.brandfetch.io/phonepe.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'Zomato', src: 'https://cdn.brandfetch.io/zomato.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'Paytm', src: 'https://cdn.brandfetch.io/paytm.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'Zoho', src: 'https://cdn.brandfetch.io/zoho.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' },
  { name: 'Unacademy', src: 'https://cdn.brandfetch.io/unacademy.com/w/200/h/80?c=1id_0gjOfcNF2y1j5n9' }
];

const MBALandingPage = () => {
  useEffect(() => {
    tracker.pageview({ page_url: new URL(window.location.href) });

    const onScroll = () => {
      const nav = document.getElementById('mba-lp-nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const revealEls = document.querySelectorAll('.mba-landing .reveal');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
      );
      revealEls.forEach((el) => obs.observe(el));
      return () => {
        window.removeEventListener('scroll', onScroll);
        obs.disconnect();
      };
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="mba-landing">
      <nav className="nav" id="mba-lp-nav" role="navigation" aria-label="Main navigation">
        <div className="nav__inner">
          <a href="/" className="nav__logo" aria-label="Scaler home">
            <img src={logoColour} alt="Scaler" width="88" height="18" />
          </a>
          <div className="nav__cta">
            <a
              href="/career-profile-tool/login?redirect=%2Fbusiness-and-ai-readiness%2F"
              className="btn btn--ghost btn--sm nav__login"
            >
              Login
            </a>
            <a href="#hero-form" className="btn btn--primary btn--sm">Take the assessment</a>
          </div>
        </div>
      </nav>

      <section className="hero" id="hero" aria-label="Hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__bg-gradient" />
        </div>

        <div className="hero__inner container">
          <div className="hero__text">
            <p className="hero__eyebrow">Free &middot; 3 minutes &middot; Instant report</p>
            <h1 className="hero__h1">Get your AI<br />career Report.</h1>

            <p className="hero__sub">
              Evaluate your profile for tech roles. Discover strengths, identify gaps, and get a personalized roadmap.
            </p>

            <ul className="hero__pointers" aria-label="What's in your report">
              <Pointer>Profile Strength Analysis</Pointer>
              <Pointer>Skill Gap Assessment</Pointer>
              <Pointer>Career Readiness Timeline</Pointer>
              <Pointer>Peer Comparison</Pointer>
            </ul>

            <div className="hero__trust">
              <div className="hero__trust-divider" aria-hidden="true" />
              <p className="hero__trust-label">USED BY PROFESSIONALS AT</p>
              <div className="hero__logos" aria-label="Companies whose professionals use this assessment">
                {HERO_LOGOS.map(logo => (
                  <span key={logo.name} className="hero__logo-item" title={logo.name}>
                    <img src={logo.src} alt={logo.name} loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero__form-wrap" id="hero-form">
            <LeadCard formId="hero" />
          </div>
        </div>
      </section>

      <section className="report-fold" id="report-fold" aria-label="What your report shows">
        <div className="container">
          <div className="report-fold__inner">
            <div className="report-fold__visual reveal">
              <div className="report-mock">
                <div className="report-mock__header">
                  <div>
                    <p className="report-mock__label">AI READINESS REPORT</p>
                    <p className="report-mock__name">Product Manager &middot; April 2026</p>
                  </div>
                  <span className="report-mock__badge">Product Manager</span>
                </div>

                <div className="report-mock__score-row">
                  <div className="report-score-dial">
                    <svg viewBox="0 0 88 88" width="88" height="88" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="44" cy="44" r="36" stroke="#F5F5F5" strokeWidth="7" />
                      <circle cx="44" cy="44" r="36" stroke="url(#reportDial)" strokeWidth="7" strokeDasharray="226" strokeDashoffset="81" transform="rotate(-90 44 44)" />
                      <text x="44" y="48" textAnchor="middle" fontFamily="'Plus Jakarta Sans',sans-serif" fontSize="18" fontWeight="800" fill="#0055FF">64</text>
                      <defs>
                        <linearGradient id="reportDial" x1="0" y1="0" x2="88" y2="88" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#0055FF" />
                          <stop offset="100%" stopColor="#C4FF00" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="report-score-meta">
                    <p className="report-score-meta__score">64 / 100</p>
                    <p className="report-score-meta__bench">Mid-senior &middot; vs. 4,200 professionals</p>
                    <p className="report-score-meta__gap">Strongest: Product Strategy &middot; Gap: AI Leverage</p>
                  </div>
                </div>

                <div className="report-mock__skills">
                  <p className="report-mock__skills-label">SKILL GAP MAP &mdash; 7 DIMENSIONS</p>
                  {[
                    { label: 'Product Strategy', val: 78 },
                    { label: 'Data-Driven PM', val: 61 },
                    { label: 'User Centricity', val: 72 }
                  ].map(s => (
                    <div className="skill-bar-row" key={s.label}>
                      <span className="skill-bar-label">{s.label}</span>
                      <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.val}%` }} /></div>
                      <span className="skill-bar-val">{s.val}</span>
                    </div>
                  ))}
                </div>

                <div className="report-mock__blur">
                  <div className="report-mock__skills-hidden" aria-hidden="true">
                    {[
                      { label: 'AI Literacy', val: 44 },
                      { label: 'Leadership', val: 68 },
                      { label: 'Strategic Thinking', val: 55 },
                      { label: 'Capital Allocation', val: 39 }
                    ].map(s => (
                      <div className="skill-bar-row" key={s.label}>
                        <span className="skill-bar-label">{s.label}</span>
                        <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.val}%` }} /></div>
                        <span className="skill-bar-val">{s.val}</span>
                      </div>
                    ))}
                    <div style={{ height: 56 }} />
                  </div>
                  <div className="report-mock__blur-overlay">
                    <p className="report-mock__blur-text">Start to reveal your full report</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-fold__content reveal reveal-delay-1">
              <p className="section-eyebrow">What you get</p>
              <h2 className="section-heading">Your report shows you exactly where you stand.</h2>
              <ul className="report-fold__list" aria-label="Report contents">
                <li className="report-fold__item">
                  <span className="report-fold__item-num">01</span>
                  <div>
                    <strong>AI Readiness score (0&ndash;100)</strong>
                    <p>Role-specific. Benchmarked against 4,200 professionals in your domain.</p>
                  </div>
                </li>
                <li className="report-fold__item">
                  <span className="report-fold__item-num">02</span>
                  <div>
                    <strong>7-skill matrix</strong>
                    <p>Product Strategy, Data thinking, AI literacy, Strategic thinking, Capital allocation, Leadership, User centricity.</p>
                  </div>
                </li>
                <li className="report-fold__item">
                  <span className="report-fold__item-num">03</span>
                  <div>
                    <strong>3 career paths with milestones</strong>
                    <p>Your next 12-month move, built from your score &mdash; not generic templates.</p>
                  </div>
                </li>
                <li className="report-fold__item">
                  <span className="report-fold__item-num">04</span>
                  <div>
                    <strong>4 personalized quick wins</strong>
                    <p>Actions you can take this week, specific to your gaps.</p>
                  </div>
                </li>
                <li className="report-fold__item">
                  <span className="report-fold__item-num">05</span>
                  <div>
                    <strong>9 AI tools to learn</strong>
                    <p>Prioritized by what moves the needle for your role and seniority level.</p>
                  </div>
                </li>
              </ul>
              <a href="#hero-form" className="btn btn--outline report-fold__cta">Get my report &rarr;</a>
            </div>
          </div>
        </div>
      </section>

      <section className="scenarios" id="scenarios" aria-label="Sample assessment scenarios">
        <div className="container">
          <div className="scenarios__head reveal">
            <p className="section-eyebrow">The assessment</p>
            <h2 className="section-heading">Six real situations from your job.</h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>Each one shows us how you actually think — and where AI fits in your role.</p>
          </div>

          <div className="scenarios__stack reveal reveal-delay-1" role="list">
            <ScenarioCard
              variant=""
              chipVariant=""
              media={pmScenario}
              mediaClass="sx-card__media--pm"
              alt="Product manager analyzing dropping user retention curve"
              eyebrow="SCENARIO 01"
              headline={<>Most users<br /><em>leave in</em><br />30 days.</>}
              chip="Product Manager"
              title={<>Lots of sign-ups. <em>Almost no one stays.</em></>}
              question="Your app gets plenty of new users every week, but most of them stop using it within a month. Your team is split on why. What do you do first?"
              optionA="Compare what active users do vs. users who stopped — find the habit that separates them."
              lockedOptions={[
                'Get engineering and sales in a room and decide on the root cause together.',
                'Ship the next big feature quickly — momentum brings users back.',
                'Pause new launches and talk to 20 users who left to understand why.'
              ]}
              checkLabel={<>How you spot<br />the real problem</>}
            />

            <ScenarioCard
              variant="sx-card--reverse"
              chipVariant="sx-card__chip--accent"
              optionAccent
              media={salesScenario}
              mediaClass="sx-card__media--sales"
              alt="Sales lead reviewing dropping close-rate dashboard with pipeline whiteboard"
              eyebrow="SCENARIO 02"
              headline={<>Lots of leads.<br /><em>Few</em> are<br />buying.</>}
              chip="Sales Lead"
              title={<>Plenty of leads. <em>Sales aren't growing.</em></>}
              question="Your team has 3x more leads than the target, but fewer are turning into actual sales. It's been getting worse for 2 months. What do you fix first?"
              optionA="Look at where leads drop off in the sales process — find exactly where they're getting stuck."
              lockedOptions={[
                'Focus the team on closing the 10 biggest deals that are already in progress.',
                'Generate even more leads to make up for the lower conversion rate.',
                'Plan for the next 6 months and get marketing involved to fix lead quality.'
              ]}
              checkLabel={<>How you make<br />tough trade-offs</>}
            />

            <ScenarioCard
              variant=""
              chipVariant=""
              media={marketingScenario}
              mediaClass="sx-card__media--marketing"
              alt="Marketing lead reviewing CTR, CAC, and revenue dashboards"
              eyebrow="SCENARIO 03"
              headline={<>More clicks.<br /><em>Less</em><br />revenue.</>}
              chip="Marketing Lead"
              title={<>Ads are getting clicks. <em>Sales aren't going up.</em></>}
              question="More people are clicking your ads than ever. But each customer is costing more to acquire, and total revenue is dropping. What do you do this week?"
              optionA="Cut the channels that cost too much per customer. Move that budget to the ones that work."
              lockedOptions={[
                'Start from the revenue drop and trace back to find where customers are falling off.',
                'Pause all ad spend until you can clearly track which ads actually drive sales.',
                'Look city-by-city — there are places where the campaign is still working well.'
              ]}
              checkLabel={<>How you read<br />the right numbers</>}
            />
          </div>

          <p className="scenarios__signals reveal">
            Every answer reveals how you frame problems, weigh trade-offs, and use data to decide.
          </p>

          <div className="scenarios__cta reveal">
            <a href="#hero-form" className="btn btn--primary btn--lg">Start with your role &rarr;</a>
          </div>
        </div>
      </section>

      <section className="stats-fold" id="stats-fold" aria-label="Key statistics">
        <div className="stats-fold__bg" aria-hidden="true">
          <img className="stats-fold__bg-star" src={starOutline} alt="" role="presentation" loading="lazy" />
        </div>

        <div className="container">
          <h2 className="stats-fold__heading reveal">AI is already moving careers.</h2>
          <p className="stats-fold__body reveal reveal-delay-1">
            The professionals getting promoted are the ones who know their specific gap and have a plan. This gives you both. In 3 minutes.
          </p>

          <div className="stats-grid reveal reveal-delay-2">
            <div className="stat-block">
              <div className="stat-block__num"><span>40</span>%</div>
              <p className="stat-block__label">of mid-career roles in tech will require AI fluency by 2026</p>
              <p className="stat-block__source">World Economic Forum, Future of Jobs 2025</p>
            </div>
            <div className="stat-block">
              <div className="stat-block__num"><span>78</span>%</div>
              <p className="stat-block__label">of professionals who know their specific skill gap take action within 90 days</p>
              <p className="stat-block__source">Scaler Internal Data, 2025</p>
            </div>
            <div className="stat-block">
              <div className="stat-block__num">+<span>43</span>%</div>
              <p className="stat-block__label">median salary premium for AI-fluent professionals in equivalent roles</p>
              <p className="stat-block__source">LinkedIn Workforce Insights, 2025</p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-final" id="faq-final" aria-label="Frequently asked questions and final form">
        <div className="container">
          <div className="faq__head reveal">
            <p className="section-eyebrow text-center">Questions</p>
            <h2 className="section-heading text-center">Common questions.</h2>
          </div>

          <div className="faq__list reveal reveal-delay-1" role="list">
            <FaqItem q="Is this free?">
              Yes. No payment, no credit card, no catch. The full report &mdash; score, skill map, seniority read, career path &mdash; is delivered free, on-screen, immediately after you finish.
            </FaqItem>
            <FaqItem q="How long does it take?">
              3 minutes. 6 scenarios. Report on-screen instantly after you submit your answers. No email wait.
            </FaqItem>
            <FaqItem q="What do I get at the end?">
              Your AI Readiness score (0&ndash;100), a skill gap map across 7 dimensions specific to your role, a seniority read (junior / mid / senior operator), 3 career paths with milestones, 4 personalized quick wins, and 9 AI tools prioritized for your role. No two reports are identical.
            </FaqItem>
            <FaqItem q="How is this different from a generic AI quiz?">
              Each scenario maps to a specific seniority signal &mdash; problem framing, strategic courage, metric thinking, AI leverage realism. Built by operators across Razorpay, Swiggy, and CRED. You won't find a question about "what is a large language model" here. These are diagnostic, not educational.
            </FaqItem>
            <FaqItem q="What happens to my phone number?">
              Your number is used to deliver your personalized report and may be used to follow up with relevant program information from Scaler. We do not sell or share your data with third parties. See our <a href="https://www.scaler.com/privacy-policy/" style={{ color: 'var(--brand-primary)' }}>Privacy Policy</a>.
            </FaqItem>
          </div>
        </div>

        <div className="final-form-panel reveal" id="final-form-panel">
          <div className="final-form-panel__inner">
            <div className="final-form-panel__copy">
              <p className="section-eyebrow">Ready when you are</p>
              <h2 className="final-form-panel__heading">Three minutes from now, you'll have your report.</h2>
              <p className="final-form-panel__sub">Free. No resume. Delivered on-screen, instantly.</p>
              <ul className="hero__pointers hero__pointers--light" aria-label="What's in your report">
                <Pointer>Profile Strength Analysis</Pointer>
                <Pointer>Skill Gap Assessment</Pointer>
                <Pointer>Career Readiness Timeline</Pointer>
                <Pointer>Peer Comparison</Pointer>
              </ul>
            </div>

            <LeadCard formId="final" />
          </div>
        </div>
      </section>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer__inner">
            <a href="/" className="footer__logo" aria-label="Scaler home">
              <img src={logoWhite} alt="Scaler" width="80" height="16" loading="lazy" />
            </a>
            <nav className="footer__links" aria-label="Footer navigation">
              <a href="https://www.scaler.com/privacy-policy/" className="footer__link">Privacy Policy</a>
              <a href="https://www.scaler.com/terms/" className="footer__link">Terms of Use</a>
              <a href="mailto:support@scaler.com" className="footer__link">Contact</a>
            </nav>
            <p className="footer__legal">&copy; 2026 Scaler Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ScenarioCard = ({
  variant,
  chipVariant,
  optionAccent,
  media,
  mediaClass,
  alt,
  eyebrow,
  headline,
  chip,
  title,
  question,
  optionA,
  lockedOptions,
  checkLabel
}) => (
  <article className={`sx-card${variant ? ` ${variant}` : ''}`} role="listitem">
    <div className={`sx-card__media ${mediaClass}`}>
      <img className="sx-card__media-img" src={media} alt={alt} loading="lazy" />
      <div className="sx-card__media-overlay">
        <p className="sx-card__media-eyebrow">{eyebrow}</p>
        <p className="sx-card__media-headline">{headline}</p>
      </div>
    </div>
    <div className="sx-card__body">
      <span className={`sx-card__chip${chipVariant ? ` ${chipVariant}` : ''}`}>{chip}</span>
      <h3 className="sx-card__title">{title}</h3>
      <p className="sx-card__q">{question}</p>

      <div className="sx-card__options">
        <div className={`sx-card__option${optionAccent ? ' sx-card__option--accent' : ''}`}>
          <span className="sx-card__option-letter">A</span>
          <span className="sx-card__option-text">{optionA}</span>
        </div>
        <div className="sx-card__options-locked">
          <div className="sx-card__options-blurred" aria-hidden="true">
            {lockedOptions.map((text, i) => (
              <div className="sx-card__option" key={i}>
                <span className="sx-card__option-letter">{['B', 'C', 'D'][i]}</span>
                <span className="sx-card__option-text">{text}</span>
              </div>
            ))}
          </div>
          <div className="sx-card__options-veil">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>3 more options unlock when you start</span>
          </div>
        </div>
      </div>

      <div className="sx-card__metrics">
        <div className="sx-metric">
          <p className="sx-metric__label">What we check</p>
          <p className="sx-metric__val">{checkLabel}</p>
        </div>
        <div className="sx-metric">
          <p className="sx-metric__label">What you learn</p>
          <p className="sx-metric__val">Your level:<br />Junior / Mid / Senior</p>
        </div>
      </div>

      <a href="#hero-form" className="sx-card__cta">
        Start with your role
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </article>
);

const FaqItem = ({ q, children }) => (
  <details className="faq-item" role="listitem">
    <summary>
      {q}
      <svg className="faq-item__chevron icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
    </summary>
    <div className="faq-item__body">{children}</div>
  </details>
);

export default MBALandingPage;
