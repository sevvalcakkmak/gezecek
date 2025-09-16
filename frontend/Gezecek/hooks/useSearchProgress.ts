import React from "react";
import { SearchStep } from "@/components/ui/search-modal";

export interface UseSearchProgressReturn {
  steps: SearchStep[];
  overallProgress: number;
  isSearching: boolean;
  startSearch: () => void;
  resetSearch: () => void;
}

const useSearchProgress = (): UseSearchProgressReturn => {
  // Define default search steps
  const defaultSteps: SearchStep[] = [
    {
      id: "flights",
      labelKey: "searchModal.steps.flights",
      status: "pending",
    },
    {
      id: "hotels",
      labelKey: "searchModal.steps.hotels",
      status: "pending",
    },
    {
      id: "itinerary",
      labelKey: "searchModal.steps.itinerary",
      status: "pending",
    },
  ];

  const [steps, setSteps] = React.useState<SearchStep[]>(defaultSteps);
  const [isSearching, setIsSearching] = React.useState(false);

  // Calculate overall progress based on completed steps
  const overallProgress = React.useMemo(() => {
    const completedSteps = steps.filter((step) => step.status === "completed").length;
    return Math.round((completedSteps / steps.length) * 100);
  }, [steps]);

  // Simulate search process
  const startSearch = React.useCallback(() => {
    setIsSearching(true);
    setSteps(defaultSteps); // Reset steps

    // Simulate flight search
    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "flights" ? { ...step, status: "searching" as const } : step)));
    }, 300);

    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "flights" ? { ...step, status: Math.random() > 0.05 ? ("completed" as const) : ("failed" as const) } : step)));
    }, 1500);

    // Start hotel search
    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "hotels" ? { ...step, status: "searching" as const } : step)));
    }, 2000);

    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "hotels" ? { ...step, status: Math.random() > 0.05 ? ("completed" as const) : ("failed" as const) } : step)));
    }, 3200);

    // Start itinerary generation
    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "itinerary" ? { ...step, status: "searching" as const } : step)));
    }, 3700);

    setTimeout(() => {
      setSteps((prev) => prev.map((step) => (step.id === "itinerary" ? { ...step, status: Math.random() > 0.05 ? ("completed" as const) : ("failed" as const) } : step)));
      setIsSearching(false);
    }, 4900);
  }, []);

  const resetSearch = React.useCallback(() => {
    setSteps(defaultSteps);
    setIsSearching(false);
  }, []);

  return {
    steps,
    overallProgress,
    isSearching,
    startSearch,
    resetSearch,
  };
};

export default useSearchProgress;
