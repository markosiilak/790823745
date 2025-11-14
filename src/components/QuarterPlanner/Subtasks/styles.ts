import styled from "styled-components";
import theme from "@/styles/theme";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
`;

export const DialogCard = styled.div`
  width: min(420px, 100%);
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.formGap};
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

export const Subtitle = styled.p`
  color: ${theme.colors.foregroundMuted};
  font-size: 0.9rem;
  margin: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.formGap};
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.fieldGap};
`;

export const Label = styled.label`
  font-weight: ${theme.typography.fontWeightBold};
  font-size: 0.85rem;
  color: ${theme.colors.foreground};
`;

export const TextInput = styled.input`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.input};
  padding: 0.65rem 0.85rem;
  font: inherit;
  color: ${theme.colors.foreground};
  background: ${theme.colors.tableCellBg};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 4px ${theme.colors.accentMuted};
  }
`;

export const TimeInput = styled(TextInput).attrs({ type: "time" })`
  width: 160px;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.controlGap};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const buttonBase = `
  border-radius: ${theme.radii.pill};
  padding: ${theme.spacing.controlPadding};
  font-weight: ${theme.typography.fontWeightBold};
  cursor: pointer;
  transition: ${theme.transitions.primary}, opacity 0.18s ease;
  border: none;
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${theme.colors.accent};
  color: ${theme.colors.accentInverted};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryHover};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: ${theme.colors.foregroundMuted};
  border: 1px solid ${theme.colors.border};

  &:hover {
    transform: translateY(-1px);
    border-color: ${theme.colors.accent};
    color: ${theme.colors.accentStrong};
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  background: ${theme.colors.dangerTint};
  padding: 0.75rem 1rem;
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.dangerBorder};
  font-size: 0.85rem;
`;

