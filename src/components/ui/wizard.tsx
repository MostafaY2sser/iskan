import React from 'react';
import { cn } from '@/lib/utils';

interface WizardStepProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const WizardStep: React.FC<WizardStepProps> = ({ step, title, isActive, isCompleted }) => (

  
  <div className="flex items-center gap-2">
    <div 
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
        isCompleted ? "bg-primary text-primary-foreground" : 
        isActive ? "bg-primary text-primary-foreground" :
        "bg-muted text-muted-foreground"
      )}
    >
      {isCompleted ? "✓" : step}
    </div>
    <div 
      className={cn(
        "text-sm font-medium transition-colors duration-300 hidden sm:block",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {title}
    </div>
  </div>
);

interface WizardProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Wizard: React.FC<WizardProps> = ({ steps, currentStep, className }) => (
  <div className={cn("flex items-center justify-center gap-3", className)}>
    {steps.map((title, index) => (
      <React.Fragment key={index}>
        <WizardStep
          step={index + 1}
          title={title}
          isActive={currentStep === index}
          isCompleted={currentStep > index}
        />
        {index < steps.length - 1 && (
          <div 
            className={cn(
              "w-8 h-0.5 transition-colors duration-300",
              currentStep > index ? "bg-primary" : "bg-muted"
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);