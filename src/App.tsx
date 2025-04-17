import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/Dashboard"));
const ApiKeyManager = lazy(() => import("./components/ApiKeyManager"));
const AnalyticsDashboard = lazy(
  () => import("./components/AnalyticsDashboard"),
);
const ApiSandbox = lazy(() => import("./components/ApiSandbox"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api-key-manager" element={<ApiKeyManager />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/api-sandbox" element={<ApiSandbox />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
