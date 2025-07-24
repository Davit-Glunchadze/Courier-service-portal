import { Box, Card, CardContent, Typography } from '@mui/material';

const CourierScheduleCard = ({ courier }: { courier: any }) => (
  <Card>
    <CardContent>
      <Typography variant="subtitle1">
        {courier.firstName} {courier.lastName || ''}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Vehicle: {courier.vehicle}
      </Typography>

      <Box mt={1}>
        {courier.workingDays.map((d: any, i: number) => (
          <Typography key={i} variant="body2">
            {d.day.charAt(0).toUpperCase() + d.day.slice(1)}: {d.startHours} – {d.endHours}
          </Typography>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default CourierScheduleCard;
