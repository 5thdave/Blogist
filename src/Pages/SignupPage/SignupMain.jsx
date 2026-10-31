import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../../services/Auth";

const SignupMain = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const conpassword = formData.get("conpassword")?.toString();
    
    if (!username || !email || !password || !conpassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== conpassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({ username, email, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
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
        <h5 className="text-xl font-semibold text-heading mb-6">Sign Up on our platform</h5>

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
          <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">
            Username
          </label>
          <input
            type="text"
            id="name"
            name="username"
            onChange={handleInputChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="johndoe"
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">
            Your email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleInputChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="example@company.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
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
            autoComplete="new-password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="conpassword" className="block mb-2.5 text-sm font-medium text-heading">
            Confirm password
          </label>
          <input
            type="password"
            id="conpassword"
            name="conpassword"
            onChange={handleInputChange}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="•••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 text-blue-700 bg-brand box-border border border-b-blue-400 hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <div className="text-sm font-medium text-body">
          Already Registered?{" "}
          <Link to="/login" className="text-fg-brand hover:underline">
            Signin
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupMain;
