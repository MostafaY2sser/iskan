import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

interface SwitchEnhancedProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
  description?: string;
  showStatus?: boolean;
}

const SwitchEnhanced = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchEnhancedProps
>(({ className, label, description, showStatus = false, checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleChange = (value: boolean) => {
    setIsChecked(value);
    if (onCheckedChange) {
      onCheckedChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="flex-1">
          {label && <label className="text-base font-medium">{label}</label>}
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      <div className="flex items-center gap-2">
        {showStatus && (
          <span className="text-xs text-gray-500">
            {isChecked ? 'مفعل' : 'معطل'}
          </span>
        )}
        <SwitchPrimitives.Root
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
            className
          )}
          checked={isChecked}
          onCheckedChange={handleChange}
          {...props}
          ref={ref}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
              "rtl:data-[state=checked]:-translate-x-5 rtl:data-[state=unchecked]:translate-x-0"
            )}
          />
        </SwitchPrimitives.Root>
      </div>
    </div>
  );
});

SwitchEnhanced.displayName = "SwitchEnhanced"

export { SwitchEnhanced }
