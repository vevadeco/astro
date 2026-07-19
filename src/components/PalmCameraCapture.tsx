import { useCallback, useEffect, useRef, useState } from 'react';
import {
  captureVideoFrame,
  palmCameraConstraints,
} from '../utils/cameraUtils';
import type { HandSide } from '../services/palmistryService';

interface PalmCameraCaptureProps {
  handSide: HandSide;
  onCapture: (file: File) => void;
  onClose: () => void;
}

function PalmGuideOverlay({ handSide }: { handSide: HandSide }) {
  const mirror = handSide === 'left';
  return (
    <div className="palm-camera-overlay" aria-hidden="true">
      <div className="palm-camera-vignette" />
      <div className={`palm-guide-container${mirror ? ' mirrored' : ''}`}>
        <svg
          className="palm-guide-svg"
          viewBox="0 0 200 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Palm outline */}
          <path
            d="M100 255 C55 255 30 220 30 175 C30 145 38 120 50 100
               C42 85 40 65 48 50 C56 35 72 28 88 32
               C92 18 98 8 100 8 C102 8 108 18 112 32
               C128 28 144 35 152 50 C160 65 158 85 150 100
               C162 120 170 145 170 175 C170 220 145 255 100 255Z"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            fill="rgba(255,255,255,0.06)"
          />
          {/* Finger separators */}
          <line x1="58" y1="100" x2="52" y2="42" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="78" y1="95" x2="78" y2="28" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="100" y1="92" x2="100" y2="18" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="122" y1="95" x2="122" y2="28" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="142" y1="100" x2="148" y2="42" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="4 4" />
          {/* Major line hints */}
          <path d="M35 175 Q100 195 165 175" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" strokeDasharray="5 5" />
          <path d="M50 130 Q100 150 150 125" stroke="rgba(167,139,250,0.5)" strokeWidth="1.5" strokeDasharray="5 5" />
          <path d="M55 200 Q75 120 85 55" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeDasharray="5 5" />
          {/* Corner brackets */}
          <path d="M20 40 L20 20 L40 20" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
          <path d="M180 40 L180 20 L160 20" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
          <path d="M20 240 L20 260 L40 260" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
          <path d="M180 240 L180 260 L160 260" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
        </svg>
        <p className="palm-guide-label">Align palm here</p>
      </div>
    </div>
  );
}

export function PalmCameraCapture({ handSide, onCapture, onClose }: PalmCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(palmCameraConstraints());
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setError(
            'Camera access was denied or unavailable. Allow camera permission in your browser settings, or upload a photo instead.',
          );
        }
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || !ready || capturing) return;
    setCapturing(true);
    try {
      const file = await captureVideoFrame(video, `palm-${handSide}.jpg`);
      stopCamera();
      onCapture(file);
    } catch {
      setError('Could not capture the photo. Please try again.');
      setCapturing(false);
    }
  };

  const handLabel = handSide === 'left' ? 'left' : 'right';

  return (
    <div className="palm-camera-modal" role="dialog" aria-modal="true" aria-label="Palm camera">
      <video
        ref={videoRef}
        className="palm-camera-video"
        playsInline
        muted
        autoPlay
      />

      <PalmGuideOverlay handSide={handSide} />

      <div className="palm-camera-top-bar">
        <button
          type="button"
          className="palm-camera-close"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          aria-label="Close camera"
        >
          ✕
        </button>
        <div className="palm-camera-instructions">
          <p className="palm-camera-title">Photograph your {handLabel} palm</p>
          <p className="palm-camera-hint">
            Spread fingers naturally and align your palm within the guide
          </p>
        </div>
      </div>

      {error ? (
        <div className="palm-camera-error-panel">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <div className="palm-camera-controls">
          <button
            type="button"
            className="palm-capture-btn"
            onClick={handleCapture}
            disabled={!ready || capturing}
            aria-label="Capture palm photo"
          >
            <span className="palm-capture-ring" />
          </button>
        </div>
      )}
    </div>
  );
}
