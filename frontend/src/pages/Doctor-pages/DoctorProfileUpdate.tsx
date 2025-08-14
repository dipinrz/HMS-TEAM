import { useEffect, useState } from "react"
import { useDoctorStore } from "../../store/doctorStore"
import { Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material"




const DoctorProfileUpdate = () => {
  const {doctor,fetchDoctorProfile,updateDoctorProfile,loading}=useDoctorStore();


  const [formData,setFormData]=useState(
    {first_name:"",
    last_name:"",
    specialization: "",
    phone_number: "",
    email:"",
    address:"",
    gender:"",
    date_of_birth:"",
    years_of_experience:0,
    qualification:"",
    license_number:"",
  }
  )
  useEffect(()=>{
    fetchDoctorProfile()
  },[fetchDoctorProfile])
      
  useEffect(()=>{
    if(doctor){
      setFormData({
        first_name:doctor.user?.first_name || "",
        last_name:doctor.user?.last_name || "",
        email:doctor.user?.email || "",
        phone_number:doctor.user?.phone_number || "",
        address:doctor.user?.address||"",
        gender:doctor.user?.gender||"",
        date_of_birth:doctor.user.date_of_birth || "",
        specialization:doctor.specialization ||"",
        qualification:doctor.qualification || "",
        license_number:doctor.license_number ||"",
        years_of_experience:Number(doctor.years_of_experience),
      });
    }
  },[doctor])

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:type==='number'?Number(value):value,
    });
  };

  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    if(!doctor)return;
    console.log("FOrm data from profile page",formData)
    updateDoctorProfile(formData);
    
  }
   if (loading && !doctor) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box p={4} maxWidth="600px" mx="auto">
      <Typography variant="h5" mb={3}>
        Update Doctor Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{xs:12 ,sm:6}} >
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{xs:12, sm:6}} >
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="License Number"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{xs:12}} >
            <TextField
              fullWidth
              label="Experience (Years)"
              name="years_of_experience"
              type="number"
              value={formData.years_of_experience}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </form>
    </Box>
  );
}

export default DoctorProfileUpdate
