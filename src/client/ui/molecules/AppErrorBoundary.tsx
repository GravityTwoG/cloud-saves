import { Component, ErrorInfo } from "react";

import { H1 } from "@/client/ui/atoms/Typography";
import { CTAButton } from "@/client/ui/atoms/Button/CTAButton";
import { Container } from "@/client/ui/atoms/Container/Container";

export type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  { hasError: boolean; error: string; stack: string }
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: "", stack: "" };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error: error.toString(),
      stack: error.stack?.toString() || "",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error at AppErrorBoundary:", error, errorInfo);
  }

  onReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="min-h-[100vh] m-8 flex items-center justify-center flex-col">
          <div>
            <H1>Unknown error</H1>

            <CTAButton
              className="mt-4"
              color="secondary"
              onClick={this.onReload}
            >
              Reload page
            </CTAButton>

            <p className="mt-4">Error: {this.state.error}</p>
            <p className="mt-4">{this.state.stack}</p>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}
