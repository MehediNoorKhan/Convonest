import { createBrowserRouter } from "react-router";
import RootLayout from "../Components/RootLayout";
import Home from "../Components/Home";
import Register from "../Components/Register";
import Login from "../Components/Login";
import AddPost from "../Components/AddPost";
import PostDetails from "../Components/PostDetails";
import AddAnnouncement from "../Components/AddAnnouncement";
import DashboardLayout from "../Dashboard/DashboardLayout";
import DashboardProfile from "../Dashboard/DashboardProfile";
import MyPosts from "../Dashboard/MyPosts";
import PostComments from "../Dashboard/PostComments";
import ManageUsers from "../Dashboard/ManageUsers";
import ReportedComments from "../Dashboard/ReportedComments";
import UserRoute from "../Components/UserRoute";
import Forbidden from "../Components/Forbidden";
import AdminRoute from "../Components/AdminRoute";
import AdminProfile from "../Dashboard/AdminProfile";
import Membership from "../Components/Membership";
import UserHome from "../Dashboard/UserHome";
import RoleBasedRedirect from "../Dashboard/RoleBasedRedirect";
import AdminHome from "../Dashboard/AdminHome";
import ErrorPage from "../Components/ErrorPage";

// 🧩 Skeleton imports
import MyPostsSkeleton from "../Skeletons/MyPostsSkeleton";
import DashboardProfileSkeleton from "../Skeletons/DashboardProfileSkeleton";
import UserHomeSkeleton from "../Skeletons/UserHomeSkeleton";
import MembershipSkeleton from "../Skeletons/MembershipSkeleton";
import PostCommentsSkeleton from "../Skeletons/PostCommentsSkeleton";
import AdminDashboardSkeleton from "../Skeletons/AdminDashboardSkeleton";
import ManageUsersSkeleton from "../Skeletons/ManageUsersSkeleton";
import AdminProfileSkeleton from "../Skeletons/AdminProfileSkeleton";
import AddPostSkeleton from "../skeletons/AddPostSkeleton";
import ReportedCommentsSkeleton from "../skeletons/ReportedCommentsSkeleton";
import AddAnnouncementSkeleton from "../skeletons/AddAnnouncementsSkeleton";
import MembershipSuccess from "../Components/MembershipSuccess";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage />,
        children: [
            { index: true, Component: Home },
            { path: "register", Component: Register },
            { path: "login", Component: Login },
            { path: "posts/:id", element: <PostDetails /> },
            {
                path: "membership",
                element: (
                    <UserRoute skeleton={<MembershipSkeleton />}>
                        <Membership />
                    </UserRoute>
                ),
            },
            {
                path: "membership/success",
                element: <MembershipSuccess />,
            },
            { path: "forbidden", Component: Forbidden },
        ],
    },
    {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
            { index: true, element: <RoleBasedRedirect /> },

            // User routes
            {
                path: "userhome",
                element: (
                    <UserRoute skeleton={<UserHomeSkeleton />}>
                        <UserHome />
                    </UserRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <UserRoute skeleton={<DashboardProfileSkeleton />}>
                        <DashboardProfile />
                    </UserRoute>
                ),
            },
            {
                path: "addpost",
                element: (
                    <UserRoute skeleton={<AddPostSkeleton></AddPostSkeleton>}>
                        <AddPost />
                    </UserRoute>
                ),
            },
            {
                path: "myposts",
                element: (
                    <UserRoute skeleton={<MyPostsSkeleton />}>
                        <MyPosts />
                    </UserRoute>
                ),
            },
            {
                path: "posts/:id",
                element: (
                    <UserRoute skeleton={<PostCommentsSkeleton />}>
                        <PostComments />
                    </UserRoute>
                ),
            },

            // Admin routes
            {
                path: "adminhome",
                element: (
                    <AdminRoute skeleton={<AdminDashboardSkeleton />}>
                        <AdminHome />
                    </AdminRoute>
                ),
            },
            {
                path: "adminprofile",
                element: (
                    <AdminRoute skeleton={<AdminProfileSkeleton />}>
                        <AdminProfile />
                    </AdminRoute>
                ),
            },
            {
                path: "manageusers",
                element: (
                    <AdminRoute skeleton={<ManageUsersSkeleton />}>
                        <ManageUsers />
                    </AdminRoute>
                ),
            },
            {
                path: "addannouncement",
                element: (
                    <AdminRoute>
                        <AddAnnouncement skeleton={<AddAnnouncementSkeleton></AddAnnouncementSkeleton>} />
                    </AdminRoute>
                ),
            },
            {
                path: "reportedcomments",
                element: (
                    <AdminRoute>
                        <ReportedComments skeleton={<ReportedCommentsSkeleton></ReportedCommentsSkeleton>} />
                    </AdminRoute>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);
