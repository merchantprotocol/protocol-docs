import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import HeroSvg from './Landing/Hero/HeroSvg';
import GridBackground from './Landing/Hero/GridBackground';
import QuickLinks from './Landing/QuickLinks';

export default function Home() {
  return (
    <Layout wrapperClassName="page-splash">
      <Head>
        <html className="SplashPage" />
      </Head>
      <div className="splash-hero">
        <div className="splash-grid-bg">
          <GridBackground />
        </div>
        <div className="container">
          <div className="splash-hero-inner">
            <div className="splash-hero-text">
              <h1>
                Deploy to Every Node.
                <br />
                <span className="splash-accent">In Seconds.</span>
              </h1>
              <p className="splash-tagline">
                Protocol is a deployment CLI that turns your servers into
                self-healing, always-listening endpoints. One command. Every
                node. Instant rollback.
              </p>
              <div className="splash-cta">
                <a
                  href="/getting-started"
                  className="splash-btn splash-btn-primary">
                  Get Started
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a href="/overview" className="splash-btn splash-btn-secondary">
                  Read the Docs
                </a>
              </div>
              <div className="splash-terminal-hint">
                <code>
                  <span className="splash-prompt">$</span> protocol deploy:push
                  v1.2.0
                </code>
              </div>
            </div>
            <div className="splash-hero-illustration">
              <HeroSvg />
            </div>
          </div>
        </div>
      </div>

      <QuickLinks />

      <div className="splash-bottom-cta">
        <div className="container">
          <h2>No build servers. No pipelines. No SSH chains.</h2>
          <p>
            Your servers pull code themselves. Every node independently detects
            changes, decrypts secrets, rebuilds containers, and starts serving
            traffic.
          </p>
          <a href="/overview" className="splash-btn splash-btn-primary">
            Learn How It Works
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </Layout>
  );
}
