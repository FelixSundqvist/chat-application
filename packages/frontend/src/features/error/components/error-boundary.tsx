import type { PropsWithChildren, ReactNode } from "react";
import { Component } from "react";

class ErrorBoundary extends Component<
  PropsWithChildren<{ fallback: ReactNode }>,
  { hasError: boolean }
> {
  constructor(props: PropsWithChildren<{ fallback: ReactNode }>) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("componentDidCatch: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
