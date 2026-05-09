export const getDashboardPath = (role) => {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/dashboard";
};