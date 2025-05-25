"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { useEntities } from "@/hooks/use-entities";
import { useRouter } from "next/navigation";
import { useCreateContext } from "@/hooks/use-create-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface ListEntity {
  entity_id: string;
  name: string;
  type: string;
  organization: string;
  documentIds: string[];
  contextIds: string[];
  createdAt: string;
}

enum Step {
  Startups = 0,
  Mentors = 1,
  Confirm = 2,
}

export default function NewCohortPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(Step.Startups);
  const [selectedStartups, setSelectedStartups] = useState<string[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [cohortName, setCohortName] = useState("");
  const [startupSearch, setStartupSearch] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch startups and mentors
  const { data: startupsData, isLoading: startupsLoading } = useEntities("startup");
  const { data: mentorsData, isLoading: mentorsLoading } = useEntities("mentor");
  const createContextMutation = useCreateContext();

  // Filtered lists
  const filteredStartups = useMemo(() => {
    if (!startupsData?.results) return [];
    return startupsData.results.filter((entity) =>
      entity.name.toLowerCase().includes(startupSearch.toLowerCase())
    );
  }, [startupsData, startupSearch]);

  const filteredMentors = useMemo(() => {
    if (!mentorsData?.results) return [];
    return mentorsData.results.filter((entity) =>
      entity.name.toLowerCase().includes(mentorSearch.toLowerCase())
    );
  }, [mentorsData, mentorSearch]);

  // Handlers
  function handleStartupToggle(id: string) {
    setSelectedStartups((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }
  function handleMentorToggle(id: string) {
    setSelectedMentors((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  }
  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");
    try {
      const context = await createContextMutation.trigger({
        name: cohortName || "Untitled Cohort",
        prompt: "Cohort created via UI", // TODO: Replace with actual prompt from user input if available
        entity_ids: [...selectedStartups, ...selectedMentors],
      });
      router.push(`/contexts/${context.context_id}`);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Failed to create cohort.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Step panels
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Cohort</h1>
      <Stepper step={step} />
      <div className="relative min-h-[360px]">
        {/* Step 1: Choose Startups */}
        <FadePanel show={step === Step.Startups}>
          <StepPanel
            title="1. Choose Startups"
            description="Select the startups to include in this cohort."
            searchValue={startupSearch}
            onSearchChange={setStartupSearch}
            entities={filteredStartups}
            selectedIds={selectedStartups}
            onToggle={handleStartupToggle}
            loading={startupsLoading}
            entityType="startup"
          />
          <div className="flex justify-end mt-6 gap-2">
            <Button variant="ghost" onClick={() => router.push("/contexts")}>Cancel</Button>
            <Button
              onClick={() => setStep(Step.Mentors)}
              disabled={selectedStartups.length === 0}
            >
              Next: Mentors
            </Button>
          </div>
        </FadePanel>
        {/* Step 2: Choose Mentors */}
        <FadePanel show={step === Step.Mentors}>
          <StepPanel
            title="2. Choose Mentors"
            description="Select the mentors for this cohort."
            searchValue={mentorSearch}
            onSearchChange={setMentorSearch}
            entities={filteredMentors}
            selectedIds={selectedMentors}
            onToggle={handleMentorToggle}
            loading={mentorsLoading}
            entityType="mentor"
          />
          <div className="flex justify-between mt-6 gap-2">
            <Button variant="ghost" onClick={() => setStep(Step.Startups)}>Back</Button>
            <Button
              onClick={() => setStep(Step.Confirm)}
              disabled={selectedMentors.length === 0}
            >
              Next: Confirm
            </Button>
          </div>
        </FadePanel>
        {/* Step 3: Confirm & Submit */}
        <FadePanel show={step === Step.Confirm}>
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">3. Confirm Cohort Details</h2>
            <p className="text-gray-600 mb-4">Review and confirm the cohort before creating.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cohort Name</label>
              <Input
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                placeholder="Enter a name for this cohort"
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Startups</h3>
              <ul className="pl-4 list-disc text-gray-700 text-sm">
                {selectedStartups.map((id) => {
                  const entity = startupsData?.results.find((e) => e.entity_id === id);
                  return entity ? <li key={id}>{entity.name}</li> : null;
                })}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Mentors</h3>
              <ul className="pl-4 list-disc text-gray-700 text-sm">
                {selectedMentors.map((id) => {
                  const entity = mentorsData?.results.find((e) => e.entity_id === id);
                  return entity ? <li key={id}>{entity.name}</li> : null;
                })}
              </ul>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex justify-between mt-6 gap-2">
              <Button variant="ghost" onClick={() => setStep(Step.Mentors)}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !cohortName || selectedStartups.length === 0 || selectedMentors.length === 0}
              >
                {(isSubmitting || createContextMutation.isMutating) ? "Creating..." : "Create Cohort"}
              </Button>
            </div>
          </div>
        </FadePanel>
      </div>
    </div>
  );
}

// Stepper UI
function Stepper({ step }: { step: Step }) {
  const steps = ["Startups", "Mentors", "Confirm"];
  return (
    <div className="flex justify-center mb-8 gap-4">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
              step === idx
                ? "bg-indigo-600 scale-110 shadow-lg"
                : step > idx
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          >
            {idx + 1}
          </div>
          <span className={`text-sm font-medium ${step === idx ? "text-indigo-700" : "text-gray-500"}`}>{label}</span>
          {idx < steps.length - 1 && <div className="w-8 h-1 bg-gray-200 rounded" />}
        </div>
      ))}
    </div>
  );
}

// Animated fade panel
function FadePanel({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500 ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!show}
    >
      {children}
    </div>
  );
}

// Step panel for entity selection
function StepPanel({
  title,
  description,
  searchValue,
  onSearchChange,
  entities,
  selectedIds,
  onToggle,
  loading,
  entityType,
}: {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  entities: ListEntity[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  loading: boolean;
  entityType: string;
}) {
  // Add select all for startups
  const allSelected = entities.length > 0 && selectedIds.length === entities.length;
  const isStartupPanel = entityType === "startup";
  const isMentorPanel = entityType === "mentor";
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Input
        value={searchValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        placeholder={`Search ${entityType}s...`}
        className="mb-4"
      />
      {(isStartupPanel || isMentorPanel) && (
        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => {
              if (allSelected) {
                entities.forEach((entity) => {
                  if (selectedIds.includes(entity.entity_id)) onToggle(entity.entity_id);
                });
              } else {
                entities.forEach((entity) => {
                  if (!selectedIds.includes(entity.entity_id)) onToggle(entity.entity_id);
                });
              }
            }}
            className="mr-2 accent-indigo-600"
          />
          <span className="text-sm">Select All</span>
        </div>
      )}
      <div className="max-h-56 overflow-y-auto border rounded-md">
        {loading ? (
          <div className="p-4">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ) : entities.length === 0 ? (
          <div className="p-4 text-gray-400">No {entityType}s found.</div>
        ) : (
          <ul>
            {entities.map((entity) => (
              <li
                key={entity.entity_id}
                className={`flex items-center px-4 py-2 border-b last:border-b-0 cursor-pointer transition-colors ${
                  selectedIds.includes(entity.entity_id)
                    ? "bg-indigo-50 text-indigo-900"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onToggle(entity.entity_id)}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entity.entity_id)}
                  onChange={() => onToggle(entity.entity_id)}
                  className="mr-3 accent-indigo-600"
                  tabIndex={-1}
                  readOnly
                />
                <span className="flex-1">{entity.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {selectedIds.length} {entityType}{selectedIds.length === 1 ? "" : "s"} selected
      </div>
    </div>
  );
}

