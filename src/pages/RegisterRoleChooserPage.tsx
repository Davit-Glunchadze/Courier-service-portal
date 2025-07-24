import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

const RegisterRoleChooserPage = () => {
  const navigate = useNavigate();

  const handleChoose = (role: "admin" | "user" | "courier") => {
    navigate(`/${role}/register`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Register as:
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mt={4}>
        <Button variant="contained" onClick={() => handleChoose("admin")}>
          Admin
        </Button>
        <Button variant="contained" onClick={() => handleChoose("user")}>
          User
        </Button>
        <Button variant="contained" onClick={() => handleChoose("courier")}>
          Courier
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" gap={2} mt={4}>
        <LoginPage />
      </Box>
    </Box>
  );
};

export default RegisterRoleChooserPage;
