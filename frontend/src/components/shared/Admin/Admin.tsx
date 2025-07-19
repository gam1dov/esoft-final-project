import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import type React from "react";

const Admin = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useAppSelector((state) => state.auth);

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export default Admin;
