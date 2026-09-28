import { Link } from 'react-router';
import { Icon } from '../components/Icon';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { openPalette } from '../utils/ui';

export default function NotFound() {
  useDocumentMeta('Not found');
  return (
    <section className="notfound container" aria-labelledby="nf-title">
      <span className="t-meta">Error / 404</span>
      <h1 className="t-display" id="nf-title">
        This route isn&rsquo;t in the system.
      </h1>
      <p className="t-body">The page may have moved, or the link was mistyped.</p>
      <div className="hero__ctas">
        <Link to="/" className="btn btn--primary">
          Back to home <Icon name="arrowRight" size={16} />
        </Link>
        <button type="button" className="btn btn--ghost" onClick={openPalette}>
          Search everything
        </button>
      </div>
    </section>
  );
}
