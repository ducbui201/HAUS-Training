import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ 
  name, 
  size = 20, 
  color = 'currentColor', 
  className = '' 
}) => {
  // Resolve component dynamically
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Fallback icon if not found
    const Fallback = Icons.HelpCircle;
    return <Fallback size={size} color={color} className={className} />;
  }
  
  return <IconComponent size={size} color={color} className={className} />;
};

export default LucideIcon;
