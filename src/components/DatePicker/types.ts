export interface DatePickerProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly ariaLabel?: string;
  readonly ariaLabelledBy?: string;
}

export type CalendarDay = Readonly<{
  date: Date;
  isCurrentMonth: boolean;
}>;

