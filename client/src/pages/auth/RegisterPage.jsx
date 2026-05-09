import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/getDashboardPath";
import registerImg from "../../assets/images/Register.png";

const getPasswordChecks = (password = "") => ({
  minLength: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  specialChar: /[^A-Za-z0-9]/.test(password),
});

export default function RegisterPage() {
  const { register, error, clearError, isSubmitting } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);

  const passwordChecks = useMemo(() => {
    return getPasswordChecks(formData.password);
  }, [formData.password]);

  const isPasswordStrong =
    passwordChecks.minLength &&
    passwordChecks.uppercase &&
    passwordChecks.specialChar;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const showPasswordHints = formData.password.length > 0;
  const showConfirmHint = formData.confirmPassword.length > 0;

  const handleChange = (e) => {
    setLocalError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!isPasswordStrong) {
      setLocalError(
        "Password must be at least 8 characters and include 1 uppercase letter and 1 special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    };

    const result = await register(payload);

    if (result.success) {
      navigate(getDashboardPath(result.user.role), { replace: true });
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
                  Create Account
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                  Register your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Join the marketplace to start shopping or selling.
                </p>
              </div>

              {(error || localError) && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {localError || error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full name
                    </label>
                    <div className="relative">
                      <User
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Account type
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Password
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
                        placeholder="Create password"
                        className={`h-12 w-full rounded-2xl bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:bg-white ${
                          showPasswordHints && !isPasswordStrong
                            ? "border border-amber-300 focus:border-amber-400"
                            : "border border-slate-200 focus:border-teal-500"
                        }`}
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

                    {showPasswordHints ? (
                      <div className="mt-2 space-y-1 text-xs">
                        <p
                          className={
                            passwordChecks.minLength
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }
                        >
                          • Minimum 8 characters
                        </p>
                        <p
                          className={
                            passwordChecks.uppercase
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }
                        >
                          • At least 1 uppercase letter
                        </p>
                        <p
                          className={
                            passwordChecks.specialChar
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }
                        >
                          • At least 1 special character
                        </p>
                      </div>
                    ) : null}
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
                      placeholder="Confirm your password"
                      className={`h-12 w-full rounded-2xl bg-slate-50 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:bg-white ${
                        showConfirmHint && !passwordsMatch
                          ? "border border-red-300 focus:border-red-400"
                          : "border border-slate-200 focus:border-teal-500"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>

                  {showConfirmHint ? (
                    <p
                      className={`mt-2 text-xs ${
                        passwordsMatch ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  Login here
                </Link>
              </div>

              <p className="mt-4 text-xs leading-6 text-slate-500">
                By creating an account, you agree to join our secure multi-vendor marketplace platform.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[640px] items-center justify-center overflow-hidden bg-slate-950 xl:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18),transparent_55%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />

            <img
              src={registerImg}
              alt="Register visual"
              className="relative z-10 max-h-[520px] w-[78%] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}