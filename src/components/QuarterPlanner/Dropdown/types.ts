export type DropdownOption = Readonly<{
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}>;

export interface DropdownProps {
  readonly options: readonly DropdownOption[];
  readonly value: string | null;
  readonly onChange: (value: string) => void;
  readonly ariaLabel?: string;
  readonly width?: string;
  readonly disabled?: boolean;
  readonly placeholder?: string;
}

