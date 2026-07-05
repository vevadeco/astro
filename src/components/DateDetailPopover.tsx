import type { DateSummary } from '../models/types';

interface DateDetailPopoverProps {
  summary: DateSummary | null;
  onClose: () => void;
}

export function DateDetailPopover({ summary, onClose }: DateDetailPopoverProps) {
  if (!summary) return null;

  const label =
    summary.classification === 'both'
      ? 'Mixed — Lucky & Caution'
      : summary.classification.charAt(0).toUpperCase() + summary.classification.slice(1);

  return (
    <div className="date-detail-overlay" onClick={onClose} role="presentation">
      <div
        className="date-detail-popover"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="date-detail-title"
      >
        <button type="button" className="popover-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 id="date-detail-title">{summary.date}</h3>
        <span className={`classification-badge badge-${summary.classification}`}>{label}</span>

        {summary.luckySummary && (
          <div className="summary-block lucky-block">
            <h4>Auspicious Factors</h4>
            <p>{summary.luckySummary}</p>
          </div>
        )}
        {summary.cautionSummary && (
          <div className="summary-block caution-block">
            <h4>Caution Advisory</h4>
            <p>{summary.cautionSummary}</p>
          </div>
        )}
        {summary.classification === 'neutral' && (
          <p>No notable astrological influences on this date.</p>
        )}
      </div>
    </div>
  );
}
