import { Box, Typography } from '@mui/material';

const CourierSchedule = ({ workingDays }: { workingDays: any[] }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6">My Working Schedule</Typography>
    {workingDays.map((d, i) => (
      <Typography key={i}>
        {d.day.charAt(0).toUpperCase() + d.day.slice(1)} – {d.startHours} to {d.endHours}
      </Typography>
    ))}
  </Box>
);

export default CourierSchedule;
