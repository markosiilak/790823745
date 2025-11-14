"use client";

import styled, { keyframes } from "styled-components";
import { useTranslations } from "@/lib/translations";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const progressBar = keyframes`
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

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
  min-height: 300px;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: 50%;
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 2px;
  animation: ${progressBar} 1.5s ease-in-out infinite;
`;

type LoadingIndicatorProps = {
  message?: string;
};

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  const t = useTranslations("quarterTable");
  const loadingMessage = message || t.loading;

  return (
    <LoaderContainer>
      <Text>{loadingMessage}</Text>
      <ProgressBarContainer>
        <ProgressBar />
      </ProgressBarContainer>
    </LoaderContainer>
  );
}

