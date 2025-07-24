import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CourierConfirmedPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Email Confirmed ✅
      </Typography>
      <Typography mb={3}>You can now log in to your courier account.</Typography>

      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Login
      </Button>
    </Box>
  );
};

export default CourierConfirmedPage;
