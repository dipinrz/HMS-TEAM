// components/ui/Card.tsx
import React from "react";
import { Card as MUICard, CardHeader as MUICardHeader, CardContent as MUICardContent, CardActions as MUICardActions, CardMedia, Typography } from "@mui/material";

type CardProps = React.ComponentProps<typeof MUICard>;

export function Card({ children, ...props }: CardProps) {
  return <MUICard {...props}>{children}</MUICard>;
}

export function CardHeader({
  title,
  subheader,
}: {
  title?: string;
  subheader?: string;
}) {
  return <MUICardHeader title={title} subheader={subheader} />;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <MUICardContent>{children}</MUICardContent>;
}

export function CardActions({ children }: { children: React.ReactNode }) {
  return <MUICardActions>{children}</MUICardActions>;
}

export function CardImage({ image, title }: { image: string; title?: string }) {
  return <CardMedia component="img" height="140" image={image} alt={title} />;
}
