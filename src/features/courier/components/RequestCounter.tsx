import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Typography, CircularProgress } from "@mui/material";

interface Props {
  courierId: string;
}

const RequestCounter: React.FC<Props> = ({ courierId }) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    setLoading(true);

    if (!courierId) {
      setLoading(false);
      return;
    }

    const { count, error } = await supabase
      .from("requests")
      .select("*", { count: "exact", head: true })
      .eq("courierId", courierId);

    if (error) {
      console.error("Error fetching request count:", error.message);
    }

    setCount(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, [courierId]);

  return (
    <Typography variant="h6" sx={{ mt: 2 }}>
      Users who requested you:{" "}
      {loading ? (
        <CircularProgress size={20} sx={{ ml: 1 }} />
      ) : (
        <strong>{count}</strong>
      )}
    </Typography>
  );
};

export default RequestCounter;
