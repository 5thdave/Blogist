import { createBrowserRouter, redirect } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./Pages/HomePage/Home";
import DetailsPage from "./Pages/DetailsPage/Details";
import LoginPage from "./Pages/LoginPage/Login";
import SignupPage from "./Pages/SignupPage/Signup";
import CreatePage from "./Pages/CreatePage/Create";
import { fetchPost, fetchPosts } from "./services/Post";
import { getLoggedInUser } from "./services/Auth";

export const route = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        HydrateFallback: () => <div>Loading...</div>,
        children: [
            { index: true, element: <HomePage />, loader: fetchPosts },
            { path: "details/:postId", element: <DetailsPage />, loader: ({ params }) => fetchPost(params.postId) },
            {
                path: "login",
                element: <LoginPage />,
                loader: () => (getLoggedInUser() ? redirect("/create") : null)
            },
            { path: "signup", element: <SignupPage /> },
            {
                path: "create",
                element: <CreatePage />,
                loader: () => (getLoggedInUser() ? null : redirect("/login"))
            }
            // {path:"*",element:<NotFound/>}
        ]
    }
]);
