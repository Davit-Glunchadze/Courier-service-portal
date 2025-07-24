import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Box, Typography, CircularProgress } from "@mui/material";
import CourierScheduleCard from "./CourierScheduleCard";

interface Props {
  myEmail: string;
}

const OtherCouriersList: React.FC<Props> = ({ myEmail }) => {
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOthers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("couriers")
      .select("*")
      .neq("email", myEmail);

    if (!error && data) setCouriers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOthers();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Other Couriers' Schedules
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2}>
        {couriers.map((c) => (
          <Box key={c.email} flex="1 1 300px" minWidth="300px">
            <CourierScheduleCard courier={c} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OtherCouriersList;
