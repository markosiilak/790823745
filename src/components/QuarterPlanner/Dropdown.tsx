"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import theme from "@/styles/theme";

const Wrapper = styled.div<{ $width?: string }>`
  position: relative;
  min-width: ${({ $width }) => $width ?? "200px"};
`;

const TriggerButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.backgroundAlt};
  color: ${theme.colors.foreground};
  padding: 0.55rem 2.25rem 0.55rem 0.85rem;
  font: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      border-color: ${theme.colors.accent};
      box-shadow: 0 0 0 3px ${theme.colors.accentMuted};
    `}

  &:hover {
    border-color: ${theme.colors.accent};
  }

  &:focus-visible {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px ${theme.colors.accentMuted};
  }
`;

const LabelText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Chevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  color: ${theme.colors.accentStrong};
  transition: transform 0.18s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
`;

const OptionsCard = styled.ul`
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  z-index: 30;
  list-style: none;
  margin: 0;
  padding: 0.35rem 0;
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.12);
  box-shadow: ${theme.shadows.card};
  max-height: 16rem;
  overflow-y: auto;
`;

const OptionButton = styled.button<{ $isActive: boolean }>`
  width: 100%;
  background: ${({ $isActive }) =>
    $isActive ? "rgba(123, 63, 228, 0.08)" : "transparent"};
  color: ${theme.colors.foreground};
  border: none;
  padding: 0.55rem 0.85rem;
  font: inherit;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.18s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    background: rgba(123, 63, 228, 0.16);
  }
`;

const OptionDescription = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.foregroundMuted};
  margin-left: 1rem;
`;

export type DropdownOption = {
  value: string;
  label: string;
  description?: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  ariaLabel?: string;
  width?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  ariaLabel,
  width,
  disabled = false,
  placeholder = "Select…",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const activeIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
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
        <LabelText>{options.find((option) => option.value === value)?.label ?? placeholder}</LabelText>
        <Chevron $isOpen={isOpen}>▼</Chevron>
      </TriggerButton>

      {isOpen ? (
        <OptionsCard role="listbox" ref={listRef}>
          {options.map((option) => {
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


