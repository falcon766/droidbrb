import React from 'react';
import { C } from '../design';

interface RobotLogoProps {
  color?: string;
  size?: number;
}

const RobotLogo: React.FC<RobotLogoProps> = ({ color = C.black, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Antenna nub — subtle sensor bump */}
    <rect x="10" y="1" width="4" height="3" rx="2" fill={color}/>
    {/* Head — rounded rectangle */}
    <rect x="3" y="4" width="18" height="17" rx="4.5" stroke={color} strokeWidth="1.5"/>
    {/* Visor band — the signature robotic element */}
    <rect x="6" y="10.5" width="12" height="2.5" rx="1.25" fill={color}/>
  </svg>
);

export default RobotLogo;
