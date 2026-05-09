import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import resetPasswordImg from "../../assets/images/reset-password.png";

const isStrongPassword = (password = "") => {
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isSubmitting, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setLocalError("");
    setSuccessMessage("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError("");
    setSuccessMessage("");

    if (!formData.password || !formData.confirmPassword) {
      setLocalError("Both password fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setLocalError(
        "Password must be at least 8 characters and include 1 uppercase letter and 1 special character"
      );
      return;
    }

    const result = await resetPassword(token, {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (result.success) {
      setSuccessMessage(result.message);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] xl:grid-cols-[1fr_1fr]">
          <div className="bg-white">
            <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-6 py-6 sm:px-8 lg:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                  Set New Password
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                  Reset your password
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Create a new password for your account to regain access and keep your account secure.
                </p>
              </div>

              {(error || localError) && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {localError || error}
                </div>
              )}

              {successMessage && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
                  Password must be at least 8 characters and include 1 uppercase letter and 1 special character.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden min-h-[640px] items-center justify-center overflow-hidden bg-slate-950 xl:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18),transparent_55%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />

            <img
              src={resetPasswordImg}
              alt="Reset password visual"
              className="relative z-10 max-h-[520px] w-[78%] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}