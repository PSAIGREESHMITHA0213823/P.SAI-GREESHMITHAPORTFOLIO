import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcuts, ShortcutsOverlay } from './components/Shortcuts';
import { Footer, MobileTabBar, Nav } from './components/Shell';
import { Toaster } from './components/Widgets';
import Home from './pages/Home';

function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <CommandPalette />
      <ShortcutsOverlay />
      <KeyboardShortcuts />
      <Toaster />
      <ScrollRestoration getKey={(loc) => loc.pathname} />
    </>
  );
}

const pages = () => import('./pages/Pages');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    hydrateFallbackElement: <div className="boot" aria-busy="true" />,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', lazy: () => pages().then((m) => ({ Component: m.WorkPage })) },
      {
        path: 'work/:slug',
        lazy: () => import('./pages/CaseStudy').then((m) => ({ Component: m.default })),
      },
      { path: 'about', lazy: () => pages().then((m) => ({ Component: m.AboutPage })) },
      { path: 'services', lazy: () => pages().then((m) => ({ Component: m.ServicesPage })) },
      { path: 'contact', lazy: () => pages().then((m) => ({ Component: m.ContactPage })) },
      {
        path: 'audit',
        lazy: () => import('./pages/Audit').then((m) => ({ Component: m.default })),
      },
      {
        path: '*',
        lazy: () => import('./pages/NotFound').then((m) => ({ Component: m.default })),
      },
    ],
  },
]);
