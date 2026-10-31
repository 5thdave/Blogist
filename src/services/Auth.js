const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_CHANGE_EVENT = "blogist-auth-change";

export function getLoggedInUser() {
  const userId = localStorage.getItem("blogist_user_id");
  const username = localStorage.getItem("blogist_username");

  return userId && username ? { userId, username } : null;
}

export async function loginUser(username, password) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // removed credentials:"include" — causes CORS preflight failure when backend
      // does not return Access-Control-Allow-Credentials: true
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your network connection or verify the server is running."
    );
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  const isFailed = !response.ok || (result && result.status && result.status !== "success");

  if (isFailed) {
    const extractedMessage =
      result?.message ||
      result?.error ||
      result?.detail ||
      (Array.isArray(result?.non_field_errors)
        ? result.non_field_errors.join(", ")
        : result?.non_field_errors) ||
      (Array.isArray(result?.errors)
        ? result.errors.join(", ")
        : typeof result?.errors === "object" && result?.errors !== null
        ? Object.values(result.errors).flat().join(", ")
        : null);

    if (extractedMessage && typeof extractedMessage === "string") {
      throw new Error(extractedMessage);
    }

    if (response.status === 400 || response.status === 401) {
      throw new Error("Invalid email or password. Please try again.");
    }

    if (response.status === 404) {
      throw new Error("Authentication service is unavailable (404 Not Found).");
    }

    if (response.status >= 500) {
      throw new Error("Server error occurred during login. Please try again later.");
    }

    throw new Error("Unable to sign in. Please try again.");
  }

  const userId =
    result?.data?.user_id ??
    result?.data?.id ??
    result?.user?.id ??
    result?.user_id ??
    result?.id;

  const storedUsername =
    result?.data?.username ??
    result?.user?.username ??
    result?.username ??
    username;

  if (userId) {
    localStorage.setItem("blogist_user_id", String(userId));
  }
  if (storedUsername) {
    localStorage.setItem("blogist_username", String(storedUsername));
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  return { userId, username: storedUsername };
}

export function subscribeToAuthChanges(callback) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}

export async function logoutUser() {
  try {
    await fetch(`${API_BASE_URL}/logout/`, {
      method: "POST",
    });
  } catch (error) {
    console.warn("Backend logout request failed:", error);
  } finally {
    localStorage.removeItem("blogist_user_id");
    localStorage.removeItem("blogist_username");
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export async function registerUser({ username, email, password }) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your network connection or verify the server is running."
    );
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // Backend returns "Success" (capital S) on success — check case-insensitively
  const isSuccess =
    response.ok &&
    (!result?.status || result.status.toLowerCase() === "success");

  if (!isSuccess) {
    const errorMsg =
      result?.message ||
      result?.error ||
      result?.detail ||
      "Failed to create account. Please try again.";
    throw new Error(errorMsg);
  }

  return result;
}
