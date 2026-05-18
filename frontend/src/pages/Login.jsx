import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setServerError("");
        const data = await api("POST", "/users/login", values);
        login(data.token, data.user);
      } catch (err) {
        setServerError(err.message);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_20%_50%,#1a1040_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,#0d1a40_0%,transparent_60%)] bg-bg">
      <div className="bg-surface border border-border rounded-[20px] p-10 w-full max-w-[440px]">
        <div className="font-syne text-3xl font-extrabold bg-gradient-to-br from-accent to-accent2 bg-clip-text text-transparent mb-1">
          Taskflow
        </div>
        <div className="text-muted text-sm mb-8">
          Your intelligent todo companion
        </div>

        <div className="flex gap-2 mb-8 bg-surface2 rounded-xl p-1">
          <button className="flex-1 p-2.5 bg-accent text-white font-sans text-sm rounded-lg transition-all">
            Sign In
          </button>
          <Link
            to="/register"
            className="flex-1 p-2.5 text-center text-muted font-sans text-sm rounded-lg transition-all hover:text-text hover:bg-surface/50"
          >
            Create Account
          </Link>
        </div>

        {serverError && <div className="error-msg">{serverError}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-4">
            <label>Email</label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="you@email.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-danger text-xs mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div className="form-group mb-6">
            <label>Password</label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-danger text-xs mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <button type="submit" disabled={formik.isSubmitting} className="btn">
            {formik.isSubmitting ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
