import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { getPatientById, updatePatient } from "../services/patientApi";
import { toast } from "react-toastify";
import {
    TextField,
    Grid,
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CustomButton from "../components/ui/CustomButton";
import CustomModal from "../components/ui/CustomModal";

function ProfilePage() {
    const { user } = useAuthStore();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        date_of_birth: "",
        gender: "",
        blood_group: "",
        height: "",
        weight: "",
        allergies: "",
    });

    const [editData, setEditData] = useState({ ...formData });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openEditModal, setOpenEditModal] = useState(false);

    const viewData = async () => {
        if (user?.user_id !== undefined) {
            try {
                const res = await getPatientById(user.user_id);
                const patient = res.data.patient;

                const fetchedData = {
                    first_name: patient.user.first_name || "",
                    last_name: patient.user.last_name || "",
                    email: patient.user.email || "",
                    phone_number: patient.user.phone_number || "",
                    address: patient.user.address || "",
                    date_of_birth: patient.user.date_of_birth || "",
                    gender: patient.user.gender || "",
                    blood_group: patient.blood_group || "",
                    height: patient.height || "",
                    weight: patient.weight || "",
                    allergies: patient.allergies || "",
                };

                setFormData(fetchedData);
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        }
    };

    useEffect(() => {
        viewData();
    }, [user]);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (data: Record<string, any>) => {
        let valid = true;
        const newErrors: Record<string, string> = {};

        Object.entries(data).forEach(([key, value]) => {
            if (!value || String(value).trim() === "") {
                newErrors[key] = `${key.replace(/_/g, " ")} is required`;
                valid = false;
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleOpenModal = () => {
        setEditData(formData); 
        setErrors({});
        setOpenEditModal(true);
    };

    const handleSaveChanges = async () => {
        if (user?.user_id) {
            const { email, ...formDataWithoutEmail } = editData;

            if (!validateForm(formDataWithoutEmail)) {
                return; // stop if validation fails
            }

            try {
                await updatePatient(formDataWithoutEmail);
                toast.success("Patient profile updated successfully!");
                setFormData(editData); 
                setOpenEditModal(false);
            } catch (error) {
                console.error("Error updating patient:", error);
                toast.error("Patient profile update failed");
            }
        }
    };

    const formContent = (
        <Grid container spacing={2}>
            {Object.keys(editData).map((key) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                    {key === "gender" ? (
                        <FormControl fullWidth margin="normal" required error={!!errors[key]}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                            name="gender"
                            label='gender'
                                value={editData.gender || ""}
                                onChange={(e) =>
                                    setEditData({ ...editData, gender: e.target.value })
                                }
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </Select>
                            {errors[key] && (
                                <Typography variant="caption" color="error">
                                    {errors[key]}
                                </Typography>
                            )}
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth
                            label={key
                                .split("_")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            name={key}
                            value={(editData as any)[key]}
                            onChange={handleEditChange}
                            margin="normal"
                            disabled={key === "email"}
                            required={key !== "email"}
                            error={!!errors[key]}
                            helperText={errors[key]}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                        borderColor: "#020aa5",
                                    },
                                },
                            }}
                        />
                    )}
                </Grid>
            ))}
        </Grid>
    );


    return (
        <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: 'white', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, padding: 2, background: "linear-gradient(135deg, #020aa5 0%, #0a036b 100%)", color: 'white', borderRadius: 1 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Patient Profile
                    </Typography>
                    <CustomButton
                        label="Edit Profile"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={handleOpenModal}
                        sx={{
                            backgroundColor: 'white',
                            color: '#020aa5',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                        }}  
                    />
                </Box>

                {/* Avatar and Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4, padding: 3, background: 'rgba(2,10,165,0.05)', borderRadius: 1, borderLeft: '4px solid #020aa5' }}>
                    <Avatar sx={{ width: 80, height: 80, marginRight: 3, backgroundColor: '#0a036b', fontSize: '2rem', color: 'white' }}>
                        {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#020aa5' }}>
                            {formData.first_name} {formData.last_name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0a036b' }}>
                            {formData.email}
                        </Typography>
                        <Chip label={formData.gender || 'Not specified'} sx={{ marginTop: 1, backgroundColor: 'rgba(10,3,107,0.1)', color: '#0a036b' }} />
                    </Box>
                </Box>

                {/* Info Fields */}
                <Grid container spacing={3}>
                    {Object.entries(formData).map(([key, value]) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={key}>
                            <Paper elevation={0} sx={{ padding: 2, borderRadius: 1, borderLeft: `4px solid #0a036b`, backgroundColor: 'rgba(10,3,107,0.03)', '&:hover': { backgroundColor: 'rgba(10,3,107,0.05)' } }}>
                                <Typography variant="subtitle2" sx={{ color: '#0a036b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Typography>
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary, marginTop: 1 }}>
                                    {value || "Not Provided"}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Edit Modal */}
                <CustomModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    title="Edit Profile"
                    content={formContent}
                    actions={
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <CustomButton
                                label="Cancel"
                                color="secondary"
                                onClick={() => setOpenEditModal(false)}
                                sx={{
                                    borderColor: '#0a036b',
                                    color: '#0a036b',
                                    '&:hover': { backgroundColor: 'rgba(10,3,107,0.05)' }
                                }}
                            />
                            <CustomButton
                                label="Save Changes"
                                color="primary"
                                onClick={handleSaveChanges}
                                sx={{
                                    background: "linear-gradient(135deg, #020aa5 0%, #0a036b 100%)",
                                    color: 'white',
                                    '&:hover': { opacity: 0.9 }
                                }}
                            />
                        </Box>
                    }
                    maxWidth="md"
                />
            </Paper>
        </Box>
    );
}

export default ProfilePage;
