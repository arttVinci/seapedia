import type { User, AuthResponse, LoginPayload, RegisterPayload } from "../@types/models";

const MOCK_USERS: User[] = [
  { id: 1, email: "buyer@seapedia.com", name: "Buyer User", roles: ["buyer"] },
  { id: 2, email: "seller@seapedia.com", name: "Seller User", roles: ["buyer", "seller"] },
  { id: 3, email: "driver@seapedia.com", name: "Driver User", roles: ["buyer", "driver"] },
  { id: 4, email: "admin@seapedia.com", name: "Admin User", roles: ["admin"] },
  { id: 5, email: "multi@seapedia.com", name: "Multi User", roles: ["buyer", "seller", "driver"] },
];

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.email === payload.email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      user,
      token: "mock-jwt-token-123456",
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 10,
      email: payload.email,
      name: payload.name,
      roles: ["buyer"], 
    };

    return {
      user: newUser,
      token: "mock-jwt-token-789012",
    };
  }
};
