export interface DropdownFilter {
  selectedClinics?: { name: string; code: string } | null;
  selectedOperators?: { name: string; code: string } | null;
  selectedChairs?:
    | { name: string; code: string }[]
    | { name: string; code: string }
    | null;
  selectedStates?: { label: string; value: number } | null;
  availableOperatorsSwitch?: boolean;
  searchQuery?: string;
}
