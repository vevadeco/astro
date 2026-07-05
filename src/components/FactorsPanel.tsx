import { useApp } from '../context/AppContext';
import type { LuckyItem, UnluckyItem } from '../models/types';

function FactorList({
  title,
  items,
  variant,
}: {
  title: string;
  items: (LuckyItem | UnluckyItem)[];
  variant: 'lucky' | 'unlucky';
}) {
  if (items.length === 0) return null;
  return (
    <div className={`factor-group factor-${variant}`}>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.value}`}>
            <strong>{item.value}</strong>
            <span>{item.explanation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FactorsPanel() {
  const {
    profile,
    zodiacSign,
    signDescription,
    luckyFactors,
    unluckyFactors,
    natalChart,
    factorsError,
  } = useApp();

  if (!profile || !zodiacSign) return null;

  const signLabel = zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1);

  return (
    <section className="factors-panel">
      <h2>Your Astrological Profile</h2>
      <p className="welcome">Welcome, {profile.name}</p>

      <div className="zodiac-card">
        <h3>{signLabel}</h3>
        <p>{signDescription}</p>
        {natalChart?.reducedPrecision && (
          <p className="precision-note">
            Natal chart calculated with reduced precision (no birth location provided).
          </p>
        )}
        {natalChart?.ascendant && (
          <p className="ascendant-note">
            Ascendant: {natalChart.ascendant.charAt(0).toUpperCase() + natalChart.ascendant.slice(1)}
          </p>
        )}
      </div>

      {factorsError && <div className="alert alert-error">{factorsError}</div>}

      {luckyFactors && (
        <div className="factors-section lucky-section">
          <h3>Lucky Factors</h3>
          <FactorList title="Numbers" items={luckyFactors.numbers} variant="lucky" />
          <FactorList title="Colors" items={luckyFactors.colors} variant="lucky" />
          <FactorList title="Days" items={luckyFactors.days} variant="lucky" />
          <FactorList title="Gemstones" items={luckyFactors.gemstones} variant="lucky" />
        </div>
      )}

      {!luckyFactors && !factorsError && (
        <div className="alert alert-error">
          Lucky factors are unavailable. Please verify your birth details.
        </div>
      )}

      {unluckyFactors && (
        <div className="factors-section unlucky-section">
          <h3>Unlucky Factors</h3>
          <FactorList title="Numbers" items={unluckyFactors.numbers} variant="unlucky" />
          <FactorList title="Colors" items={unluckyFactors.colors} variant="unlucky" />
          <FactorList title="Days" items={unluckyFactors.days} variant="unlucky" />
        </div>
      )}

      {!unluckyFactors && !factorsError && (
        <div className="alert alert-warning">
          Unlucky factors are unavailable for the given profile.
        </div>
      )}
    </section>
  );
}
