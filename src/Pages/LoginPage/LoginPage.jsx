import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../../services/Auth";

export const LoginMain = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginUser(username, password);
      navigate("/create", { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputChange() {
    if (error) {
      setError("");
    }
  }

  return (
    <div className="w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
      <form onSubmit={handleSubmit} noValidate>
        <h5 className="text-xl font-semibold text-heading mb-6">Sign in to our platform</h5>

        {error && (
          <div
            className="mb-4 flex items-start gap-2.5 rounded-base border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
            role="alert"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z"
              />
            </svg>
            <span className="flex-1 leading-5">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block mb-2.5 text-sm font-medium text-heading">
            Your username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleInputChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="johndoe"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">
            Your password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleInputChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="•••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 text-blue-700 bg-brand box-border border border-b-blue-400 hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Login to your account"}
        </button>
        <div className="text-sm font-medium text-body">
          Not registered?{" "}
          <Link to="/signup" className="text-fg-brand hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginMain;
