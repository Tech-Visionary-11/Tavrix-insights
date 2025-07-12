import { useState } from "react";
import { Card } from "../../libs/components/ui/cards/Card";
import { Button } from "../../libs/components/ui/button/Button";
import { AgentInfoTab } from "./tabs/AgentInfoTab";
import { ModelConfigTab } from "./tabs/ModelConfigTab";
import { AlertingTab } from "./tabs/AlertingTab";
import { Stepper } from "../../libs/components/ui/stepper/Stepper";
import type { AgentFormData } from "./AgentsTypes";

const steps = ["Agent Info", "Model Setup", "Alert Rules"];

export function AgentForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (values: any) => void;
  initialData?: AgentFormData | null;
}) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const next  = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back  = () => setStep((s) => Math.max(s - 1, 0));
  const save  = (data: any) => setFormData((p) => ({ ...p, ...data }));
  const skipStep = () => next();
  const skipAndSubmit = () => onSubmit(formData); // use whatever is available

  return (
    <Card className="px-6 py-8">
      {/* Step indicator */}
      <Stepper steps={steps} active={step} />

      {/* Step content */}
      {step === 0 && <AgentInfoTab data={formData} onNext={save} />}
      {step === 1 && <ModelConfigTab data={formData} onNext={save} />}
      {step === 2 && <AlertingTab data={formData} onSubmit={onSubmit} />}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center border-t pt-6 mt-8">
        {/* Back button or placeholder */}
        {step > 0 ? <Button onClick={back}>Back</Button> : <span />}

        {/* Right-aligned control group */}
        <div className="flex gap-3">
          {/* Step 1 (Model Setup): show Skip beside Next */}
          {step === 1 && (
            <>
              <Button variant="secondary" onClick={skipStep}>
                Skip
              </Button>
              <Button onClick={next}>Next</Button>
            </>
          )}

          {/* Step 2 (Final): show Skip & Save and Finish */}
          {step === 2 && (
            <>
              <Button variant="secondary" onClick={skipAndSubmit}>
                Skip & Save
              </Button>
              <Button onClick={() => onSubmit(formData)}>Finish</Button>
            </>
          )}

          {/* Step 0: just Next */}
          {step === 0 && <Button onClick={next}>Next</Button>}
        </div>
      </div>
    </Card>
  );
}
