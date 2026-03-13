import React from 'react';

function QuickLinks() {
  return (
    <div className="container">
      <div className="card-wrapper">
        <div className="card">
          <div className="card-content-items">
            <div className="card-content">
              <h4>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3fb950"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                Get Started
              </h4>
              <p>
                Install Protocol on your infrastructure and deploy your first
                release across every node in minutes.
              </p>
              <ul className="menu__list">
                <li>
                  <a href="/getting-started">Quick Start Guide</a>
                </li>
                <li>
                  <a href="/installation">Installation</a>
                </li>
                <li>
                  <a href="/commands">CLI Commands Reference</a>
                </li>
                <li>
                  <a href="/configuration">Configuration</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content-items">
            <div className="card-content">
              <h4>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3fb950"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Deployment Strategies
              </h4>
              <p>
                Shadow deployments, blue-green, instant rollbacks — learn the
                deployment patterns Protocol supports out of the box.
              </p>
              <ul className="menu__list">
                <li>
                  <a href="/deployment-types">Deployment Types</a>
                </li>
                <li>
                  <a href="/blue-green">Shadow Deployment</a>
                </li>
                <li>
                  <a href="/deployment-sops">Deployment SOPs</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content-items">
            <div className="card-content">
              <h4>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3fb950"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Security &amp; Compliance
              </h4>
              <p>
                Encrypted secrets, key rotation, SOC 2 controls — Protocol is
                built for regulated environments.
              </p>
              <ul className="menu__list">
                <li>
                  <a href="/secrets">Secrets Management</a>
                </li>
                <li>
                  <a href="/security">Security Overview</a>
                </li>
                <li>
                  <a href="/soc2">SOC 2 Compliance</a>
                </li>
                <li>
                  <a href="/incident-response">Incident Response</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickLinks;
