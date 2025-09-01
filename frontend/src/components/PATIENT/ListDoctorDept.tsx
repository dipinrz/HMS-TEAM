import {
  Avatar,
  Box,
  CardContent,
  Grow,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { getDeptAndDoc } from "../../services/patientApi";
import { Card, CardHeader } from "../ui/CustomCards";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

interface DoctorType {
  name: string;
  specialization: string;
  years_of_experience: number;
}
interface DepartmentType {
  department_id: number;
  department_name: string;
  doctors: DoctorType[];
}

const ListDoctorDept = () => {
  const [data, setData] = useState<DepartmentType[] | null>(null);
  const [departmentID, setDepartmentId] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setDepartmentId(newValue);
  };
  const fetching = async () => {
    try {
      const response = await getDeptAndDoc();
      const { data }: { data: DepartmentType[] } = response.data;
      console.log("The department and doctors data", data);
      setData(data);
      if (data.length > 0) {
        setDepartmentId(data[0].department_id);
      }
    } catch (error) {
      console.log("Error fetchinf data");
    }
  };

  useEffect(() => {
    fetching();
  }, []);

  const filteredDoctors = useMemo(() => {
    const dept = data?.find((d) => d.department_id === departmentID);
    return dept ? dept.doctors : [];
  }, [data, departmentID]);

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(to right, #f9fafb, #f1f5f9)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            // border: "1px solid",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <MedicalServicesIcon sx={{ color: "teal", fontSize: 26 }} />
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              Meet Our Doctors
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Browse and connect with doctors currently available in our hospital.
          </Typography>
        </Box>
        {/* Department Tabs */}
        <Box sx={{ pt: 2 }}>
          <Tabs
            value={departmentID}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {data?.length == 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  border: "1px dashed #cbd5e1",
                  p: 3,
                  mt: 2,
                  width: "100%",
                }}
              >
                <Grow in timeout={800}>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", fontWeight: 500 }}
                    textAlign="center"
                  >
                    No departments available
                  </Typography>
                </Grow>
              </Box>
            ) : (
              data?.map((dept: DepartmentType) => (
                <Tab
                  key={dept.department_id}
                  value={dept.department_id}
                  label={dept.department_name.toUpperCase()}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                />
              ))
            )}
          </Tabs>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pt: 1,
            pb: 4,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cbd5e1",
              borderRadius: 3,
            },
          }}
        >
          {filteredDoctors.length == 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                border: "1px dashed #cbd5e1",
                p: 3,
                mt: 2,
                minWidth: 250,
              }}
            >
              <Grow in timeout={800}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", fontWeight: 500 }}
                  textAlign="center"
                >
                  <em>Doctors currently unavailable</em>
                </Typography>
              </Grow>
            </Box>
          ) : (
            filteredDoctors?.map((doc: DoctorType, index: number) => (
              <Grow in key={index} timeout={800}>
                <Card
                  sx={{
                    minWidth: 250,
                    maxWidth: 280,
                    flexShrink: 0,
                    borderRadius: 3,
                    p: 1,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {doc.name.charAt(0)}
                      </Avatar>
                    }
                    titleTypographyProps={{ fontWeight: "bold" }}
                    title={doc.name}
                    subheader={doc.specialization}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Experience:{" "}
                      <strong>{doc.years_of_experience} years</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListDoctorDept;
