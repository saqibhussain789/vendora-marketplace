const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  addresses: user.addresses,
  createdAt: user.createdAt,
});

export const sellerDashboard = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to seller dashboard",
    user: serializeUser(req.user),
  });
};

export const adminDashboard = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to admin dashboard",
    user: serializeUser(req.user),
  });
};