import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const inputStyles =
  "w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

const RegisterPage = () => {
  const navigate = useNavigate();

  const register = useAuthStore(
    (state) => state.register
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await register(formData);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Create account
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
              Join Servio to discover trusted
              local services near you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {error && (
              <div className="px-4 py-3 rounded-2xl border border-red-200 bg-red-50 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full name
              </label>

              <input
                type="text"
                name="full_name"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>

              <input
                type="text"
                name="username"
                placeholder="@johndoe"
                value={formData.username}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                State
              </label>

              <input
                type="text"
                name="state"
                placeholder="Lagos"
                value={formData.state}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputStyles} pr-20`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-violet-700"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-violet-700 text-white font-semibold transition hover:bg-violet-800 disabled:opacity-70 shadow-lg shadow-violet-200"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-linear-to-br from-violet-700 via-violet-500 to-fuchsia-400">
        <div className="absolute -top-30 -right-30 w-[320px] h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-35 -left-35 w-[320px] h-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-2xl px-10">
          <img
            src="/login-illustration.png"
            alt="Servio"
            className="w-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;