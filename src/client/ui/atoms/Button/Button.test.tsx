import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { Button } from "@/client/ui/atoms/Button/Button";

describe("Button", () => {
  test("renders child", () => {
    render(<Button data-testid="button">Learn React</Button>);
    const button = screen.getByTestId("button");
    expect(button.innerHTML).toContain("Learn React");
  });

  test("handles click", async () => {
    const onClick = vi.fn();
    await render(
      <Button data-testid="button" onClick={onClick}>
        Learn React
      </Button>,
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("do not handles click when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button data-testid="button" disabled onClick={onClick}>
        Learn React
      </Button>,
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(onClick).not.toBeCalled();
  });

  test("do not handles click when isLoading", () => {
    const onClick = vi.fn();
    render(
      <Button data-testid="button" isLoading onClick={onClick}>
        Learn React
      </Button>,
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(onClick).not.toBeCalled();
  });
});
