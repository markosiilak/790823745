import styled, { css } from "styled-components";
import theme from "@/styles/theme";

export const Card = styled.section`
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.card};
  border: 1px solid rgba(31, 41, 51, 0.08);
  box-shadow: ${theme.shadows.card};
  padding: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.formGap};
  margin-top: 1rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${theme.spacing.controlGap};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.controlGap};
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.fieldGap};
  color: ${theme.colors.foreground};
  width: 100%;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.fieldGap};
  color: ${theme.colors.foreground};
  width: 100%;
`;

export const FieldLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.foreground};
`;

export const Input = styled.input`
  appearance: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.input};
  padding: 0.7rem 0.85rem;
  font: inherit;
  color: ${theme.colors.foreground};
  background: ${theme.colors.tableCellBg};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 4px ${theme.colors.accentMuted};
    outline: none;
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  background: ${theme.colors.dangerTint};
  padding: 0.75rem 1rem;
  border-radius: ${theme.radii.input};
  border: 1px solid ${theme.colors.dangerBorder};
`;

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing.controlGap};
`;

const buttonBase = css`
  border-radius: ${theme.radii.pill};
  border: none;
  padding: 0.65rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${theme.colors.accent};
  color: #ffffff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.primaryHover};
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

export const LimitBadge = styled.span`
  margin-left: auto;
  font-size: 0.85rem;
  color: ${theme.colors.foregroundMuted};
  background: ${theme.colors.accentBadge};
  padding: 0.35rem 0.75rem;
  border-radius: ${theme.radii.pill};
`;

