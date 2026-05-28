import React from 'react';

export interface ConnectionLine {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke: string;
  width: number;
  opacity: number;
  isFlowing: boolean;
}

interface ConnectionLayerProps {
  lines: ConnectionLine[];
}

export const ConnectionLayer: React.FC<ConnectionLayerProps> = ({ lines }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {lines.map((line) => {
        if (line.opacity <= 0) return null;

        // Calculate control points for smooth cubic Bezier curve
        const dx = Math.abs(line.endX - line.startX);
        const cp1X = line.startX + dx * 0.4;
        const cp1Y = line.startY;
        const cp2X = line.endX - dx * 0.4;
        const cp2Y = line.endY;

        const pathD = `M ${line.startX} ${line.startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${line.endX} ${line.endY}`;

        return (
          <g key={line.id} className="transition-all duration-300">
            {/* Background Glow Path (If flowing) */}
            {line.isFlowing && (
              <path
                d={pathD}
                fill="none"
                stroke={line.stroke}
                strokeWidth={line.width + 3}
                strokeOpacity={0.2}
                className="blur-[2px]"
              />
            )}

            {/* Core Connection Path */}
            <path
              id={`path-${line.id}`}
              d={pathD}
              fill="none"
              stroke={line.stroke}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              className={`transition-all duration-300 ${line.isFlowing ? 'flow-line' : ''}`}
            />

            {/* Animated Flowing Particles (Hardware accelerated via native SVG animateMotion) */}
            {line.isFlowing && (
              <>
                {/* Particle 1 */}
                <circle r="3" fill="#FFED00" className="filter drop-shadow-[0_0_3px_#FFED00]">
                  <animateMotion
                    dur="1.8s"
                    repeatCount="indefinite"
                    path={pathD}
                    keyPoints="0;1"
                    keyTimes="0;1"
                  />
                </circle>
                
                {/* Particle 2 (Delayed) */}
                <circle r="2.5" fill="#FFED00" className="filter drop-shadow-[0_0_2px_#FFED00]">
                  <animateMotion
                    dur="1.8s"
                    begin="0.6s"
                    repeatCount="indefinite"
                    path={pathD}
                    keyPoints="0;1"
                    keyTimes="0;1"
                  />
                </circle>

                {/* Particle 3 (Delayed further) */}
                <circle r="2" fill="#FFFFFF" className="filter drop-shadow-[0_0_2px_#FFFFFF]">
                  <animateMotion
                    dur="1.8s"
                    begin="1.2s"
                    repeatCount="indefinite"
                    path={pathD}
                    keyPoints="0;1"
                    keyTimes="0;1"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default ConnectionLayer;
