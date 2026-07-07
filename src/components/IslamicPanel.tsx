import { useApp } from '../context/AppContext';
import { generateIslamicProfile } from '../services/islamicAstrologyService';
import type { IslamicAstrologyProfile } from '../services/islamicAstrologyService';

function TemperamentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="dosha-bar-row">
      <span className="dosha-label">{label}</span>
      <div className="dosha-track">
        <div className="dosha-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="dosha-value">{value}%</span>
    </div>
  );
}

function IslamicContent({ data }: { data: IslamicAstrologyProfile }) {
  return (
    <section className="islamic-panel">
      <h2>☪️ Islamic Astrology (Ilm al-Nujum)</h2>
      <p className="islamic-intro">
        Islamic astrology draws from medieval scholars who preserved and expanded
        upon Greek astronomy. It emphasizes the 28 Lunar Mansions, Arabic Parts,
        and planetary hours alongside spiritual guidance.
      </p>

      {/* Lunar Mansion Card */}
      <div className="islamic-card mansion-card">
        <div className="islamic-card-header">
          <h3>Your Lunar Mansion (Manzil)</h3>
          <span className={`mansion-nature nature-${data.lunarMansion.nature.toLowerCase()}`}>
            {data.lunarMansion.nature}
          </span>
        </div>
        <h4 className="mansion-name">
          #{data.lunarMansion.number} — {data.lunarMansion.arabicName}
        </h4>
        <p className="mansion-english">{data.lunarMansion.englishName}</p>
        <p className="mansion-desc">{data.lunarMansion.description}</p>
        <div className="mansion-details">
          <span><strong>Star:</strong> {data.lunarMansion.star}</span>
          <span><strong>Element:</strong> {data.lunarMansion.element}</span>
        </div>
        <div className="mansion-activities">
          <strong>Favored Activities:</strong> {data.lunarMansion.activities}
        </div>
      </div>

      {/* Arabic Lot Card */}
      <div className="islamic-card lot-card">
        <h3>Arabic Lot of Fortune (Sahm al-Sa'ada)</h3>
        <p className="lot-degree">
          Position: <strong>{data.arabicLot.degree}°</strong>
        </p>
        <p className="lot-meaning">{data.arabicLot.meaning}</p>
        <p className="lot-interpretation">{data.arabicLot.interpretation}</p>
      </div>

      {/* Abjad Numerology */}
      <div className="islamic-card abjad-card">
        <h3>Abjad Numerology</h3>
        <div className="abjad-header">
          <span className="abjad-number">{data.abjadNumber.reducedValue}</span>
          <div className="abjad-info">
            <p className="abjad-letter">{data.abjadNumber.letterCorrespondence}</p>
            <p className="abjad-meaning">{data.abjadNumber.meaning}</p>
          </div>
        </div>
        <p className="abjad-full">Full birth value: {data.abjadNumber.value}</p>
      </div>

      {/* Temperament */}
      <div className="islamic-card temperament-card">
        <h3>Temperament (Mizaj)</h3>
        <div className="temperament-header">
          <h4>{data.temperament.primary}</h4>
          <span className="temperament-arabic">{data.temperament.arabicName}</span>
        </div>
        <p className="temperament-qualities">{data.temperament.qualities}</p>
        <div className="dosha-bars">
          <TemperamentBar label="Hot" value={data.temperament.balance.hot} color="#ef4444" />
          <TemperamentBar label="Cold" value={data.temperament.balance.cold} color="#3b82f6" />
          <TemperamentBar label="Moist" value={data.temperament.balance.moist} color="#06b6d4" />
          <TemperamentBar label="Dry" value={data.temperament.balance.dry} color="#d97706" />
        </div>
        <p className="dosha-advice">{data.temperament.advice}</p>
      </div>

      {/* Planetary Hour */}
      <div className="islamic-card hour-card">
        <h3>Your Planetary Hour (Sa'at)</h3>
        <h4>{data.planetaryHour.planet} ({data.planetaryHour.arabicName})</h4>
        <p className="hour-quality">Quality: {data.planetaryHour.quality}</p>
        <p className="hour-actions"><strong>Favored Actions:</strong> {data.planetaryHour.favoredActions}</p>
      </div>

      {/* Lucky Factors */}
      <div className="islamic-card lucky-islamic-card">
        <h3>Islamic Lucky Factors</h3>
        <div className="vedic-factors-grid">
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Day</span>
            <span className="vedic-factor-value">{data.luckyFactors.day}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Color</span>
            <span className="vedic-factor-value">{data.luckyFactors.color}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Number</span>
            <span className="vedic-factor-value">{data.luckyFactors.number}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Gemstone</span>
            <span className="vedic-factor-value">{data.luckyFactors.gemstone}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Incense</span>
            <span className="vedic-factor-value">{data.luckyFactors.incense}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Direction</span>
            <span className="vedic-factor-value">{data.luckyFactors.direction}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Guardian Angel</span>
            <span className="vedic-factor-value">{data.luckyFactors.angelicName}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Recommended Surah</span>
            <span className="vedic-factor-value">{data.luckyFactors.surah}</span>
          </div>
        </div>
      </div>

      {/* Caution Factors */}
      <div className="islamic-card unlucky-islamic-card">
        <h3>Caution Factors</h3>
        <div className="vedic-factors-grid">
          <div className="vedic-factor">
            <span className="vedic-factor-label">Avoid Day</span>
            <span className="vedic-factor-value caution-value">{data.unluckyFactors.avoidDay}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Avoid Color</span>
            <span className="vedic-factor-value caution-value">{data.unluckyFactors.avoidColor}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Avoid Direction</span>
            <span className="vedic-factor-value caution-value">{data.unluckyFactors.avoidDirection}</span>
          </div>
        </div>
        <p className="caution-note">{data.unluckyFactors.cautionNote}</p>
      </div>

      {/* Spiritual Guidance */}
      <div className="islamic-card spiritual-card">
        <h3>Spiritual Guidance</h3>
        <div className="spiritual-grid">
          <div className="spiritual-item">
            <span className="spiritual-label">Recommended Dhikr</span>
            <p className="spiritual-value">{data.spiritualGuidance.dhikr}</p>
          </div>
          <div className="spiritual-item">
            <span className="spiritual-label">Best Prayer Time</span>
            <p className="spiritual-value">{data.spiritualGuidance.bestPrayerTime}</p>
          </div>
          <div className="spiritual-item">
            <span className="spiritual-label">Charitable Act</span>
            <p className="spiritual-value">{data.spiritualGuidance.charitableAct}</p>
          </div>
          <div className="spiritual-item">
            <span className="spiritual-label">Voluntary Fast</span>
            <p className="spiritual-value">{data.spiritualGuidance.fastingDay}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IslamicPanel() {
  const { profile, natalChart } = useApp();

  if (!profile || !natalChart) return null;

  const data = generateIslamicProfile(profile, natalChart);

  return <IslamicContent data={data} />;
}
