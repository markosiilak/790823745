import { ReactNode, useMemo } from "react";
import {
  Header,
  TitleGroup,
  Kicker,
  Subtitle,
  Controls,
  NavButton,
} from "./styles/headerSectionStyles";
import { ChevronLeftIcon } from "@/lib/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/lib/icons/ChevronRightIcon";
import { useTranslations, useLocale, getAvailableLocales, type Locale } from "@/lib/translations";
import { Dropdown, type DropdownOption } from "./Dropdown";

type HeaderSectionProps = {
  label: string;
  subtitle: string;
  onPrevious: () => void;
  onNext: () => void;
  extraActions?: ReactNode;
};

/** * Displays quarter label (e.g., "Q4 2025"), subtitle, previous/next navigation, and language dropdown. *
 */
export function HeaderSection({
  label,
  subtitle,
  onPrevious,
  onNext,
  extraActions,
}: HeaderSectionProps) {
  const t = useTranslations("headerSection");
  const tLanguages = useTranslations("languages");
  const [currentLocale, setLocale] = useLocale();

  const languageOptions: DropdownOption[] = useMemo(
    () =>
      getAvailableLocales().map((locale) => ({
        value: locale,
        label: (tLanguages as Record<string, string>)[locale] || locale,
      })),
    [tLanguages],
  );

  const handleLanguageChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <Header>
      <TitleGroup>
        <Kicker>{t.kicker}</Kicker>
        <h1>{label}</h1>
        <Subtitle>{subtitle}</Subtitle>
      </TitleGroup>

      <Controls>
        <Dropdown
          options={languageOptions}
          value={currentLocale}
          onChange={handleLanguageChange}
          ariaLabel={t.languageLabel}
          width="120px"
        />
        <NavButton type="button" onClick={onPrevious} aria-label={t.ariaLabelPrevious}>
          <ChevronLeftIcon />
          {t.previous}
        </NavButton>
        <NavButton type="button" onClick={onNext} aria-label={t.ariaLabelNext}>
          {t.next}
          <ChevronRightIcon />
        </NavButton>
        {extraActions}
      </Controls>
    </Header>
  );
}


