import { useApp } from '../context/AppContext';

const CLASS_LABELS: Record<string, string> = {
  lucky: 'Lucky Day',
  caution: 'Caution Day',
  both: 'Mixed Energies',
  neutral: 'Neutral Day',
};

export function DailySummaryView() {
  const { dailySummary } = useApp();

  if (!dailySummary) return null;

  const label = CLASS_LABELS[dailySummary.classification] ?? 'Today';

  return (
    <section className={`daily-summary daily-${dailySummary.classification}`}>
      <h2>Today&apos;s Summary</h2>
      <span className={`classification-badge badge-${dailySummary.classification}`}>
        {label}
      </span>
      <p className="guidance">{dailySummary.guidance}</p>
      {dailySummary.relevantFactors.length > 0 && (
        <ul className="relevant-factors">
          {dailySummary.relevantFactors.map((f) => (
            <li key={f.value}>
              <strong>{f.value}</strong> — {f.explanation}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
