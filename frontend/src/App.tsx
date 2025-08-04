import React from "react";
import CustomButton from "./components/ui/CustomButton";
import CustomInput from "./components/ui/CustomInput";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardImage,
} from "./components/ui/CustomCards";
import { Box, Typography, Chip, Badge } from "@mui/material";

import {
  ConnectionStatus,
  OnlineStatus,
  StatusIndicator,
  type StatusType,
  type StatusVariant,
} from "./components/ui/CustomStatus";

const statuses: StatusType[] = [
  "success",
  "error",
  "warning",
  "info",
  "pending",
  "inactive",
  "processing",
];
const variants: StatusVariant[] = ["dot", "chip", "badge", "icon", "text"];

const App = () => {
  return (
    <div>
      <CustomInput
        label="Name"
        width="400px"
        sx={{ backgroundColor: "#4684b6ff", borderRadius: "8px" }}
      />
      <CustomInput
        label="Name"
        width="250px"
        sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}
      />

      <CustomButton
        label="Testing"
        variant="outlined"
        onClick={() => {
          console.log("button clicked..");
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          padding: "20px",
        }}
      >
        {/* Basic Card with dynamic width */}
        <Card>
          <CardHeader title="Short Title" />
          <CardContent>
            <Typography variant="body2">Short content</Typography>
          </CardContent>
        </Card>

        {/* Card with longer content */}
        <Card hoverVariant="glow">
          <CardHeader
            title="Much Longer Title That Will Expand The Card"
            subheader="With a subtitle too"
          />
          <CardContent>
            <Typography variant="body2">
              This card has much longer content that will cause the card to
              expand to accommodate the text while respecting the maximum width
              constraints.
            </Typography>
          </CardContent>
          <CardActions>
            <CustomButton
              label="Edit"
              color="secondary"
              onClick={() => {
                console.log("Clicked Edit Button");
              }}
            />
            <CustomButton
              label="Detail"
              onClick={() => {
                console.log("Clicked Detail Button");
              }}
            />
          </CardActions>
        </Card>

        {/* Scale hover variant */}
        <Card hoverVariant="scale">
          <CardImage
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgoRAM8VbTHTlFwB9v3BRa0ZlFUioRZH5lqQ&s"
            title="Sample Image"
          />
          <CardHeader title="Scale Effect" />
          <CardContent>
            <Typography variant="body2">This card scales on hover</Typography>
          </CardContent>
        </Card>

        {/* Rotate hover variant */}
        <Card hoverVariant="rotate">
          <CardHeader title="Rotate Effect" />
          <CardContent>
            <Typography variant="body2">
              This card rotates slightly on hover
            </Typography>
          </CardContent>
        </Card>
      </div>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5">Status Indicator Examples</Typography>

        {variants.map((variant) => (
          <Box
            key={variant}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
              {variant} Variant
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {statuses.map((status) => (
                <StatusIndicator
                  key={status}
                  status={status}
                  variant={variant}
                  showLabel={variant !== "chip"}
                  animated={status === "processing"}
                  withRipple={status === "pending"}
                >
                  {variant === "badge" && (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </StatusIndicator>
              ))}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Special Cases</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <OnlineStatus online={true} variant="dot" showLabel size="medium" />
            <OnlineStatus online={false} variant="chip" />
            <ConnectionStatus connected={true} variant="icon" showLabel />
            <ConnectionStatus connected={false} variant="dot" withRipple />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Interactive Examples</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <StatusIndicator
              status="warning"
              variant="chip"
              onClick={() => alert("Status clicked!")}
            />
            <StatusIndicator
              status="info"
              variant="icon"
              showLabel
              onClick={() => alert("Info clicked!")}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default App;
