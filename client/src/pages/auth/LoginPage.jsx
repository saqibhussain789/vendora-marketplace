import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../utils/getDashboardPath";
import loginImg from "../../assets/images/Login.png"

export default function LoginPage() {
  const {
    login,
    user,
    error,
    clearError,
    isAuthenticated,
    authChecked,
    isSubmitting,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname;

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (authChecked && isAuthenticated && user) {
      navigate(from || getDashboardPath(user.role), { replace: true });
    }
  }, [authChecked, isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (result.success) {
      navigate(from || getDashboardPath(result.user.role), { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] xl:grid-cols-[1.05fr_0.95fr]">
         <div className="relative hidden min-h-[720px] items-center justify-center overflow-hidden bg-slate-950 xl:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18),transparent_55%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />

            <img
              src={loginImg}
              alt="Login visual"
              className="relative z-10 max-h-[540px] w-[78%] object-contain"
            />
          </div>

          <div className="bg-white">
            <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
              <div className="xl:hidden">
                <img
                  src={loginImg}
                  alt="Login visual"
                  className="mx-auto mb-8 max-h-[220px] w-full max-w-[280px] object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-600">
                  Account Login
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Login to your account
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter your details below to access your dashboard and continue shopping or selling.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                New here?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-slate-900 hover:text-teal-700"
                >
                  Create your account
                </Link>
              </div>

              <p className="mt-6 text-xs leading-6 text-slate-500">
                By continuing, you agree to access your account securely within our marketplace platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}