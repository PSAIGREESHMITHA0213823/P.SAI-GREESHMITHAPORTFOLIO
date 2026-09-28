import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { config } from '../data/config';
import { cn } from '../utils/cn';
import { PAGES } from '../utils/navigation';
import { openPalette } from '../utils/ui';
import { Icon, type IconName } from './Icon';
import { Kbd, modKey, StatusBadge } from './Primitives';
import { Sheet } from './Sheet';
import { LiveClock } from './Widgets';

function Wordmark() {
  return (
    <Link to="/" viewTransition className="wordmark" aria-label={`${config.name} — home`}>
      <span className="wordmark__mark" aria-hidden="true">
        G
      </span>
      <span className="wordmark__name">{config.shortName}</span>
    </Link>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('nav', scrolled && 'is-scrolled')}>
      <div className="nav__inner container">
        <Wordmark />
        <nav className="nav__links" aria-label="Primary">
          {PAGES.map((p) => (
            <NavLink
              key={p.path}
              to={p.path}
              end={p.path === '/'}
              viewTransition
              className={({ isActive }) => cn('nav__link', isActive && 'is-active')}
            >
              {p.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__tools">
          <button type="button" className="palette-hint" onClick={openPalette} aria-label="Search the site">
            <Icon name="search" size={15} />
            <Kbd>{modKey}</Kbd>
            <Kbd>K</Kbd>
          </button>
          <Link to="/contact" viewTransition className="btn btn--primary nav__cta">
            Contact
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Mobile-only bottom tab bar + full-screen menu. */
export function MobileTabBar() {
  const [menu, setMenu] = useState(false);
  const tabs: { to: string; label: string; icon: IconName }[] = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/work', label: 'Work', icon: 'grid' },
    { to: '/about', label: 'About', icon: 'user' },
    { to: '/contact', label: 'Contact', icon: 'chat' },
  ];

  return (
    <>
      <nav className="tabbar" aria-label="Mobile">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            viewTransition
            className={({ isActive }) => cn('tabbar__btn', isActive && 'is-active')}
          >
            <Icon name={t.icon} size={20} />
            <span>{t.label}</span>
          </NavLink>
        ))}
        <button type="button" className="tabbar__btn" onClick={() => setMenu(true)} aria-haspopup="dialog">
          <Icon name="menu" size={20} />
          <span>Menu</span>
        </button>
      </nav>
      <Sheet open={menu} onClose={() => setMenu(false)} placement="bottom" title="Menu" meta="NAVIGATE" className="mobile-menu">
        <ul className="mobile-menu__list">
          {PAGES.map((p, i) => (
            <li key={p.path}>
              <Link to={p.path} viewTransition onClick={() => setMenu(false)}>
                <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__foot">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setMenu(false);
              requestAnimationFrame(openPalette);
            }}
          >
            <Icon name="search" size={16} /> Search everything
          </button>
          <StatusBadge compact />
        </div>
      </Sheet>
    </>
  );
}

function SocialLink({ href, label, icon }: { href: string | null; label: string; icon: IconName }) {
  if (!href) return null;
  return (
    <a className="footer__social" href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
      <Icon name={icon} size={16} />
      {label}
      <Icon name="arrowUpRight" size={13} />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <div className="footer__cols">
          <div className="footer__col footer__brand">
            <span className="footer__name">{config.name}</span>
            <span className="footer__role">Software Engineer · Full Stack Developer</span>
          </div>
          <div className="footer__col">
            <span className="t-meta">Pages</span>
            {PAGES.map((p) => (
              <Link key={p.path} to={p.path} viewTransition className="footer__link">
                {p.label}
              </Link>
            ))}
          </div>
          <div className="footer__col">
            <span className="t-meta">Elsewhere</span>
            <SocialLink href={config.githubUrl} label="GitHub" icon="github" />
            <SocialLink href={config.linkedinUrl} label="LinkedIn" icon="linkedin" />
            <SocialLink href={config.email ? `mailto:${config.email}` : null} label="Email" icon="mail" />
          </div>
          <div className="footer__col">
            <span className="t-meta">Status</span>
            <StatusBadge compact />
            <span className="footer__clock">
              {config.location ?? 'India'} · <LiveClock />
            </span>
          </div>
        </div>

        <div className="footer__legal">
          <span>© 2026 {config.name}</span>
          <span className="footer__tag">Software Engineer · Full Stack · AI · SaaS</span>
          <button type="button" className="footer__keys" onClick={openPalette}>
            <Kbd>{modKey}</Kbd>
            <Kbd>K</Kbd> to search
          </button>
        </div>
      </div>
    </footer>
  );
}
