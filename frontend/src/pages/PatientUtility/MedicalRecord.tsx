import {
  Box,
  Card,
  Tooltip,
  CardContent,
  Divider,
  Typography,
  Grid,
  Chip,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getPatientMedicalReport } from "../../services/patientApi";
import AppointmentDetail from "./AppointmentDetail";
import { CalendarToday, LocalHospital, Person } from "@mui/icons-material";
import { sk } from "date-fns/locale";

export interface Patient {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  gender: string;
  created_at: string;
}
export interface Doctor {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
}
export interface Department {
  department_id: number;
  name: string;
  description: string;
  consultation_fee: string;
  created_at: string;
}
export interface Medicine {
  medicine_id: number;
  medicine_name: string;
  description: string;
  cost: string;
  expiry_date: string;
}
export interface Medication {
  medication_id: number;
  dosage: string;
  frequency: number;
  duration: number;
  instructions: string | null;
  medicine: Medicine;
}
export interface Prescription {
  prescription_id: number;
  diagnosis: string;
  prescribed_date: string;
  medications: Medication[];
}
export interface AppointmentType {
  appointment_id: number;
  appointment_date: string;
  status: string;
  reason_for_visit: string;
  notes?: string | null;
  doctor: Doctor;
  department: Department;
  prescriptions: Prescription[];
}
interface MedicalReport {
  record_id: number;
  notes?: string | null;
  patient: Patient;
}
export type Appointments = AppointmentType[];

export const DetailRow = ({
  label,
  value,
  labelColor = "#616161",
  valueColor = "#000",
  fontWeight = "normal",
}: {
  label: string;
  value?: string;
  labelColor?: string;
  valueColor?: string;
  fontWeight?: string;
}) => (
  <Typography
    variant="body2"
    sx={{
      mb: 1.5,
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      wordBreak: "break-word",
    }}
  >
    <span
      style={{
        marginRight: 8,
        color: labelColor,
        fontWeight: "600",
      }}
    >
      {label}:
    </span>
    <span
      style={{
        color: valueColor,
        fontWeight: fontWeight,
      }}
    >
      {value}
    </span>
  </Typography>
);
const MedicalRecord = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointments | null>(null);
  const [medical_report, setMedicalReport] = useState<MedicalReport | null>(
    null
  );

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);

  const fetching = async () => {
    const response = await getPatientMedicalReport();
    console.log(response.data);
    const { data, success } = response.data;
    if (success) {
      const { appointments, medical_report } = data;
      setAppointments(appointments);
      setMedicalReport(medical_report);
      setLoading(false);
    } else {
      setLoading(true);
    }
  };
  useEffect(() => {
    fetching();
  }, []);
  if (selectedAppointment) {
    return (
      <AppointmentDetail
        appointment={selectedAppointment}
        goback={() => setSelectedAppointment(null)}
      />
    );
  }
  return (
    <>
      <Box
        sx={{
          border: "1px solid  #ddd",
          borderRadius: "2",
          p: "2",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h2" gutterBottom textAlign={"center"}>
            Medical Report
          </Typography>

          {/* Patient Info */}
          <Card
            sx={{
              mb: 4,
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  p: 2,
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                <Person sx={{ fontSize: "28px" }} />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: "600",
                    fontSize: "1.25rem",
                    lineBreak: "break",
                  }}
                >
                  Patient Details
                </Typography>
              </Box>
              <Divider
                sx={{ mb: 3, borderColor: "#cbd5e1", borderWidth: "1px" }}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Name"
                        value={`${medical_report?.patient.first_name} ${medical_report?.patient.last_name}`}
                        labelColor="#374151"
                        valueColor="#1f2937"
                        fontWeight="600"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Email"
                        value={medical_report?.patient.email}
                        labelColor="#374151"
                        valueColor="#1f2937"
                        fontWeight="600"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Phone"
                        value={medical_report?.patient.phone_number}
                        valueColor="#1f2937"
                        fontWeight="600"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Date of Birth"
                        value={medical_report?.patient.date_of_birth}
                        valueColor="#1f2937"
                        fontWeight="600"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Gender"
                        value={medical_report?.patient.gender.toUpperCase()}
                        labelColor="#374151"
                        valueColor="#dc2626"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      background: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      height: "100%",
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <DetailRow
                        label="Address"
                        value={medical_report?.patient.address}
                        valueColor="#1f2937"
                        fontWeight="600"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Appointments
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>
            {appointments?.length == 0 ? (
              <>
                <Typography>No appointments so far</Typography>
              </>
            ) : (
              appointments?.map((appt: AppointmentType) => (
                <Tooltip
                  title={appt.reason_for_visit}
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        borderRadius: "8px",
                        padding: "8px 12px",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#1976d2",
                      },
                    },
                  }}
                >
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <Card
                      key={appt.appointment_id}
                      sx={{
                        mb: 3,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        background:
                          "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                        border: "1px solid #e0e6ed",
                        borderRadius: "12px",
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                          background:
                            "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                        },
                      }}
                      onClick={() => setSelectedAppointment(appt)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarToday
                              sx={{ color: "#1976d2", fontSize: "20px" }}
                            />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: "#2c5282",
                                fontWeight: "600",
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Date:{" "}
                              {new Date(
                                appt.appointment_date
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Typography>
                          </Box>
                          <Chip
                            label={appt.status.toUpperCase()}
                            size="small"
                            color={
                              appt.status === "completed"
                                ? "success"
                                : appt.status === "cancelled"
                                ? "error"
                                : appt.status === "confirmed"
                                ? "warning"
                                : "primary"
                            }
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.7rem",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#64748",
                            display: "block,mb:2",
                            fontFamily: "'Robot',sans-serif",
                          }}
                        >
                          ⏰{" "}
                          {new Date(appt.appointment_date).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Person sx={{ color: "#dc2626", fontSize: "20px" }} />
                          <Typography
                            variant="body1"
                            sx={{ color: "1e293b", fontWeight: "600" }}
                          >
                            Dr. {appt.doctor?.first_name}{" "}
                            {appt.doctor?.last_name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <LocalHospital
                            sx={{ color: "#059669", fontSize: "20px" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#374151",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            {appt.department.name}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#6b7280",
                              fontWeight: "500",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            REASON:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4b5563",
                              fontStyle: "italic",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            "{appt.reason_for_visit}"
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                            pt: 2,
                            borderTop: "2px dashed #e2e8f0",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#475569",
                              fontWeight: "500",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            Consultation Fee:
                          </Typography>
                          <Chip
                            label={`$${appt.department.consultation_fee}`}
                            color="primary"
                            variant="filled"
                            sx={{
                              fontWeight: "bold",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Tooltip>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default MedicalRecord;
