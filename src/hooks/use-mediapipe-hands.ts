"use client";

import { useCallback, useRef, useState } from "react";

interface HandDetectionResult {
  handsDetected: boolean;
  confidence: number;
}

export function useMediaPipeHands() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const validateHandInImage = useCallback(async (imageFile: File): Promise<HandDetectionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Basic file validation
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Check file size (10MB max)
      const maxFileSize = 10 * 1024 * 1024;
      if (imageFile.size > maxFileSize) {
        throw new Error('Image file is too large. Maximum size is 10MB.');
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Implement actual MediaPipe Hands detection
      // For now, return a mock positive result for development
      return {
        handsDetected: true,
        confidence: 0.95
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Hand detection failed';
      setError(errorMessage);
      return {
        handsDetected: false,
        confidence: 0
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const captureFromCamera = useCallback(async (): Promise<File | null> => {
    setIsLoading(true);
    setError(null);

    let stream: MediaStream | null = null;

    try {
      // Request camera access with error handling
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      }).catch((err) => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          throw new Error('No camera device found. Please ensure your device has a camera.');
        } else if (err.name === 'NotReadableError') {
          throw new Error('Camera is in use by another application. Please close other apps using your camera.');
        }
        throw err;
      });

      streamRef.current = stream;

      return new Promise((resolve, reject) => {
        // Create video element for camera preview
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.position = 'fixed';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.transform = 'translate(-50%, -50%)';
        video.style.width = '90vw';
        video.style.maxWidth = '400px';
        video.style.height = 'auto';
        video.style.zIndex = '9999';
        video.style.borderRadius = '12px';
        video.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';

        // Create overlay with palm frame guide
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.flexDirection = 'column';

        // Create palm frame guide
        const palmFrame = document.createElement('div');
        palmFrame.style.position = 'absolute';
        palmFrame.style.width = '200px';
        palmFrame.style.height = '250px';
        palmFrame.style.border = '3px solid #10b981';
        palmFrame.style.borderRadius = '50px 50px 20px 20px';
        palmFrame.style.background = 'rgba(16, 185, 129, 0.1)';
        palmFrame.style.zIndex = '10000';
        palmFrame.style.pointerEvents = 'none';

        // Create instructions
        const instructions = document.createElement('div');
        instructions.style.position = 'absolute';
        instructions.style.bottom = '20px';
        instructions.style.left = '50%';
        instructions.style.transform = 'translateX(-50%)';
        instructions.style.color = 'white';
        instructions.style.textAlign = 'center';
        instructions.style.fontSize = '16px';
        instructions.style.zIndex = '10001';
        instructions.innerHTML = `
          <div style="margin-bottom: 16px; font-weight: 600;">Position your palm in the green frame</div>
          <div style="margin-bottom: 16px; font-size: 14px; opacity: 0.8;">• Open your hand fully<br>• Keep palm flat and facing camera<br>• Ensure good lighting</div>
        `;

        // Create capture button
        const captureBtn = document.createElement('button');
        captureBtn.style.position = 'absolute';
        captureBtn.style.bottom = '80px';
        captureBtn.style.left = '50%';
        captureBtn.style.transform = 'translateX(-50%)';
        captureBtn.style.padding = '12px 24px';
        captureBtn.style.backgroundColor = '#10b981';
        captureBtn.style.color = 'white';
        captureBtn.style.border = 'none';
        captureBtn.style.borderRadius = '8px';
        captureBtn.style.fontSize = '16px';
        captureBtn.style.fontWeight = '600';
        captureBtn.style.cursor = 'pointer';
        captureBtn.style.zIndex = '10001';
        captureBtn.textContent = 'Capture Photo';

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.width = '40px';
        closeBtn.style.height = '40px';
        closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '10001';
        closeBtn.innerHTML = '×';

        // Append elements to overlay
        overlay.appendChild(video);
        overlay.appendChild(palmFrame);
        overlay.appendChild(instructions);
        overlay.appendChild(captureBtn);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          document.body.removeChild(overlay);
          stream?.getTracks().forEach(track => track.stop());
          reject(new Error('Camera capture timeout. Please try again.'));
        }, 30000);

        const cleanup = () => {
          clearTimeout(timeoutId);
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
          stream?.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        };

        // Close button handler
        closeBtn.onclick = () => {
          cleanup();
          reject(new Error('Camera capture cancelled'));
        };

        // Capture button handler
        captureBtn.onclick = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }

            ctx.drawImage(video, 0, 0);
            cleanup();
            
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], 'palm-photo.jpg', { type: 'image/jpeg' });
                resolve(file);
              } else {
                reject(new Error('Failed to capture image from camera'));
              }
            }, 'image/jpeg', 0.9);
          } catch (err) {
            cleanup();
            reject(err);
          }
        };

        video.onloadedmetadata = () => {
          // Video is ready, user can now capture
        };

        video.onerror = () => {
          stream?.getTracks().forEach(track => track.stop());
          reject(new Error('Failed to load camera stream'));
        };
      });
    } catch (err) {
      // Clean up stream on error
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      streamRef.current = null;

      const errorMessage = err instanceof Error ? err.message : 'Camera capture failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  return {
    validateHandInImage,
    captureFromCamera,
    isLoading,
    error,
    cleanup,
  };
}
