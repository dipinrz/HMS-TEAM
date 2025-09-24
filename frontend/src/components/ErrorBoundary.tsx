// src/components/ErrorBoundary.tsx
import React, { Component } from "react";

type Props = { children: any; fallback?: any };
type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("HMS ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <h2>⚠️ Server error. Please try again later.</h2>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
