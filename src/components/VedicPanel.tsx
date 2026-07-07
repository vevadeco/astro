import { useApp } from '../context/AppContext';
import { generateVedicProfile } from '../services/vedicService';
import type { VedicProfile } from '../services/vedicService';

function DoshaBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="dosha-bar-row">
      <span className="dosha-label">{label}</span>
      <div className="dosha-track">
        <div
          className="dosha-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="dosha-value">{value}%</span>
    </div>
  );
}

function VedicContent({ vedic }: { vedic: VedicProfile }) {
  return (
    <section className="vedic-panel">
      <h2>🕉️ Vedic Astrology (Jyotish)</h2>
      <p className="vedic-intro">
        Vedic astrology uses the sidereal zodiac and emphasizes your Moon sign (Rashi)
        as the primary indicator of your nature, mind, and destiny.
      </p>

      {/* Rashi Card */}
      <div className="vedic-card rashi-card">
        <div className="vedic-card-header">
          <h3>Your Rashi (Moon Sign)</h3>
          <span className="vedic-badge">{vedic.vedicElement}</span>
        </div>
        <h4 className="rashi-name">
          {vedic.rashiLabel} ({vedic.rashi.charAt(0).toUpperCase() + vedic.rashi.slice(1)})
        </h4>
        <p className="rashi-desc">{vedic.rashiDescription}</p>
        <p className="ruling-planet">
          <strong>Ruling Planet:</strong> {vedic.rulingPlanet}
        </p>
      </div>

      {/* Nakshatra Card */}
      <div className="vedic-card nakshatra-card">
        <h3>Your Nakshatra (Lunar Mansion)</h3>
        <div className="nakshatra-header">
          <h4>{vedic.nakshatra.name}</h4>
          <span className="pada-badge">Pada {vedic.nakshatra.pada}</span>
        </div>
        <p className="nakshatra-desc">{vedic.nakshatra.description}</p>
        <div className="nakshatra-details">
          <span><strong>Ruler:</strong> {vedic.nakshatra.rulingPlanet}</span>
          <span><strong>Deity:</strong> {vedic.nakshatra.deity}</span>
          <span><strong>Nature:</strong> {vedic.nakshatra.nature}</span>
        </div>
      </div>

      {/* Lucky Factors */}
      <div className="vedic-card lucky-vedic-card">
        <h3>Vedic Lucky Factors</h3>
        <div className="vedic-factors-grid">
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Day</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.day}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Color</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.color}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Lucky Number</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.number}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Gemstone</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.gemstone}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Metal</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.metal}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Direction</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.direction}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Deity</span>
            <span className="vedic-factor-value">{vedic.luckyFactors.deity}</span>
          </div>
        </div>
        <div className="vedic-mantra">
          <span className="vedic-factor-label">Recommended Mantra</span>
          <p className="mantra-text">{vedic.luckyFactors.mantra}</p>
        </div>
      </div>

      {/* Unlucky Factors */}
      <div className="vedic-card unlucky-vedic-card">
        <h3>Vedic Caution Factors</h3>
        <div className="vedic-factors-grid">
          <div className="vedic-factor">
            <span className="vedic-factor-label">Avoid Color</span>
            <span className="vedic-factor-value caution-value">{vedic.unluckyFactors.avoidColor}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Avoid Direction</span>
            <span className="vedic-factor-value caution-value">{vedic.unluckyFactors.avoidDirection}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Caution Day</span>
            <span className="vedic-factor-value caution-value">{vedic.unluckyFactors.avoidDay}</span>
          </div>
          <div className="vedic-factor">
            <span className="vedic-factor-label">Challenging Planet</span>
            <span className="vedic-factor-value caution-value">{vedic.unluckyFactors.cautionPlanet}</span>
          </div>
        </div>
      </div>

      {/* Dosha Balance */}
      <div className="vedic-card dosha-card">
        <h3>Dosha Balance (Ayurvedic Constitution)</h3>
        <p className="dosha-dominant">
          Dominant Dosha: <strong>{vedic.doshas.dominant}</strong>
        </p>
        <div className="dosha-bars">
          <DoshaBar label="Vata" value={vedic.doshas.vata} color="#7c3aed" />
          <DoshaBar label="Pitta" value={vedic.doshas.pitta} color="#dc2626" />
          <DoshaBar label="Kapha" value={vedic.doshas.kapha} color="#059669" />
        </div>
        <p className="dosha-advice">{vedic.doshas.advice}</p>
      </div>
    </section>
  );
}

export function VedicPanel() {
  const { profile, natalChart } = useApp();

  if (!profile || !natalChart) return null;

  const vedic = generateVedicProfile(profile, natalChart);

  return <VedicContent vedic={vedic} />;
}
