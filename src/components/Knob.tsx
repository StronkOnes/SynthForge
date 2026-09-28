import React, { useState, useRef, useEffect, useCallback } from 'react';

interface KnobProps {
  label: string;
  value: number; // 0 to 1 (normalized) or custom min/max
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'giant';
  color?: 'copper' | 'amber' | 'cyan' | 'slate';
  onChange: (val: number) => void;
  displayValue?: (val: number) => string;
}

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  defaultValue = 0.5,
  step = 0.01,
  unit = '',
  size = 'md',
  color = 'copper',
  onChange,
  displayValue
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartVal = useRef(value);

  const normalized = (value - min) / (max - min);
  // Angle: -135deg to +135deg (total 270deg rotation)
  const angle = -135 + normalized * 270;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartVal.current = value;
  };

  const handleDoubleClick = () => {
    onChange(defaultValue);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * (max - min) * 0.04;
    const newVal = Math.max(min, Math.min(max, value + delta));
    onChange(Number(newVal.toFixed(3)));
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartY.current - e.clientY;
    const range = max - min;
    const change = (deltaY / 150) * range;
    let newVal = dragStartVal.current + change;
    newVal = Math.max(min, Math.min(max, newVal));
    if (step) {
      newVal = Math.round(newVal / step) * step;
    }
    onChange(Number(newVal.toFixed(3)));
  }, [isDragging, max, min, step, onChange]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [isDragging, onMouseMove, onMouseUp]);

  // Dimension presets
  const sizeConfig = {
    sm: { size: 36, stroke: 3, font: 'text-[9px]', labelFont: 'text-[9px]' },
    md: { size: 48, stroke: 4, font: 'text-[10px]', labelFont: 'text-[10px]' },
    lg: { size: 64, stroke: 5, font: 'text-xs', labelFont: 'text-xs' },
    giant: { size: 104, stroke: 7, font: 'text-sm font-semibold', labelFont: 'text-xs font-bold' }
  }[size];

  const colorConfig = {
    copper: {
      arc: '#ff7a3d',
      glow: 'rgba(255, 122, 61, 0.4)',
      knobFace: '#1c1f26',
      indicator: '#ff955c'
    },
    amber: {
      arc: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)',
      knobFace: '#1c1e24',
      indicator: '#fde68a'
    },
    cyan: {
      arc: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.4)',
      knobFace: '#141e28',
      indicator: '#7dd3fc'
    },
    slate: {
      arc: '#94a3b8',
      glow: 'rgba(148, 163, 184, 0.3)',
      knobFace: '#181b22',
      indicator: '#cbd5e1'
    }
  }[color];

  const radius = sizeConfig.size / 2 - sizeConfig.stroke - 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength * (1 - normalized);

  const formattedDisplay = displayValue ? displayValue(value) : (
    max <= 1 ? `${Math.round(normalized * 100)}%` : `${value.toFixed(1)}${unit}`
  );

  return (
    <div
      className="flex flex-col items-center select-none group cursor-ns-resize"
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
      title={`${label}: ${formattedDisplay} (Drag vertically, scroll, or double-click to reset)`}
    >
      <div className="relative flex items-center justify-center">
        {/* SVG Radial Arc Track & Value Arc */}
        <svg
          width={sizeConfig.size}
          height={sizeConfig.size}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            cx={sizeConfig.size / 2}
            cy={sizeConfig.size / 2}
            r={radius}
            fill="none"
            stroke="#1e232d"
            strokeWidth={sizeConfig.stroke}
            strokeDasharray={arcLength}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transform rotate-[135deg] origin-center"
          />
          {/* Active Colored Arc */}
          <circle
            cx={sizeConfig.size / 2}
            cy={sizeConfig.size / 2}
            r={radius}
            fill="none"
            stroke={colorConfig.arc}
            strokeWidth={sizeConfig.stroke}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transform rotate-[135deg] origin-center transition-all duration-75"
            style={{
              filter: isDragging ? `drop-shadow(0 0 6px ${colorConfig.glow})` : undefined
            }}
          />
        </svg>

        {/* Tactile Rotary Dial Body */}
        <div
          className="absolute rounded-full shadow-inner flex items-center justify-center transition-transform duration-75"
          style={{
            width: sizeConfig.size - sizeConfig.stroke * 2 - 8,
            height: sizeConfig.size - sizeConfig.stroke * 2 - 8,
            backgroundColor: colorConfig.knobFace,
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.06), 0 4px 8px rgba(0,0,0,0.6)',
            transform: `rotate(${angle}deg)`
          }}
        >
          {/* Radial position indicator notch */}
          <div
            className="w-1 rounded-full absolute top-1"
            style={{
              height: sizeConfig.size > 60 ? '8px' : '5px',
              backgroundColor: colorConfig.indicator,
              boxShadow: `0 0 4px ${colorConfig.glow}`
            }}
          />
        </div>
      </div>

      {/* Label and Value */}
      <span className={`mt-1 font-mono tracking-wider uppercase text-neutral-400 font-medium ${sizeConfig.labelFont} group-hover:text-neutral-200 transition-colors`}>
        {label}
      </span>
      <span className={`font-mono text-neutral-500 font-medium ${sizeConfig.font} group-hover:text-amber-400 transition-colors`}>
        {formattedDisplay}
      </span>
    </div>
  );
};
