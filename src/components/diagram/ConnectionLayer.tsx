import React from 'react';
import { useApp } from '../../context/AppContext';

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
  const { lineStyle } = useApp();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {lines.map((line) => {
        if (line.opacity <= 0) return null;

        let pathD = '';
        if (lineStyle === 'straight') {
          // Straight line path
          pathD = `M ${line.startX} ${line.startY} L ${line.endX} ${line.endY}`;
        } else {
          // Bezier curve path (bezier-star or static)
          const dx = Math.abs(line.endX - line.startX);
          const cp1X = line.startX + dx * 0.45;
          const cp1Y = line.startY;
          const cp2X = line.endX - dx * 0.45;
          const cp2Y = line.endY;
          pathD = `M ${line.startX} ${line.startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${line.endX} ${line.endY}`;
        }

        const showParticles = line.isFlowing && lineStyle !== 'static';

        return (
          <g key={line.id} className="transition-all duration-300">
            {/* Background Glow Path (If flowing and not static) */}
            {line.isFlowing && lineStyle !== 'static' && (
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
              className={`transition-all duration-300 ${line.isFlowing && lineStyle !== 'static' ? 'flow-line' : ''}`}
            />

            {/* Animated Flowing Particles (Hardware accelerated via native SVG animateMotion) */}
            {showParticles && (
              <>
                {lineStyle === 'bezier-star' ? (
                  <>
                    {/* High-Tech 4-point Star 1 */}
                    <g className="flow-star-anim">
                      <polygon
                        points="0,-6 1.2,-1.2 6,0 1.2,1.2 0,6 -1.2,1.2 -6,0 -1.2,-1.2"
                        fill="#FFED00"
                        className="filter drop-shadow-[0_0_4px_#FFED00]"
                      >
                        <animateMotion
                          dur="2.4s"
                          repeatCount="indefinite"
                          path={pathD}
                          rotate="auto"
                        />
                      </polygon>
                    </g>
                    
                    {/* High-Tech 4-point Star 2 (Delayed) */}
                    <g className="flow-star-anim" style={{ opacity: 0.6 }}>
                      <polygon
                        points="0,-4 0.8,-0.8 4,0 0.8,0.8 0,4 -0.8,0.8 -4,0 -0.8,-0.8"
                        fill="#E5C78F"
                        className="filter drop-shadow-[0_0_2px_#E5C78F]"
                      >
                        <animateMotion
                          dur="2.4s"
                          begin="1.0s"
                          repeatCount="indefinite"
                          path={pathD}
                          rotate="auto"
                        />
                      </polygon>
                    </g>
                  </>
                ) : (
                  <>
                    {/* Standard Circle Particle 1 */}
                    <circle r="3" fill="#FFED00" className="filter drop-shadow-[0_0_3px_#FFED00]">
                      <animateMotion
                        dur="1.8s"
                        repeatCount="indefinite"
                        path={pathD}
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                    
                    {/* Standard Circle Particle 2 (Delayed) */}
                    <circle r="2.2" fill="#FFFFFF" className="filter drop-shadow-[0_0_2px_#FFFFFF]">
                      <animateMotion
                        dur="1.8s"
                        begin="0.9s"
                        repeatCount="indefinite"
                        path={pathD}
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                  </>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default ConnectionLayer;
