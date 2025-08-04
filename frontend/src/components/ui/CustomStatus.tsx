// components/ui/StatusIndicator.tsx
import React from "react";
import { styled, keyframes } from "@mui/material/styles";
import { Box, Typography, Chip, Badge } from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Warning,
  Info,
  RadioButtonUnchecked,
  Pause,
  Schedule,
  Block,
} from "@mui/icons-material";

// Animation keyframes
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;

// Status types and their configurations
export type StatusType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "pending"
  | "inactive"
  | "processing"
  | "paused"
  | "blocked";

export type StatusVariant = "dot" | "chip" | "badge" | "icon" | "text";

const statusConfig = {
  success: {
    color: "#4caf50",
    backgroundColor: "#e8f5e8",
    icon: CheckCircle,
    label: "Success",
  },
  error: {
    color: "#f44336",
    backgroundColor: "#ffebee",
    icon: Cancel,
    label: "Error",
  },
  warning: {
    color: "#ff9800",
    backgroundColor: "#fff3e0",
    icon: Warning,
    label: "Warning",
  },
  info: {
    color: "#2196f3",
    backgroundColor: "#e3f2fd",
    icon: Info,
    label: "Info",
  },
  pending: {
    color: "#9c27b0",
    backgroundColor: "#f3e5f5",
    icon: Schedule,
    label: "Pending",
  },
  inactive: {
    color: "#9e9e9e",
    backgroundColor: "#f5f5f5",
    icon: RadioButtonUnchecked,
    label: "Inactive",
  },
  processing: {
    color: "#00bcd4",
    backgroundColor: "#e0f2f1",
    icon: RadioButtonUnchecked,
    label: "Processing",
  },
  paused: {
    color: "#795548",
    backgroundColor: "#efebe9",
    icon: Pause,
    label: "Paused",
  },
  blocked: {
    color: "#607d8b",
    backgroundColor: "#eceff1",
    icon: Block,
    label: "Blocked",
  },
};

// Styled components
const StatusDot = styled("div")<{
  status: StatusType;
  size: number;
  animated?: boolean;
  withRipple?: boolean;
}>(({ status, size, animated, withRipple }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  backgroundColor: statusConfig[status].color,
  position: "relative",
  display: "inline-block",

  ...(animated && {
    animation: `${pulse} 2s infinite`,
  }),

  ...(withRipple && {
    "&::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: statusConfig[status].color,
      animation: `${ripple} 1.5s infinite`,
      zIndex: -1,
    },
  }),
}));

const StatusContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "clickable",
})<{ clickable?: boolean }>(({ clickable }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  ...(clickable && {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8,
    },
  }),
}));

interface StatusIndicatorProps {
  status: StatusType;
  variant?: StatusVariant;
  size?: "small" | "medium" | "large";
  label?: string;
  showLabel?: boolean;
  animated?: boolean;
  withRipple?: boolean;
  onClick?: () => void;
  className?: string;
  customColor?: string;
  children?: React.ReactNode;
}

const sizeMap = {
  small: { dot: 8, icon: 16, text: "body2" as const },
  medium: { dot: 12, icon: 20, text: "body1" as const },
  large: { dot: 16, icon: 24, text: "h6" as const },
};

export function StatusIndicator({
  status,
  variant = "dot",
  size = "medium",
  label,
  showLabel = false,
  animated = false,
  withRipple = false,
  onClick,
  className,
  customColor,
  children,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeConfig = sizeMap[size];
  const displayLabel = label || config.label;
  const IconComponent = config.icon;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Dot variant
  if (variant === "dot") {
    return (
      <StatusContainer
        className={className}
        clickable={!!onClick}
        onClick={handleClick}
      >
        <StatusDot
          status={status}
          size={sizeConfig.dot}
          animated={animated}
          withRipple={withRipple}
          style={customColor ? { backgroundColor: customColor } : undefined}
        />
        {showLabel && (
          <Typography variant={sizeConfig.text} color="textSecondary">
            {displayLabel}
          </Typography>
        )}
        {children}
      </StatusContainer>
    );
  }

  // Chip variant
  if (variant === "chip") {
    return (
      <Chip
        className={className}
        icon={<StatusDot status={status} size={8} animated={animated} />}
        label={displayLabel}
        size={size === "large" ? "medium" : "small"}
        onClick={onClick}
        style={{
          backgroundColor: customColor
            ? `${customColor}20`
            : config.backgroundColor,
          color: customColor || config.color,
          border: `1px solid ${customColor || config.color}40`,
        }}
      />
    );
  }

  // Badge variant
  if (variant === "badge") {
    return (
      <Badge
        className={className}
        badgeContent={
          <StatusDot
            status={status}
            size={sizeConfig.dot}
            animated={animated}
            withRipple={withRipple}
          />
        }
        onClick={onClick}
      >
        {children || <Box sx={{ width: 24, height: 24 }} />}
      </Badge>
    );
  }

  // Icon variant
  if (variant === "icon") {
    return (
      <StatusContainer
        className={className}
        clickable={!!onClick}
        onClick={handleClick}
      >
        <IconComponent
          sx={{
            fontSize: sizeConfig.icon,
            color: customColor || config.color,
          }}
        />
        {showLabel && (
          <Typography variant={sizeConfig.text} color="textSecondary">
            {displayLabel}
          </Typography>
        )}
        {children}
      </StatusContainer>
    );
  }

  // Text variant
  if (variant === "text") {
    return (
      <StatusContainer
        className={className}
        clickable={!!onClick}
        onClick={handleClick}
      >
        <Typography
          variant={sizeConfig.text}
          sx={{
            color: customColor || config.color,
            fontWeight: "medium",
            textTransform: "uppercase",
            fontSize: size === "small" ? "0.75rem" : undefined,
          }}
        >
          {displayLabel}
        </Typography>
        {children}
      </StatusContainer>
    );
  }

  return null;
}

// Convenience components for common use cases
export function OnlineStatus({
  online,
  ...props
}: { online: boolean } & Omit<StatusIndicatorProps, "status">) {
  return (
    <StatusIndicator
      status={online ? "success" : "inactive"}
      label={online ? "Online" : "Offline"}
      {...props}
    />
  );
}

export function ConnectionStatus({
  connected,
  ...props
}: {
  connected: boolean;
} & Omit<StatusIndicatorProps, "status">) {
  return (
    <StatusIndicator
      status={connected ? "success" : "error"}
      label={connected ? "Connected" : "Disconnected"}
      animated={!connected}
      {...props}
    />
  );
}
