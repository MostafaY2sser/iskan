import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'tight' | 'wide';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className,
  size = 'default'
}) => {
  const sizeClasses = {
    tight: 'max-w-5xl',
    default: 'max-w-7xl',
    wide: 'max-w-8xl'
  };

  return (
    <div className={cn(
      'responsive-container',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  anchor?: boolean;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className,
  id,
  anchor = false
}) => {
  return (
    <section 
      id={id}
      className={cn(
        'py-fluid-lg px-fluid-md',
        anchor && 'anchor-offset',
        className
      )}
    >
      {children}
    </section>
  );
};