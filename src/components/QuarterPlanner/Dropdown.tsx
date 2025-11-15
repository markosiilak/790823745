"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@/lib/icons/ChevronDownIcon";
import { useTranslations } from "@/lib/translations";
import {
  Wrapper,
  TriggerButton,
  LabelText,
  Chevron,
  OptionsCard,
  OptionButton,
  OptionDescription,
} from "./styles/dropdownStyles";
import type { DropdownProps, DropdownOption } from "./Dropdown/types";

export type { DropdownOption } from "./Dropdown/types";

/**
 * Reusable dropdown/select component with custom styling.
 * Supports keyboard navigation, click outside to close, and disabled options.
 * Automatically scrolls to active option when opened.
 * Provides accessibility attributes (ARIA) for screen readers.
 * Supports localization with a default placeholder.
 */
export function Dropdown({
  options,
  value,
  onChange,
  ariaLabel,
  width,
  disabled = false,
  placeholder: providedPlaceholder,
}: DropdownProps) {
  const t = useTranslations("dropdown");
  const defaultPlaceholder = t.selectPlaceholder;
  const placeholder = providedPlaceholder ?? defaultPlaceholder;
  
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const activeIndex = useMemo<number>(
    () => options.findIndex((option: DropdownOption) => option.value === value),
    [options, value],
  );

  const toggleOpen = useCallback(() => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }
    const list = listRef.current;
    if (!list) {
      return;
    }
    const optionNode = list.children[activeIndex] as HTMLElement | undefined;
    if (optionNode) {
      optionNode.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, isOpen]);

  return (
    <Wrapper ref={wrapperRef} $width={width}>
      <TriggerButton
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={toggleOpen}
        disabled={disabled}
        $isOpen={isOpen}
      >
        <LabelText>{options.find((option: DropdownOption) => option.value === value)?.label ?? placeholder}</LabelText>
        <Chevron $isOpen={isOpen}>
          <ChevronDownIcon width={16} height={16} />
        </Chevron>
      </TriggerButton>

      {isOpen ? (
        <OptionsCard role="listbox" ref={listRef}>
          {options.map((option: DropdownOption) => {
            const isActive = option.value === value;
            return (
              <li key={option.value}>
                <OptionButton
                  type="button"
                  $isActive={isActive}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={option.disabled ?? false}
                  disabled={option.disabled}
                >
                  <span>{option.label}</span>
                  {option.description ? (
                    <OptionDescription>{option.description}</OptionDescription>
                  ) : null}
                </OptionButton>
              </li>
            );
          })}
        </OptionsCard>
      ) : null}
    </Wrapper>
  );
}


