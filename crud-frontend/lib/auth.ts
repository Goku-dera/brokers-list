// lib/auth.ts

// ✅ ดึง Token
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// ✅ ดึง User
export const getUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ เช็คว่า Login อยู่ไหม
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// ✅ Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};