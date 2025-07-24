import { Box, Typography, Avatar } from '@mui/material';

// კურიერის ინფო ბარათი კომპონენტი
const CourierInfoCard = ({ courier }: { courier: any }) => (
  <Box sx={{ mb: 4 }}>
    <Avatar src={courier.profileImage} sx={{ width: 80, height: 80 }} />
    <Typography variant="h6">{courier.firstName} {courier.lastName}</Typography>
    <Typography>Vehicle: {courier.vehicle}</Typography>
    <Typography>Email: {courier.email}</Typography>
    <Typography>Phone: {courier.phoneNumber}</Typography>
  </Box>
);

export default CourierInfoCard;
