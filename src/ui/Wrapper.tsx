import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";

export const Wrapper = () => {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
};
