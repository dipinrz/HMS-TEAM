import { Box, Typography, Card, CardContent } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { getMedications } from "../../services/patientApi";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import DoseIcon from "@mui/icons-material/Medication";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
interface MedicineType {
  medicine_name: string;
  dosage: string;
  frequency: number;
  duration: number;
  start_date: string;
  end_date: string;
}
const TreatmentCourse = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [medications, setMedications] = useState<MedicineType[]>();
  const fetching = async () => {
    try {
      const response = await getMedications();
      const data = response.data;
      setMedications(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetching();
  }, []);

  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  const today = new Date();
  today.setHours(0, 0, 0);
  const filterMedicines = useMemo(() => {
    return medications?.filter((med: MedicineType) => {
      return new Date(med.end_date) > today ? true : false;
    });
  }, [medications]);
  return (
    <Box
      sx={{
        height: "100%",
        pt: 2,
        pb: 3,
      }}
    >
      <Typography
        textAlign="center"
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 500,
          color: "primary.dark",
          mb: 3,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 3,
            backgroundColor: "primary.main",
            borderRadius: 2,
          },
        }}
      >
        Medication Plan
      </Typography>

      {medications?.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 120,
            backgroundColor: "grey.50",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="body1" color="text.secondary" fontStyle="italic">
            No medication plan available
          </Typography>
        </Box>
      ) : (
        <Box
          ref={scrollRef}
          sx={{
            maxHeight: 180,
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 2,
            pt: 1,
            pl: 1,
            "&::-webkit-scrollbar": {
              height: 2,
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.light",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          {filterMedicines?.length == 0 ? (
            <Box
            sx={{p:2,width:"100%",border:"1px dashed",minHeight:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Typography> <em> No Medication Plans availble</em></Typography></Box>
          ) : (
            filterMedicines?.map((med, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: 220,
                  borderRadius: 3,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderLeft: " 2px solid",
                  borderColor: "primary.100",
                  transition: "all 0.2s ease",
                  overflow: "auto",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <MedicalInformationIcon
                        sx={{
                          color: "primary.main",
                          mr: 1.5,
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "primary.dark",
                        }}
                      >
                        {med.medicine_name}
                      </Typography>
                      <Box component="span" sx={{ fontWeight: 500, pl: 2 }}>
                        <Typography variant="caption">
                          {getDate(med.start_date)} - {getDate(med.end_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{}}>
                    <Box sx={{ display: "flex", mb: 1 }}>
                      <DoseIcon
                        sx={{
                          fontSize: 18,
                          color: "primary.main",
                          mr: 0.5,
                          mt: 0.2,
                        }}
                      />
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Dosage:{" "}
                        </Box>
                        {med.dosage}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mb: 1 }}>
                      <AccessTimeIcon
                        sx={{
                          fontSize: 18,
                          color: "primary.main",
                          mr: 0.5,
                        }}
                      />
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Frequency:{" "}
                        </Box>
                        {med.frequency}x / day
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mb: 1 }}>
                      <CalendarTodayIcon
                        sx={{
                          fontSize: 18,
                          color: "primary.main",
                          mr: 1.5,
                          mt: 0.2,
                        }}
                      />
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 500 }}>
                          Duration:{" "}
                        </Box>
                        {med.duration} days
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default TreatmentCourse;
