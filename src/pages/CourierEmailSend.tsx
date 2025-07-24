import { Typography, Box} from "@mui/material";
import React from "react";

const CourierEmailSend: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Please Confirm Your Email 📧
      </Typography>

      <Typography mb={3}>
        We've sent a confirmation link to your email. <br />
        Please check your inbox and confirm your account before logging in.
      </Typography>
    </Box>
  );
};
export default CourierEmailSend;
