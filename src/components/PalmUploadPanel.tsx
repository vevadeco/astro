import { useCallback, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  analyzePalm,
  validatePalmImage,
  palmUploadErrorMessage,
  ACCEPTED_PALM_IMAGE_TYPES,
  type HandSide,
  type PalmReading,
} from '../services/palmistryService';

function LineCard({ line }: { line: PalmReading['lines'][number] }) {
  return (
    <div className="palm-line-card">
      <div className="palm-line-header">
        <h4>{line.name}</h4>
        <span className="palm-badge">{line.quality}</span>
      </div>
      <p className="palm-line-meta">
        Length: <strong>{line.length}</strong>
      </p>
      <p className="palm-line-explanation">{line.explanation}</p>
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: PalmReading['predictions'][number] }) {
  const icons: Record<PalmReading['predictions'][number]['category'], string> = {
    love: '💕',
    career: '💼',
    health: '🌿',
    wealth: '💰',
    spirituality: '✨',
  };
  return (
    <div className="palm-prediction-card">
      <div className="palm-prediction-header">
        <span className="palm-prediction-icon">{icons[prediction.category]}</span>
        <h4>{prediction.title}</h4>
      </div>
      <p className="palm-prediction-text">{prediction.prediction}</p>
      <p className="palm-prediction-timeframe">{prediction.timeframe}</p>
    </div>
  );
}

function PalmReadingResults({ reading, previewUrl }: { reading: PalmReading; previewUrl: string }) {
  return (
    <div className="palm-results">
      <div className="palm-results-header">
        <div className="palm-preview-wrap">
          <img src={previewUrl} alt="Uploaded palm" className="palm-preview-image" />
        </div>
        <div className="palm-hand-info">
          <h3>
            {reading.handShape} Hand
            <span className="palm-hand-side">
              ({reading.handSide === 'left' ? 'Left — Receptive' : 'Right — Active'})
            </span>
          </h3>
          <p className="palm-shape-desc">{reading.handShapeDescription}</p>
          <p className="palm-overall-summary">{reading.overallSummary}</p>
        </div>
      </div>

      <div className="palm-card">
        <h3>Major Lines</h3>
        <div className="palm-lines-grid">
          {reading.lines.map((line) => (
            <LineCard key={line.name} line={line} />
          ))}
        </div>
      </div>

      <div className="palm-card">
        <h3>Mounts & Their Meanings</h3>
        <div className="palm-mounts-grid">
          {reading.mounts.map((mount) => (
            <div key={mount.name} className="palm-mount-item">
              <div className="palm-mount-header">
                <span className="palm-mount-name">{mount.name}</span>
                <span className={`palm-mount-badge prominence-${mount.prominence}`}>
                  {mount.prominence}
                </span>
              </div>
              <p className="palm-mount-meaning">{mount.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="palm-card palm-predictions-section">
        <h3>Predictions</h3>
        <div className="palm-predictions-grid">
          {reading.predictions.map((prediction) => (
            <PredictionCard key={prediction.category} prediction={prediction} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PalmUploadPanel() {
  const { profile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [handSide, setHandSide] = useState<HandSide>('right');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const resetPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);
      setReading(null);
      resetPreview();

      if (!file) {
        setSelectedFile(null);
        return;
      }

      const validationError = validatePalmImage(file);
      if (validationError) {
        setError(palmUploadErrorMessage(validationError));
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [resetPreview],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !profile) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePalm(selectedFile, profile, handSide);
      setReading(result);
    } catch {
      setError(palmUploadErrorMessage('read_failed'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    handleFile(null);
    setReading(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!profile) return null;

  return (
    <section className="palm-panel">
      <h2>🤚 Palmistry Reading</h2>
      <p className="palm-intro">
        Upload a clear photo of your palm to receive a chiromancy reading based on
        hand shape, major lines, mounts, and your birth profile. Use your right hand
        for active traits and left hand for innate potential.
      </p>

      <div className="palm-upload-section">
        <div className="palm-hand-selector">
          <span className="palm-hand-label">Which hand?</span>
          <div className="palm-hand-buttons">
            <button
              type="button"
              className={`btn btn-secondary palm-hand-btn${handSide === 'left' ? ' active' : ''}`}
              onClick={() => setHandSide('left')}
              aria-pressed={handSide === 'left'}
            >
              Left Hand
            </button>
            <button
              type="button"
              className={`btn btn-secondary palm-hand-btn${handSide === 'right' ? ' active' : ''}`}
              onClick={() => setHandSide('right')}
              aria-pressed={handSide === 'right'}
            >
              Right Hand
            </button>
          </div>
        </div>

        <div
          className={`palm-dropzone${dragOver ? ' drag-over' : ''}${previewUrl ? ' has-preview' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload palm image"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_PALM_IMAGE_TYPES.join(',')}
            onChange={handleInputChange}
            className="palm-file-input"
            aria-hidden="true"
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Palm preview" className="palm-dropzone-preview" />
          ) : (
            <div className="palm-dropzone-placeholder">
              <span className="palm-upload-icon">📷</span>
              <p>Drop your palm image here or click to browse</p>
              <p className="palm-upload-hint">JPEG, PNG, or WebP — max 5 MB</p>
            </div>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="palm-upload-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selectedFile || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? 'Analyzing…' : 'Analyze Palm'}
          </button>
          {(selectedFile || reading) && (
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {reading && previewUrl && <PalmReadingResults reading={reading} previewUrl={previewUrl} />}

      <p className="palm-disclaimer">
        Palm readings are for entertainment and self-reflection. They complement — but do not
        replace — professional advice for health, finance, or legal matters.
      </p>
    </section>
  );
}
