import React, {useState, useEffect, useCallback, useRef} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.scss';

const guidesItems = [
  {label: 'Installation', to: '/installation'},
  {label: 'Configuration', to: '/configuration'},
  {label: 'Commands', to: '/commands'},
  {label: 'Secrets Management', to: '/secrets'},
];

const operationsItems = [
  {label: 'Deployment Strategies', to: '/deployment-types'},
  {label: 'Shadow Deployment', to: '/blue-green'},
  {label: 'Deployment SOPs', to: '/deployment-sops'},
  {label: 'Incident Response', to: '/incident-response'},
];

function ChevronRight() {
  return (
    <svg
      className={styles.chevron}
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round">
      <path d="M3.5 1.5L7 5L3.5 8.5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 2.5A2.5 2.5 0 013.5 0h9.25a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-9.5a1 1 0 00-1 1v.25a.75.75 0 01-1.5 0V2.5zm2.5-1a1 1 0 00-1 1v7.084a2.5 2.5 0 011-.084h9V1.5H3.5z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M14.064 0a8.75 8.75 0 00-6.187 2.563l-.459.458c-.314.314-.616.641-.904.979H3.31a1.75 1.75 0 00-1.49.833L.11 7.607a.75.75 0 00.418 1.11l3.102.954c.037.051.079.1.124.145l2.429 2.428c.046.046.094.088.145.125l.954 3.102a.75.75 0 001.11.418l2.774-1.707a1.75 1.75 0 00.833-1.49V9.485c.338-.288.665-.59.979-.904l.458-.459A8.75 8.75 0 0016 1.936V1.75A1.75 1.75 0 0014.25 0h-.186zM10.5 10.625c-.088.06-.177.118-.267.175l-.349.21v2.49l-1.567.964-.394-1.28 2.577-2.559zm-5.75-3.25h2.49l.21-.349c.057-.09.115-.179.175-.267L5.067 9.336l-1.28-.394.964-1.567zM9.22 3.77a7.25 7.25 0 015.03-2.27v.186A7.25 7.25 0 019.22 3.77zM11.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.5 7.5a.5.5 0 000-1H5.707l2.147-2.146a.5.5 0 10-.708-.708l-3 3a.5.5 0 000 .708l3 3a.5.5 0 00.708-.708L5.707 7.5H11.5z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function Submenu({label, icon, items, openRight}) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  return (
    <div
      className={styles.submenuParent}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>
      <button
        className={styles.submenuTrigger}
        type="button"
        onClick={handleClick}>
        <span className={styles.submenuLabel}>
          {icon}
          {label}
        </span>
        <ChevronRight />
      </button>
      {open && (
        <div
          className={`${styles.submenu} ${
            !openRight ? styles.submenuLeft : ''
          }`}>
          {items.map(item => (
            <Link key={item.to} to={item.to} className={styles.menuItem}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [openRight, setOpenRight] = useState(true);
  const menuRef = useRef(null);
  const logoSrc = useBaseUrl('img/terminal-icon.svg');

  const handleContextMenu = useCallback(e => {
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;
    const menuWidth = 240;
    const submenuWidth = 220;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine if submenus should fly out left or right
    const spaceRight = viewportWidth - x;
    const shouldOpenRight = spaceRight > menuWidth + submenuWidth + 20;
    setOpenRight(shouldOpenRight);

    // Clamp position so menu stays on screen
    const clampedX = Math.min(x, viewportWidth - menuWidth - 10);
    const clampedY = Math.min(y, viewportHeight - 320);

    setPosition({x: clampedX, y: clampedY});
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [handleContextMenu]);

  useEffect(() => {
    if (visible) {
      const handleKeyDown = e => {
        if (e.key === 'Escape') handleClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [visible, handleClose]);

  if (!visible) return null;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={handleClose}
        onContextMenu={e => {
          e.preventDefault();
          handleClose();
        }}
      />
      <div
        ref={menuRef}
        className={styles.menu}
        style={{left: position.x, top: position.y}}>
        {/* Logo header */}
        <div className={styles.header}>
          <img src={logoSrc} alt="Protocol" className={styles.logo} />
          <span className={styles.brandName}>Protocol</span>
        </div>

        {/* Getting Started */}
        <Link
          to="/getting-started"
          className={styles.menuItem}
          onClick={handleClose}>
          <GearIcon />
          Getting Started
        </Link>

        {/* Guides flyout */}
        <Submenu
          label="Guides"
          icon={<BookIcon />}
          items={guidesItems}
          openRight={openRight}
        />

        {/* Operations flyout */}
        <Submenu
          label="Operations"
          icon={<RocketIcon />}
          items={operationsItems}
          openRight={openRight}
        />

        <div className={styles.separator} />

        {/* GitHub link */}
        <a
          href="https://github.com/merchantprotocol/protocol"
          className={styles.menuItem}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}>
          <GitHubIcon />
          GitHub Repository
        </a>
      </div>
    </>
  );
}
