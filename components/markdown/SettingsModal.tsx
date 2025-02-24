import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCheck, FaChevronDown, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LLM_OPTIONS = [
  { value: "gpt-4o", label: "gpt-4o" },
  { value: "claude-3.5-sonnet", label: "claude-3.5-sonnet" },
  { value: "o1", label: "o1" },
];

const PERSONA_PRESETS = [
  {
    value: "academic",
    label: "Academic Reviewer",
    prompt:
      "You are an academic reviewer with expertise in HCI and AI. Review the content for academic rigor, technical accuracy, methodology, theoretical framework, and provide constructive feedback for strengthening academic arguments.",
  },
  {
    value: "technical",
    label: "Technical Expert",
    prompt:
      "You are a technical expert focusing on system architecture and implementation details. Review the content for technical accuracy and implementation feasibility.",
  },
  {
    value: "general",
    label: "General Editor",
    prompt:
      "You are a professional editor focusing on clarity, coherence, and overall readability of the content.",
  },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const academicPreset = PERSONA_PRESETS[0];
  const [selectedLLM, setSelectedLLM] = useState(LLM_OPTIONS[0].value);
  const [apiKey, setApiKey] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(academicPreset.value);
  const [customPrompt, setCustomPrompt] = useState(academicPreset.prompt);

  const handlePersonaChange = (value: string) => {
    setSelectedPersona(value);
    if (value !== "custom") {
      const preset = PERSONA_PRESETS.find((p) => p.value === value);
      setCustomPrompt(preset?.prompt || "");
    }
  };

  const handleSave = () => {
    // TODO: Implement actual save logic
    toast.success("Settings saved successfully", {
      duration: 2000,
      position: "top-center",
      style: {
        marginTop: "80px",
        background: "#4B5563",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "8px",
        fontSize: "14px",
      },
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {/* LLM Selection */}
                  <div>
                    <Listbox value={selectedLLM} onChange={setSelectedLLM}>
                      <div className="relative">
                        <Listbox.Label className="block text-sm font-medium text-gray-700">
                          Language Model
                        </Listbox.Label>
                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <span className="block truncate">
                            {
                              LLM_OPTIONS.find(
                                (opt) => opt.value === selectedLLM
                              )?.label
                            }
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <FaChevronDown className="h-4 w-4 text-gray-400" />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {LLM_OPTIONS.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-blue-100 text-blue-900"
                                      : "text-gray-900"
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <FaCheck className="h-4 w-4" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your API key"
                    />
                  </div>

                  {/* Persona Selection */}
                  <Listbox
                    value={selectedPersona}
                    onChange={handlePersonaChange}
                  >
                    <div className="relative">
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Reviewer Persona
                      </Listbox.Label>
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <span className="block truncate">
                          {
                            [
                              ...PERSONA_PRESETS,
                              { value: "custom", label: "Custom" },
                            ].find((opt) => opt.value === selectedPersona)
                              ?.label
                          }
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <FaChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {[
                            ...PERSONA_PRESETS,
                            { value: "custom", label: "Custom" },
                          ].map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-100 text-blue-900"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <FaCheck className="h-4 w-4" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>

                  {/* Custom Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Persona Prompt
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter custom prompt..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
