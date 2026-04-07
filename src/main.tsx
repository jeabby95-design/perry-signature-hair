import { Component, StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

interface RootErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class RootErrorBoundary extends Component<
  { children: ReactNode },
  RootErrorBoundaryState
> {
  state: RootErrorBoundaryState = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }

  componentDidCatch(error: unknown) {
    console.error("Root render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-xl w-full border border-red-200 rounded-xl bg-red-50 p-6">
            <h1 className="text-xl font-bold text-red-700">App failed to render</h1>
            <p className="text-red-700 mt-2">
              {this.state.message || "A runtime error occurred."}
            </p>
            <p className="text-sm text-red-600 mt-3">
              Refresh the page after checking your environment variables.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
