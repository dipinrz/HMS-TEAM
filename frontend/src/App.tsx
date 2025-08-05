
import CustomButton from "./components/ui/CustomButton";
import CustomInput from "./components/ui/CustomInput";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  
} from "./components/ui/CustomCards";
import { Typography } from "@mui/material";
import { useState } from "react";
import CustomModal from "./components/ui/CustomModal";


const App = () => {
  const [open,setOpen]=useState(false);
  return (
    <div>
      <CustomButton label="Modal testing" variant="outlined" onClick={()=>setOpen(true)}/>

      <CustomModal 
      open={open} 
      onClose={()=>setOpen(false)}
      title="Modal Titile" 
      content={<Typography variant="h6">Modal clicked</Typography>}
      actions={
      <>
        <CustomButton label="Delete" onClick={() => setOpen(false)} variant="outlined" color="error"/>
        <CustomButton label="Save" onClick={() => setOpen(false)} variant="outlined" color="success"/>
      </>
      }
      />

      <CustomInput
        label="Name"
        
        sx={{ backgroundColor: "#4684b6ff", borderRadius: "8px" }}
      />
      <CustomInput
        label="Name"
        
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
