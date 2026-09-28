import React, { useRef, useEffect, useState } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { Activity, BarChart2, Compass } from 'lucide-react';

export type VisualizerMode = 'oscilloscope' | 'spectrum' | 'goniometer';

interface VisualizerProps {
  className?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<VisualizerMode>('oscilloscope');
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const timeBuffer = new Float32Array(1024);
    const freqBuffer = new Uint8Array(128);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark graphite glass background
      ctx.fillStyle = '#0d1015';
      ctx.fillRect(0, 0, width, height);

      // Subtle grid overlay
      ctx.strokeStyle = '#181d26';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Horizontal center & grid lines
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(0, height / 4);
      ctx.lineTo(width, height / 4);
      ctx.moveTo(0, (height * 3) / 4);
      ctx.lineTo(width, (height * 3) / 4);
      // Vertical grid lines
      for (let x = width / 6; x < width; x += width / 6) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      if (mode === 'oscilloscope') {
        audioEngine.getWaveformData(timeBuffer);

        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#ff884d';
        ctx.shadowColor = 'rgba(255, 122, 61, 0.7)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = width / timeBuffer.length;
        let x = 0;

        for (let i = 0; i < timeBuffer.length; i++) {
          const v = timeBuffer[i];
          const y = (height / 2) + v * (height * 0.42);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

      } else if (mode === 'spectrum') {
        audioEngine.getFrequencyData(freqBuffer);

        const numBars = 48;
        const barWidth = (width / numBars) - 2;

        for (let i = 0; i < numBars; i++) {
          const val = freqBuffer[Math.floor(i * 1.5)] || 0;
          const barHeight = (val / 255) * (height * 0.85);
          const x = i * (barWidth + 2) + 2;
          const y = height - barHeight;

          // Gradient from warm amber to electric copper
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#e05a1e');
          grad.addColorStop(0.6, '#ff884d');
          grad.addColorStop(1, '#fbbf24');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Top peak cap
          ctx.fillStyle = '#fde68a';
          ctx.fillRect(x, Math.max(0, y - 2), barWidth, 2);
        }

      } else if (mode === 'goniometer') {
        // Lissajous stereo phase & width plot
        audioEngine.getWaveformData(timeBuffer);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.min(cx, cy) * 0.85;

        for (let i = 0; i < timeBuffer.length - 1; i += 2) {
          const left = timeBuffer[i];
          const right = timeBuffer[i + 1] || timeBuffer[i];
          // Rotate 45 degrees for standard M/S goniometer
          const mid = (left + right) * 0.707;
          const side = (left - right) * 0.707;

          const px = cx + side * maxRadius;
          const py = cy - mid * maxRadius;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [mode]);

  return (
    <div className={`relative bg-neutral-950 border border-neutral-800/80 rounded-lg overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Visualizer header & mode tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#12161f] border-b border-neutral-800 text-xs">
        <span className="font-mono text-[10px] tracking-wider text-neutral-400 font-semibold uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Real-Time Phosphor Stream
        </span>

        <div className="flex items-center gap-1 bg-neutral-900/90 p-0.5 rounded border border-neutral-800">
          <button
            onClick={() => setMode('oscilloscope')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'oscilloscope'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Oscilloscope (Time Domain)"
          >
            <Activity className="w-3 h-3" />
            Wave
          </button>
          <button
            onClick={() => setMode('spectrum')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'spectrum'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Spectrum Analyzer (FFT)"
          >
            <BarChart2 className="w-3 h-3" />
            FFT
          </button>
          <button
            onClick={() => setMode('goniometer')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              mode === 'goniometer'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Stereo Goniometer (Lissajous)"
          >
            <Compass className="w-3 h-3" />
            Phase
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={380}
        height={130}
        className="w-full h-full block"
      />
    </div>
  );
};
