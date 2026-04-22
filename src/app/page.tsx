'use client';

import { useCertStore } from '@/store/useCertStore';
import Stepper from '@/components/wizard/Stepper';
import Step1Upload from '@/components/steps/Step1Upload';
import Step2Names from '@/components/steps/Step2Names';
import Step3Configure from '@/components/steps/Step3Configure';
import Step4Preview from '@/components/steps/Step4Preview';
import LandingPage from '@/components/landing/LandingPage';
import { Toaster } from 'sonner';

export default function Home() {
  const { currentStep } = useCertStore();

  return (
    <>
      <Toaster
        position="bottom-left"
        richColors
        duration={7000}
        toastOptions={{
          style: {
            borderRadius: '12px',
          },
        }}
      />

      <div className="flex flex-col h-screen overflow-hidden">
        {currentStep > 0 && <Stepper />}

        <main className="flex-1 overflow-auto">
          {currentStep === 0 && <LandingPage />}
          {currentStep === 1 && <Step1Upload />}
          {currentStep === 2 && (
            <div className="flex-1 flex items-start justify-center px-6 py-12">
              <Step2Names />
            </div>
          )}
          {currentStep === 3 && <Step3Configure />}
          {currentStep === 4 && <Step4Preview />}
        </main>

        {/* Footer */}
        {currentStep !== 3 && currentStep !== 4 && (
          <footer className="text-center py-3 text-xs text-muted-foreground border-t border-border/30">
            <p>SimplyCert — Free bulk certificate generator. Works in your browser with no data uploaded.</p>
          </footer>
        )}
      </div>
    </>
  );
}
