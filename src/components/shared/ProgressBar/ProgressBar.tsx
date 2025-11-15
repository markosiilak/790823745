import styled, { keyframes } from 'styled-components';
import theme from '@/styles/theme';

const progressAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 4px;
  background: ${theme.colors.tableDivider};
  border-radius: ${theme.radii.pill};
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    ${theme.colors.accent},
    transparent
  );
  animation: ${progressAnimation} 1.5s ease-in-out infinite;
  transform-origin: left;
`;

interface ProgressBarProps {
  className?: string;
}

export function ProgressBar({ className }: ProgressBarProps) {
  return (
    <ProgressBarContainer className={className} role="progressbar" aria-label="Loading">
      <ProgressBarFill />
    </ProgressBarContainer>
  );
}

