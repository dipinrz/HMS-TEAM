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

      <Card sx={{ maxWidth: 345 }}>
        {/* <CardImage image="https://source.unsplash.com/random" title="Sample" /> */}
        <CardHeader title="Developer" subheader="Systems Engineer" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This is a sample dynamic card built with MUI and TSX.
          </Typography>
        </CardContent>
        <CardActions >
          <CustomButton
            color="secondary"
            label="Detail"
            onClick={() => {
              console.log("Detail button clicked");
            }}
          />
          <CustomButton
            color="primary"
            label="Edit"
            onClick={() => {
              console.log("Edit button clicked");
            }}
          />
        </CardActions>
      </Card>
    </div>
  );
};

export default App;
