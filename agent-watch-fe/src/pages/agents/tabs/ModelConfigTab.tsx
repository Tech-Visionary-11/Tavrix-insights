import { ModalConfigFields } from "./ModalConfigFields";

export function ModelConfigTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-2">
        <strong>This configuration applies to the agent as a whole.</strong> <br/>
        Each step can override these settings if needed.
      </p>
      <ModalConfigFields namePrefix="modal_config" showWrapper={true} />
    </div>
  );
}
