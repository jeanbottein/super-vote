import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router';
import CreatePollPage from '../polls/CreatePollPage';
import HomePage from '../polls/HomePage';
import PollPage from '../polls/PollPage';
import { useI18n } from '../i18n/i18n';
import { PreferencesProvider } from '../preferences/preferences';
import { ToastProvider } from '../ui/Toasts';
import AboutPage from './AboutPage';
import Footer from './Footer';
import Header from './Header';
import NotFoundPage from './NotFoundPage';
import PrivacyPage from './PrivacyPage';

/** Loaded when opened: the world map is most of its weight, and few visitors open it. */
const StatisticsPage = lazy(() => import('../statistics/StatisticsPage'));

/**
 * Three screens: the polls you can see, a form to create one, and a poll -
 * where you vote and watch the results come in. A poll's address, /p/<id>,
 * is its share link. /about says how results are decided, and why;
 * /privacy, what is kept, who sees what, and what super-vote cannot do yet;
 * /statistics, how much super-vote is used, and where.
 */
export default function App() {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="new" element={<CreatePollPage />} />
              <Route path="p/:id" element={<PollPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </PreferencesProvider>
  );
}

function Statistics() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<p className="empty" aria-busy="true">{t.loading}</p>}>
      <StatisticsPage />
    </Suspense>
  );
}

/** Home is the one page that spreads out on a wide screen (docs/DESIGN.md, "Layout"). */
function Layout() {
  const atHome = useLocation().pathname === '/';
  return (
    <div className="layout" data-page={atHome ? 'home' : undefined}>
      <Header />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
