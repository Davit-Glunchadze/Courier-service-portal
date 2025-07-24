import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseForm } from "../../../components/form/BaseForm";
import type { CourierRegisterInput } from "../../../types/courier";
import { courierSchema } from "../validation/courierSchema";
import WorkingDaySelector from "./WorkingDaySelector";
import type { Field } from "../../../components/form/BaseForm";
import { useState } from "react";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router-dom";

const confirmedRedirectUrl = "http://localhost:5173/courier/confirmed";

const CourierRegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const [invalid, setInvalid] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const form = useForm<CourierRegisterInput>({
    resolver: zodResolver(courierSchema),
    defaultValues: {
      role: "courier",
      firstName: "",
      lastName: "",
      pid: "",
      phoneNumber: "",
      email: "",
      password: "",
      profileImage: "",
      vehicle: "",
      workingDays: [],
    },
  });

  const fields: Field<CourierRegisterInput>[] = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name", optional: true },
    { name: "pid", label: "Personal ID" },
    { name: "phoneNumber", label: "Phone Number" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "vehicle", label: "Vehicle" },
    { name: "profileImage", label: "Profile Image (URL)", optional: true },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image files are allowed.");
      setSnackbarOpen(true);
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      form.setValue("profileImage", imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      setErrorMsg("Image upload failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (formData: CourierRegisterInput) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          role: "courier",
        },
        emailRedirectTo: confirmedRedirectUrl,
      },
    });

    if (authError || !authData.user) {
      if (authError?.message?.includes("already registered")) {
        setErrorMsg("This email is already registered. Try logging in.");
      } else {
        setErrorMsg(authError?.message || "Registration failed. Please try again.");
      }
      setSnackbarOpen(true);
      return;
    }

    const userId = authData.user.id;
    const { error: dbError } = await supabase.from("couriers").insert({
      ...formData,
      user_id: userId,
    });

    if (dbError) {
      console.error("DB insert error:", dbError.message);
      if (dbError.message.includes("duplicate")) {
        setErrorMsg("A courier with this PID or email already exists.");
      } else {
        setErrorMsg("Failed to save your data. Please contact support.");
      }
      setSnackbarOpen(true);
      return;
    }

    form.reset();
    navigate("/courier/email-sent");
  };

  return (
    <>
      <BaseForm
        title="Register as Courier"
        fields={fields}
        form={form}
        onSubmit={onSubmit}
        submitButtonProps={{ disabled: invalid }}
      >
        <WorkingDaySelector
          control={form.control}
          onValidationChange={setInvalid}
        />

        <Box mt={2}>
          <Button
            variant="outlined"
            component="label"
            disabled={uploading || invalid}
          >
            Upload Profile Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>

          {uploading && <CircularProgress size={24} sx={{ ml: 2 }} />}

          {form.watch("profileImage") && (
            <Box mt={2}>
              <img
                src={form.watch("profileImage")}
                alt="Preview"
                width={100}
                height={100}
                style={{ borderRadius: 8 }}
              />
            </Box>
          )}
        </Box>
      </BaseForm>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourierRegisterForm;
