import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import theme from "@/styles/theme";

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
};

const TooltipBubble = styled.div`
  position: absolute;
  background: ${theme.tooltip.background};
  color: ${theme.tooltip.color};
  padding: ${theme.tooltip.padding};
  border-radius: ${theme.radii.tooltip};
  box-shadow: ${theme.shadows.tooltip};
  font-size: 0.75rem;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
  z-index: 2000;
`;

const mergeHandlers =
  <E,>(existing?: (event: E) => void, next?: (event: E) => void) =>
  (event: E) => {
    existing?.(event);
    if (typeof event === "object" && event !== null && "defaultPrevented" in event) {
      if ((event as unknown as { defaultPrevented: boolean }).defaultPrevented) {
        return;
      }
    }
    next?.(event);
  };

export function Tooltip({ content, children }: TooltipProps) {
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const portalNode = useMemo(() => (typeof window !== "undefined" ? document.body : null), []);

  const updatePosition = useCallback(() => {
    if (!triggerElement) {
      return;
    }

    const rect = triggerElement.getBoundingClientRect();
    const offset = theme.tooltip.offset;
    setPosition({
      top: rect.top + window.scrollY - offset,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  }, [triggerElement]);

  const show = useCallback(() => {
    updatePosition();
    setIsVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleScroll = () => updatePosition();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isVisible, updatePosition]);

  const child = Children.only(children);

  const assignTriggerElement = useCallback((node: HTMLElement | null) => {
    setTriggerElement(node);
  }, []);

  const trigger = cloneElement(child, {
    onMouseEnter: mergeHandlers(child.props.onMouseEnter, show),
    onMouseLeave: mergeHandlers(child.props.onMouseLeave, hide),
    onFocus: mergeHandlers(child.props.onFocus, show),
    onBlur: mergeHandlers(child.props.onBlur, hide),
    ref: assignTriggerElement,
  });

  return (
    <>
      {trigger}
      {portalNode && isVisible
        ? createPortal(
            <TooltipBubble style={{ top: position.top, left: position.left }}>{content}</TooltipBubble>,
            portalNode,
          )
        : null}
    </>
  );
}



