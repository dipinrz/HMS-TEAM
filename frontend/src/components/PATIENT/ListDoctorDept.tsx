import {
  Avatar,
  Box,
  CardContent,
  Grow,
  Tab,
  Tabs,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDeptAndDoc } from "../../services/patientApi";
import { Card, CardHeader } from "../ui/CustomCards";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import img from "../../assets/images/doctor.png";
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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 1, // scroll one card width
          behavior: "smooth",
        });
      }
    }, 10); // every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredDoctors = useMemo(() => {
    const dept = data?.find((d) => d.department_id === departmentID);
    return dept ? dept.doctors : [];
  }, [data, departmentID]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "center",
          gap: 2,
          pl: 2,
          backgroundColor: "white",
        }}
      >
        <MedicalServicesIcon sx={{ color: "teal", fontSize: 26 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Meet Our Doctors
        </Typography>
      </Box>

      <Grid
        container
        sx={{
          pl: 2,
          pr: 1,
          borderRadius: 3,
          background: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            <em>
              {" "}
              Browse and connect with doctors currently available in our
              hospital.
            </em>
          </Typography>

          <Box>
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
                    mt: 1,
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

            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                gap: 3,
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                  display: "none",
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
                    minWidth: 250,
                    height: 150,
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
                        slotProps={{
                          title: {
                            fontWeight: "bold",
                          },
                        }}
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
        </Grid>

        {/* Image  */}
        <Grid
          size={{ md: 3 }}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 200, ml: { md: 5 } }}>
            <img
              src={img}
              alt="Medical illustration"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ListDoctorDept;
