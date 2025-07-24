import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useAuth } from "../context/AuthProvider";
import { CircularProgress } from "@mui/material";

export const ProtectedRoute = ({
  role,
}: {
  role: "admin" | "user" | "courier";
}) => {
  const { user: supaUser, loading } = useAuth(); // Supabase ავტორიზაციის ჰუკი
  const auth = useAppSelector((state) => state.auth); // Redux სტეიტიდან ავტორიზაციის მონაცემების მიღება

  // ლოადერის ჩვენება, სანამ მონაცემები იტვირთება
  if (loading || auth.loading || !auth.role) {
    
    return <CircularProgress />;
  }

  // თუ მომხმარებელი არ არის ავტორიზებული ან როლი არ ემთხვევა, გადამისამართება შესვლის გვერდზე
  if (!supaUser || auth.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
