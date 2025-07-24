import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

const CourierEditPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      vehicle: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.email) return;
      const { data } = await supabase
        .from("couriers")
        .select("*")
        .eq("email", user.email)
        .single();

      if (data) form.reset(data);
    };

    loadData();
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: any) => {
    if (!user?.email) return;
    setLoading(true);

    const { error } = await supabase
      .from("couriers")
      .update(values)
      .eq("email", user.email);

    setLoading(false);

    if (!error) {
      setSnackbar({ message: "Changes saved successfully!", type: "success" });
      setTimeout(() => navigate("/courier/dashboard"), 1500);
    } else {
      setSnackbar({ message: "Failed to update info.", type: "error" });
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Edit Your Info
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        First Name
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          {...register("firstName", {
            required: "First name is required",
            minLength: { value: 2, message: "Too short" },
          })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        Last Name
        <TextField fullWidth sx={{ mb: 2 }} {...register("lastName")} />
        Phone Number
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9+\-()\s]{9,}$/,
              message: "Invalid phone format",
            },
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
        />
        Vehicle
        <TextField
          fullWidth
          sx={{ mb: 2 }}
          {...register("vehicle", {
            required: "Vehicle is required",
          })}
          error={!!errors.vehicle}
          helperText={errors.vehicle?.message}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save Changes"}
        </Button>
      </form>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar?.type}
          onClose={() => setSnackbar(null)}
          sx={{ width: "100%" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourierEditPage;
