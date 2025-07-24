import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { supabase } from "../utils/supabase";
import RequestCounter from "../features/courier/components/RequestCounter";
import CourierInfoCard from "../features/courier/components/CourierInfoCard";
import CourierSchedule from "../features/courier/components/CourierSchedule";
import OtherCouriersList from "../features/courier/components/OtherCouriersList";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const CourierDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [courier, setCourier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourier = async () => {
    if (!user?.email) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("couriers")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!error) setCourier(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourier();
  }, [user?.email]);

  if (loading || !courier) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = () => {
    navigate("/courier/edit");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1800px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Courier Dashboard
      </Typography>

      {/* Top section: Info and Stats */}
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 4 }}>
        <CourierInfoCard courier={courier} />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        gap={2}
        mb={2}
        marginBottom={10}
      >
        <Button variant="outlined" color="primary" onClick={handleEdit}>
          Edit Info
        </Button>
      </Box>

      {/* Schedule */}
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Weekly Schedule
        </Typography>
        <CourierSchedule workingDays={courier.workingDays} />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        gap={2}
        mb={2}
        marginBottom={10}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/courier/edit-schedule")}
        >
          Edit Working Days
        </Button>
      </Box>

      {/* Other Couriers */}
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
        <OtherCouriersList myEmail={courier.email} />
      </Box>
      <Box sx={{ p: 2, borderRadius: 2, boxShadow: 2, mb: 4, marginTop: 5 }}>
        <RequestCounter courierId={courier.id} />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        gap={2}
        mb={2}
        marginTop={5}
      >
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default CourierDashboard;
