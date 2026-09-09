import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import { useState, type SubmitEvent } from "react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/reports" replace />;
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setError(null);
      setIsSubmitting(true);

      await login({ email, password });
      navigate("/reports");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
