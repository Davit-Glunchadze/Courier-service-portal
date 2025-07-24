import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authError = useAppSelector((state) => state.auth.error);
  const [btnLoading, setBtnLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"courier" | "admin" | "user">("courier");

  const handleLogin = async () => {
    setBtnLoading(true);

    const result = await dispatch(
      loginUser({ email, password, role: selectedRole })
    );

    if (loginUser.fulfilled.match(result)) {
      navigate(`/${selectedRole}/dashboard`);
    }

    setBtnLoading(false);
    setEmail("");
    setPassword("");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" mb={2}>Login</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as any)}
        >
          <MenuItem value="courier">Courier</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Email"
        fullWidth
        sx={{ mb: 2 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        disabled={btnLoading}
      >
        {btnLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Login"}
      </Button>

      {authError && (
        <Typography color="error" mt={2}>
          {authError}
        </Typography>
      )}
    </Box>
  );
};

export default LoginPage;
