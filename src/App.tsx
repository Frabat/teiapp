import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store.ts";
import { theme } from "./theme.ts";
import Signup from "./auth/sign-up.tsx";
import SignIn from "./auth/sign-in.tsx";
import Dashboard from "./features/dashboard.tsx";
import Welcome from "./features/welcome.tsx";
import Home from "./features/home.tsx";
import FileDetail from "./features/FileDetail.tsx";
import AuthGuard from "./auth/AuthGuard.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

// Get the base path for GitHub Pages deployment
const getBasePath = () => {
  // Check if we're in production and on GitHub Pages
  if (process.env.NODE_ENV === 'production' && window.location.hostname.includes('github.io')) {
    return '/teiapp';
  }
  return '/';
};

// Route configuration - moved outside component to prevent recreation on every render
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard requireAuth={true}>
        <Home />
      </AuthGuard>
    ),
    errorElement: <div>Something went wrong. Please try again.</div>,
  },
  {
    path: "/welcome",
    element: (
      <AuthGuard requireAuth={false}>
        <Welcome />
      </AuthGuard>
    ),
  },
  {
    path: "/detail",
    element: (
      <AuthGuard requireAuth={true}>
        <FileDetail />
      </AuthGuard>
    ),
  },
  {
    path: "/auth",
    children: [
      {
        path: "signup",
        element: (
          <AuthGuard requireAuth={false}>
            <Signup />
          </AuthGuard>
        ),
      },
      {
        path: "signin",
        element: (
          <AuthGuard requireAuth={false}>
            <SignIn />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard requireAuth={true}>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
], {
  basename: getBasePath()
});

/**
 * Main App component that provides Redux store and routing
 * @returns React.JSX.Element - The main application component
 */
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
