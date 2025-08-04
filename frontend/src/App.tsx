import React from "react";
import CustomButton from "./components/ui/CustomButton";
import CustomInput from "./components/ui/CustomInput";

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

      <CustomButton label="Testing" variant="outlined" />
    </div>
  );
};

export default App;
