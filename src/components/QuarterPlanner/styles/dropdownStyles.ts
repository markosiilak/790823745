import styled, { css } from "styled-components";
import theme from "@/styles/theme";

export const Wrapper = styled.div<{ $width?: string }>`
  position: relative;
  min-width: ${({ $width }) => $width ?? "200px"};
`;

export const TriggerButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.backgroundAlt};
  color: ${theme.colors.foreground};
  padding: 0.55rem;
  font: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color ${theme.transitions.medium}, box-shadow ${theme.transitions.medium};

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

export const LabelText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Chevron = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  color: ${theme.colors.accentStrong};
  transition: transform ${theme.transitions.medium};
  transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0deg")});
`;

export const OptionsCard = styled.ul`
  position: absolute;
  top: calc(100% + ${theme.spacing.gapMedium});
  left: 0;
  right: 0;
  z-index: 30;
  list-style: none;
  margin: 0;
  padding: ${theme.spacing.gapSmall} 0;
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid ${theme.colors.borderMedium};
  box-shadow: ${theme.shadows.card};
  max-height: 16rem;
  overflow-y: auto;
`;

export const OptionButton = styled.button<{ $isActive: boolean; disabled?: boolean }>`
  width: 100%;
  background: ${({ $isActive }) =>
    $isActive ? theme.colors.accentOverlayLight : "transparent"};
  color: ${theme.colors.foreground};
  border: none;
  padding: 0.55rem 0.85rem;
  font: inherit;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background ${theme.transitions.medium}, opacity ${theme.transitions.medium};
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ disabled }) =>
      disabled ? "transparent" : theme.colors.weekGradientStart};
  }
`;

export const OptionDescription = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.foregroundMuted};
  margin-left: 1rem;
`;

