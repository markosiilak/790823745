import styled from 'styled-components';
import theme from '@/styles/theme';

export const TimelineWrapper = styled.div`
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.radii.timelineCard};
  border: 1px solid ${theme.colors.borderSubtle};
  box-shadow: ${theme.shadows.card};
  padding: 1rem;
  overflow: hidden;
`;

export const TimelineContainer = styled.div`
  display: flex;
  position: relative;
  height: 600px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.timelineCard};
  overflow: hidden;
`;

export const TimelineSidebar = styled.div`
  width: 250px;
  min-width: 250px;
  background: ${theme.colors.tableHeader};
  border-right: 1px solid ${theme.colors.border};
  overflow-y: auto;
  overflow-x: hidden;
  z-index: ${theme.zIndex.sidebar};
`;

export const TimelineCanvas = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
  background: ${theme.colors.backgroundAlt};
`;

export const TimelineHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.header};
  background: ${theme.colors.tableHeader};
  border-bottom: 2px solid ${theme.colors.border};
`;

export const TimelineRow = styled.div`
  display: flex;
  position: relative;
  min-height: 60px;
  height: 60px;
  border-bottom: 1px solid ${theme.colors.tableDivider};
  
  &:hover {
    background: ${theme.colors.tableCellBg};
  }
`;

export const TimelineItem = styled.div<{ $left: number; $width: number; $color?: string }>`
  position: absolute;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  height: 40px;
  margin-top: 10px;
  background: ${({ $color }) => $color || `linear-gradient(135deg, ${theme.colors.weekGradientStart}, ${theme.colors.weekGradientEnd})`};
  border-radius: ${theme.radii.input};
  border: 2px solid ${theme.colors.weekBorderActive};
  box-shadow: 0 2px 8px ${theme.colors.accentOverlayMedium};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 ${theme.typography.fontSizeMedium};
  transition: transform ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${theme.colors.accentOverlayStrong};
  }
`;

export const TimelineItemLabel = styled.span`
  font-weight: ${theme.typography.fontWeightBold};
  font-size: ${theme.typography.fontSizeMediumLarge};
  color: ${theme.colors.foreground};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SidebarRow = styled.div`
  padding: ${theme.spacing.tableCellPadding};
  border-bottom: 1px solid ${theme.colors.tableDivider};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  height: 60px;
  box-sizing: border-box;
  
  &:hover {
    background: ${theme.colors.tableCellBg};
  }
`;

export const SidebarTaskName = styled.span`
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.foreground};
  flex: 1;
`;

export const SidebarActions = styled.div`
  display: flex;
  gap: ${theme.spacing.gapMedium};
  align-items: center;
`;

export const TimeHeaderRow = styled.div`
  display: flex;
  position: relative;
  height: 60px;
`;

export const TimeHeaderCell = styled.div<{ $width: number }>`
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  border-right: 1px solid ${theme.colors.tableDivider};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSizeMedium};
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.tableHeaderText};
  position: relative;
`;

export const TimeHeaderMonth = styled.div<{ $width: number }>`
  width: ${({ $width }) => `${$width}px`};
  min-width: ${({ $width }) => `${$width}px`};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSizeLarge};
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.tableHeaderText};
  background: ${theme.colors.tableHeader};
  padding: 0.5rem;
`;

export const TimelineLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 200px;
  gap: ${theme.spacing.controlGap};
`;

export const TimelineLoadingText = styled.p`
  color: ${theme.colors.foregroundMuted};
  font-size: ${theme.typography.fontSizeMediumLarge};
  margin: 0;
`;

