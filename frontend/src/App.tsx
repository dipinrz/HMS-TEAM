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
import { Typography } from "@mui/material";

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
    </div>
  );
};

export default App;
