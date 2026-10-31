const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchPosts() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/post/all/`);
  } catch {
    throw new Error("Could not reach the server. Please check your connection.");
  }

  if (!response.ok) {
    throw new Error(`Could not load posts: ${response.status}`);
  }

  return response.json();
}

export async function fetchPost(postId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/post/single/${postId}`);
  } catch {
    throw new Error("Could not reach the server. Please check your connection.");
  }

  if (!response.ok) {
    throw new Error(`Could not load post: ${response.status}`);
  }

  return response.json();
}

export async function createPost(postData) {
  let response;
  const isFormData = postData instanceof FormData;

  try {
    response = await fetch(`${API_BASE_URL}/post/create/`, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? postData : JSON.stringify(postData),
    });
  } catch {
    throw new Error("Could not reach the server. Please check your connection.");
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  const isSuccess =
    response.ok || result?.status?.toLowerCase() === "success";

  if (!isSuccess) {
    const errorMsg =
      result?.message ||
      result?.error ||
      "Failed to create post. Please try again.";
    throw new Error(errorMsg);
  }

  return result;
}
