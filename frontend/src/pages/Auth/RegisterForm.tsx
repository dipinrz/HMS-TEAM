import React, { useState } from 'react'
import CustomInput from '../../components/ui/CustomInput'
import CustomButton from '../../components/ui/CustomButton'
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";
import {
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {  useNavigate } from "react-router-dom";

type RegisterFormProps = {
  email: string;
};

const RegisterForm = ({ email }: RegisterFormProps) => {
     const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      
       const [formData, setFormData] = useState({
          first_name: "",
          last_name: "",
          email: email,
          password: "",
          confirmPassword: "",
        });
        const [isLoading, setIsLoading] = useState(false);
        const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
     <form onSubmit={handleSubmit}>
                <CustomInput
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <CustomInput
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />

                <CustomInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  disabled
                />


                <CustomInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <CustomButton
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  variant="contained"
                  label={isLoading ? "Creating Account..." : "Register"}
                  sx={{
                    mt: 3,
                    height: 44,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
                    boxShadow: 3,
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(to top left, #04064dff, #424bd1ff)",
                    },
                  }}
                />
              </form> 
    </>
  )
}

export default RegisterForm