import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJobs,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as createJobAction } from "./pages/AddJobs";
import { action as EditJobAction } from "./pages/EditJob";
import { action as DeleteJobAction } from "./pages/DeleteJob";
import { action as profileAction } from "./pages/Profile";

import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { loader as allJobsLoader } from "./pages/AllJobs";
import { loader as EditJobLoader } from "./pages/EditJob";
import { loader as AdminLoader } from "./pages/Admin";
import { loader as StatsLoader } from "./pages/Stats";
import ErrorElement from "./components/ErrorElement";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

// checkDefaultTheme();
const isDarkThemeEnabled = checkDefaultTheme();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction(queryClient),
      },
      {
        path: "dashboard",
        element: (
          <DashboardLayout
            isDarkThemeEnabled={isDarkThemeEnabled}
            queryClient={queryClient}
          />
        ),

        loader: dashboardLoader(queryClient),
        children: [
          {
            index: true,
            element: <AddJobs />,
            action: createJobAction(queryClient),
          },
          {
            path: "stats",
            element: <Stats />,
            loader: StatsLoader(queryClient),
            errorElement: <ErrorElement />,
          },
          {
            path: "all-jobs",
            element: <AllJobs />,
            loader: allJobsLoader(queryClient),
          },
          {
            path: "profile",
            element: <Profile />,
            action: profileAction(queryClient),
          },
          {
            path: "admin",
            element: <Admin />,
            loader: AdminLoader,
          },
          {
            path: "edit-job/:id",
            element: <EditJob />,
            loader: EditJobLoader(queryClient),
            action: EditJobAction(queryClient),
          },
          {
            path: "delete-job/:id",
            action: DeleteJobAction(queryClient),
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default App;
