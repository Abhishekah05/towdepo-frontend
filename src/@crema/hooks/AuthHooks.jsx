// ForJWT Auth
import { getUserFromJwtAuth } from "@crema/helpers/AuthHelper";
import {
  useJWTAuth,
  useJWTAuthActions,
} from "@crema/services/auth/jwt-auth/JWTAuthProvider";

export const useAuthUser = () => {
  const { user, isAuthenticated, isLoading } = useJWTAuth();
  const parsedUser = getUserFromJwtAuth(user); // Assuming this extracts the user correctly
  return {
    isLoading,
    isAuthenticated,
    user: parsedUser,
    role: parsedUser?.role, // Ensure `role` directly reflects the user's role
  };
};

export const useAuthMethod = () => {
  const { signInUser, signUpUser, logout } = useJWTAuthActions();

  return {
    signInUser,
    logout,
    signUpUser,
  };
};
