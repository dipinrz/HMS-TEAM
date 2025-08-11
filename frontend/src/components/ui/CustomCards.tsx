// components/ui/Card.tsx
import React from "react";
import {
  Card as MUICard,
  CardHeader as MUICardHeader,
  CardContent as MUICardContent,
  CardActions as MUICardActions,
  CardMedia,
  styled,
  type CardHeaderProps,
} from "@mui/material";

import type { CardContentProps as MUICardContentProps } from "@mui/material";

// Styled Card with dynamic width and hover effects
export const StyledCard = styled(MUICard)(({ theme }) => ({
  width: "fit-content",
  minWidth: "280px",
  maxWidth: "100%",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: theme.shadows[2],
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
  "&:active": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "100%",
  },
}));

const baseCardStyles = {
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const AnimatedCard = styled(MUICard, {
  shouldForwardProp: (prop) => prop !== "hoverVariant",
})<{ hoverVariant?: "lift" | "glow" | "scale" | "rotate" }>(
  ({ theme, hoverVariant = "lift" }) => ({
    ...baseCardStyles,
    width: "fit-content",
    minWidth: "280px",
    maxWidth: "100%",
    borderRadius: "12px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    boxShadow: theme.shadows[2],
    ...(hoverVariant === "lift" && {
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: theme.shadows[12],
      },
    }),
    ...(hoverVariant === "glow" && {
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `${theme.shadows[8]}, 0 0 20px ${theme.palette.primary.main}40`,
      },
    }),
    ...(hoverVariant === "scale" && {
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: theme.shadows[8],
      },
    }),
    ...(hoverVariant === "rotate" && {
      "&:hover": {
        transform: "translateY(-4px) rotate(1deg)",
        boxShadow: theme.shadows[8],
      },
    }),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      maxWidth: "100%",
    },
  })
);

const NonAnimatedCard = styled(MUICard)(() => ({
  ...baseCardStyles,
}));

type CardProps = React.ComponentProps<typeof MUICard> & {
  hoverVariant?: "lift" | "glow" | "scale" | "rotate";
  animated?: boolean;
};

export function Card({ children, hoverVariant = "lift", animated = true, ...props }: CardProps) {
  if (animated) {
    return (
      <AnimatedCard hoverVariant={hoverVariant} {...props}>
        {children}
      </AnimatedCard>
    );
  }
  return <NonAnimatedCard {...props}>{children}</NonAnimatedCard>;
}

export function CardHeader(props: CardHeaderProps) {
  return <MUICardHeader {...props} />;
}

export function CardContent(props: MUICardContentProps) {
  return <MUICardContent {...props} />;
}

export function CardActions({ children }: { children: React.ReactNode }) {
  return <MUICardActions>{children}</MUICardActions>;
}

export function CardImage({ image, title }: { image: string; title?: string }) {
  return <CardMedia component="img" height="140" image={image} alt={title} />;
}
