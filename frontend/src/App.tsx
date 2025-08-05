
import CustomButton from "./components/ui/CustomButton";
import CustomInput from "./components/ui/CustomInput";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  
} from "./components/ui/CustomCards";



import { Box, Typography } from "@mui/material";

import {
  ConnectionStatus,
  OnlineStatus,
  StatusIndicator,
  type StatusType,
  type StatusVariant,
} from "./components/ui/CustomStatus";
import Navbar from "./components/NavBar";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import DoctorDashboard from "./dashboards/DoctorDashboard";

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

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AdminDashboard/>
      <DoctorDashboard/>
      
    </div>
  );
};

export default App;
