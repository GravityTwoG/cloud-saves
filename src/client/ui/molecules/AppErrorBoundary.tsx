import { Component, ErrorInfo } from "react";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Button } from "@/client/ui/atoms/Button";
import { Container } from "@/client/ui/atoms/Container";

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
        <Container>
          <div>
            <H1>Unknown error</H1>

            <Button
              className="mt-4"
              color="secondary"
              onClick={this.onReload}
              variant="CTA"
            >
              Reload page
            </Button>

            <Paragraph className="mt-4">Error: {this.state.error}</Paragraph>
            <Paragraph className="mt-4">{this.state.stack}</Paragraph>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}
