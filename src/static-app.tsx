import { Routed } from './App';
import TopBar from './components/TopBar';
import ContactRail from './components/ContactRail';

/**
 * The tree the prerenderer renders. Identical content to the live app minus
 * browser-only concerns, so the static HTML and the hydrated app agree.
 */
export default function StaticApp({ route }: { route: string }) {
  const isResume = route === '/resume';
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
