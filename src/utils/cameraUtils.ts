/** Whether the browser supports in-app camera capture via getUserMedia. */
export function isCameraSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

export type CameraAccessError = 'denied' | 'unavailable' | 'not_supported';

/** Request camera access. Must be called from a user gesture (e.g. click handler). */
export async function requestPalmCameraAccess(): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new Error('not_supported' satisfies CameraAccessError);
  }

  try {
    return await navigator.mediaDevices.getUserMedia(palmCameraConstraints());
  } catch (err) {
    if (err instanceof DOMException) {
      if (
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError'
      ) {
        throw new Error('denied' satisfies CameraAccessError);
      }
    }
    throw new Error('unavailable' satisfies CameraAccessError);
  }
}

export function cameraAccessErrorMessage(error: CameraAccessError): string {
  switch (error) {
    case 'denied':
      return 'Camera permission was denied. Tap "Take Palm Photo" again and allow camera access when prompted, or upload a photo instead.';
    case 'unavailable':
      return 'Camera is unavailable on this device. Please upload a photo instead.';
    case 'not_supported':
      return 'Your browser does not support in-app camera capture. Please upload a photo instead.';
  }
}

export function parseCameraAccessError(err: unknown): CameraAccessError {
  if (err instanceof Error) {
    if (err.message === 'denied' || err.message === 'unavailable' || err.message === 'not_supported') {
      return err.message;
    }
  }
  return 'unavailable';
}

/** Capture the current video frame as a JPEG File. */
export function captureVideoFrame(
  video: HTMLVideoElement,
  filename = 'palm-capture.jpg',
  quality = 0.92,
): Promise<File> {
  const { videoWidth, videoHeight } = video;
  if (!videoWidth || !videoHeight) {
    return Promise.reject(new Error('Video not ready'));
  }

  const canvas = document.createElement('canvas');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.reject(new Error('Canvas unavailable'));
  }
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Capture failed'));
          return;
        }
        resolve(new File([blob], filename, { type: 'image/jpeg' }));
      },
      'image/jpeg',
      quality,
    );
  });
}

/** Preferred rear-camera constraints for palm photography. */
export function palmCameraConstraints(): MediaStreamConstraints {
  return {
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  };
}
