import { useEffect, useState } from 'react';
import TopBar from './components/TopBar';
import ContactRail from './components/ContactRail';
import Hero from './sections/Hero';
import Work from './sections/Work';
import About from './sections/About';
import Trajectory from './sections/Trajectory';
import Recognition from './sections/Recognition';
import Skills from './sections/Skills';
import AskIndex from './sections/AskIndex';
import Contact from './sections/Contact';
import CaseStudy from './pages/CaseStudy';
import Resume from './pages/Resume';

/**
 * The home page. One column of content, no full-bleed background effect.
 */
function Home() {
  return (
    <main className="relative z-10">
      <Hero />
      <Work />
      <About />
      <Trajectory />
      <Recognition />
      <Skills />
      <AskIndex />
      <Contact />
    </main>
  );
}

/**
 * Route resolution shared by the browser app and the prerenderer, so the static
 * HTML and the hydrated app always agree on what a URL renders.
 *   /                 home
 *   /resume           print-ready record
 *   /work/{slug}      case study
 */
export function Routed({ route }: { route: string }) {
  const clean = route.replace(/\/+$/, '') || '/';

  if (clean === '/resume') return <Resume />;

  if (clean.startsWith('/work/')) {
    const slug = clean.slice('/work/'.length);
    return <CaseStudy slug={slug} />;
  }

  return <Home />;
}

export default function App() {
  const [route, setRoute] = useState(
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const isResume = route.replace(/\/+$/, '') === '/resume';

  return (
    <>
      <a
        href="#top"
        className="u-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-amber focus:px-4 focus:py-2 focus:text-void"
      >
        Skip to content
      </a>
      {!isResume && (
        <>
          <div className="page-wash" aria-hidden="true" />
          <TopBar />
          <ContactRail />
        </>
      )}
      <Routed route={route} />
    </>
  );
}
