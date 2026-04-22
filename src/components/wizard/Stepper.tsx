'use client';

import { useCertStore } from '@/store/useCertStore';
import { cn } from '@/lib/utils';
import { Check, Upload, Users, Settings, Download } from 'lucide-react';

const steps = [
  { id: 1, label: 'Upload Template', icon: Upload },
  { id: 2, label: 'Add Names', icon: Users },
  { id: 3, label: 'Configure', icon: Settings },
  { id: 4, label: 'Preview & Export', icon: Download },
];

export default function Stepper() {
  const { currentStep, setStep, templateImage, names } = useCertStore();

  const canNavigate = (stepId: number) => {
    if (stepId === 1) return true;
    if (stepId === 2) return !!templateImage;
    if (stepId === 3) return !!templateImage && names.length > 0;
    if (stepId === 4) return !!templateImage && names.length > 0; // usually you can only go to 4 if bounding box exists, but let's keep it simple
    return false;
  };

  return (
    <div className="w-full bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/20">
              S
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-foreground">SimplyCert</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Batch Certificate Generator
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto xl:flex-1 xl:justify-end xl:pl-10">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const navigable = canNavigate(step.id);
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex min-w-max items-center xl:flex-1">
                <button
                  onClick={() => navigable && setStep(step.id)}
                  disabled={!navigable}
                  className={cn(
                    'flex items-center gap-3 group transition-all duration-300',
                    navigable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0',
                      isActive &&
                        'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 scale-110',
                      isCompleted &&
                        'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/25',
                      !isActive &&
                        !isCompleted &&
                        'bg-muted text-muted-foreground group-hover:bg-muted/80'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p
                      className={cn(
                        'text-xs font-medium tracking-wide uppercase',
                        isActive ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'
                      )}
                    >
                      Step {step.id}
                    </p>
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="mx-4 hidden w-10 xl:block xl:flex-1">
                    <div
                      className={cn(
                        'h-0.5 rounded-full transition-all duration-500',
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-violet-500'
                          : 'bg-border'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
