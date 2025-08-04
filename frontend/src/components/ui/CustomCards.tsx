
// components/ui/Card.tsx
import React from "react";
import { 
  Card as MUICard, 
  CardHeader as MUICardHeader, 
  CardContent as MUICardContent, 
  CardActions as MUICardActions, 
  CardMedia, 
  styled 
} from "@mui/material";

// Styled Card with dynamic width and hover effects
const StyledCard = styled(MUICard)(({ theme }) => ({
  // Dynamic width based on content
  width: 'fit-content',
  minWidth: '280px',
  maxWidth: '400px',
  
  // Smooth transitions
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Initial shadow
  boxShadow: theme.shadows[2],
  
  // Hover effects
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    
    // Optional: slight scale effect
    // transform: 'translateY(-4px) scale(1.02)',
  },
  
  // Active state (when clicked)
  '&:active': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  
  // Responsive behavior
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: '100%',
  },
}));

// Enhanced Card with hover animation variants
const AnimatedCard = styled(MUICard,{
  shouldForwardProp: (prop) => prop !== 'hoverVariant'
})<{ hoverVariant?: 'lift' | 'glow' | 'scale' | 'rotate' }>(
  ({ theme, hoverVariant = 'lift' }) => ({
    width: 'fit-content',
    minWidth: '280px',
    maxWidth: '400px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    
    // Base styles
    boxShadow: theme.shadows[2],
    
    // Hover variants
    ...(hoverVariant === 'lift' && {
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[12],
      },
    }),
    
    ...(hoverVariant === 'glow' && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `${theme.shadows[8]}, 0 0 20px ${theme.palette.primary.main}40`,
      },
    }),
    
    ...(hoverVariant === 'scale' && {
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[8],
      },
    }),
    
    ...(hoverVariant === 'rotate' && {
      '&:hover': {
        transform: 'translateY(-4px) rotate(1deg)',
        boxShadow: theme.shadows[8],
      },
    }),
    
    // Responsive
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
    },
  })
);

type CardProps = React.ComponentProps<typeof MUICard> & {
  hoverVariant?: 'lift' | 'glow' | 'scale' | 'rotate';
  animated?: boolean;
};

export function Card({ children, hoverVariant = 'lift', animated = true, ...props }: CardProps) {
  if (animated) {
    return (
      <AnimatedCard hoverVariant={hoverVariant} {...props}>
        {children}
      </AnimatedCard>
    );
  }
  
  return (
    <StyledCard {...props}>
      {children}
    </StyledCard>
  );
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
