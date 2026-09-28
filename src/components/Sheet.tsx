import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Icon } from './Icon';

/**
 * Modal surface built on native <dialog> (focus trap, Esc, inert background for free).
 * `placement="side"` is a right drawer on desktop; both placements become a bottom sheet on mobile.
 */
export function Sheet({
  open,
  onClose,
  title,
  meta,
  children,
  placement = 'side',
  className,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  placement?: 'side' | 'bottom' | 'center';
  className?: string;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.classList.add('has-modal');
    } else if (!open && d.open) {
      d.close();
    }
    return () => document.documentElement.classList.remove('has-modal');
  }, [open]);

  const titleId = labelledBy ?? 'sheet-title';

  return (
    <dialog
      ref={ref}
      className={cn('sheet', `sheet--${placement}`, className)}
      aria-labelledby={title ? titleId : labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet__panel">
        <span className="sheet__grip" aria-hidden="true" />
        {title && (
          <header className="sheet__head">
            <div>
              {meta && <div className="t-meta">{meta}</div>}
              <h2 id={titleId} className="sheet__title">
                {title}
              </h2>
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </header>
        )}
        {children}
      </div>
    </dialog>
  );
}
