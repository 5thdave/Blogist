import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { createPost } from "../../services/Post";

const CreateMain = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();

    if (!title || !content) {
      setError("Title and story are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost(formData);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-fg-brand">Your story starts here</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
          Create a post
        </h1>
        <p className="text-body">
          Share an idea, a useful tip, or a story with the Blogist community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
        className="space-y-6 rounded-base border border-default bg-neutral-primary-soft p-6 shadow-xs sm:p-8"
      >
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-base border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400"
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

        <div>
          <label
            htmlFor="post-title"
            className="mb-2.5 block text-sm font-medium text-heading"
          >
            Post title
          </label>
          <input
            id="post-title"
            name="title"
            type="text"
            maxLength={120}
            className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
            placeholder="Give your post a clear, engaging title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="post-image"
            className="mb-2.5 block text-sm font-medium text-heading"
          >
            Cover image
            <span className="ml-1 font-normal text-body">(optional)</span>
          </label>
          <input
            id="post-image"
            name="image"
            type="file"
            accept="image/*"
            className="block w-full rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand file:mr-4 file:py-2 file:px-4 file:rounded-base file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-strong"
          />
          <p className="mt-2 text-sm text-body">
            Choose an image file from your device.
          </p>
        </div>

        <div>
          <label
            htmlFor="post-content"
            className="mb-2.5 block text-sm font-medium text-heading"
          >
            Your story
          </label>
          <textarea
            id="post-content"
            name="content"
            rows={10}
            className="block w-full resize-y rounded-base border border-default-medium bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs placeholder:text-body focus:border-brand focus:ring-brand"
            placeholder="Start writing your post..."
            required
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-default pt-5 sm:flex-row sm:justify-end">
          <NavLink
            to="/"
            className="inline-flex items-center justify-center rounded-base border border-default-medium bg-neutral-secondary-medium px-4 py-2.5 text-sm font-medium leading-5 text-heading shadow-xs hover:bg-neutral-tertiary-medium focus:outline-none focus:ring-4 focus:ring-neutral-tertiary"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-base bg-brand px-4 py-2.5 text-sm font-medium leading-5 text-white shadow-xs hover:bg-brand-strong focus:outline-none focus:ring-4 focus:ring-brand-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating post...
              </>
            ) : (
              "Create post"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateMain;
