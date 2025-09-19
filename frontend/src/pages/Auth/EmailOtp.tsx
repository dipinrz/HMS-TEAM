import CustomInput from "../../components/ui/CustomInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import CustomButton from "../../components/ui/CustomButton";
import { useState } from "react";
import { sendingOTP, VerifiyingOTp } from "../../services/allAPI";

export type EmailData = {
  email: string;
  otp?: Number;
};
type Props = {
  setIsOtpVerify: (arg: boolean) => void;
  setVerifiedEmail: (email: string) => void;
};
function EmailOtp({ setIsOtpVerify, setVerifiedEmail }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<EmailData>();

  const [isLoading, setIsLoading] = useState(false);
  const [isSendOtp, setIsSendOtp] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<EmailData> = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      if (!isSendOtp) {
        const response = await sendingOTP(data);
        if (response.status == 200) {
          setIsSendOtp(true);
          // Save email inside form state (even though input is hidden later)
          setValue("email", data.email);
        }
      } else {
        const response = await VerifiyingOTp({
          email: getValues("email"),
          otp: data.otp,
        });
        alert("otp verified");
        setIsOtpVerify(true);

        if (response.status == 200) {
          setVerifiedEmail(getValues("email")); // send email back to parent
          setIsOtpVerify(true);
        }
      }
    } catch (error: any) {
      console.log("Error sending otp");
      setIsOtpVerify(false);
      setServerError(error?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isSendOtp && (
          <CustomInput
          fullWidth
            label="Email Address"
            {...register("email", { required: "Email is Required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
        {isSendOtp && <input type="hidden" {...register("email")} />}

        {isSendOtp && (
          <CustomInput
            label="Enter OTP"
            variant="outlined"
            fullWidth
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            {...register("otp", {
              required: "OTP is required",
              minLength: { value: 6, message: "Must be 6 digits" },
              maxLength: { value: 6, message: "Must be 6 digits" },
            })}
            error={!!errors.otp}
            helperText={errors.otp?.message}
          />
        )}

        <div style={{ minHeight: "20px" }}>
          {serverError && (
            <p
              style={{
                color: "red",
                marginTop: "4px",
                fontSize: "0.85rem",
              }}
            >
              {serverError}
            </p>
          )}
        </div>
        <CustomButton
          type="submit"
          fullWidth
          disabled={isLoading}
          variant="contained"
          label={
            isLoading
              ? !isSendOtp
                ? "Sending.."
                : "Verifying.."
              : !isSendOtp
              ? "Send OTP"
              : "Verify"
          }
          sx={{
            mt: 3,
            height: 44,
            borderRadius: "12px",
            background:
              "linear-gradient(to bottom right, #4772e1ff, #1b1857ff)",
            boxShadow: 3,
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(to top left, #04064dff, #424bd1ff)",
            },
          }}
        />
      </form>
    </>
  );
}

export default EmailOtp;
