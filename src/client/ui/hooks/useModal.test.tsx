import { describe, expect, test } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";

import { useModal } from "./useModal";

describe("useModal", () => {
  test("should return a modal and its functions", () => {
    const { result } = renderHook(() =>
      useModal({ title: "Test", children: <div>Content</div> }),
    );
    render(<div data-testid="modal-container">{result.current[0]}</div>);

    const container = screen.getByTestId("modal-container");

    expect(container.innerHTML).not.toContain("Content");
    // openModal
    expect(result.current[1]).toBeInstanceOf(Function);
    // closeModal
    expect(result.current[2]).toBeInstanceOf(Function);
  });

  test("should return a modal with content after it is opened", () => {
    const { result } = renderHook(() =>
      useModal({ title: "Test", children: <div>Content</div> }),
    );

    act(() => {
      // open the modal
      result.current[1]();
    });

    // render the modal
    render(<div>{result.current[0]}</div>);

    const portal = document.getElementById("modalPortal");

    expect(portal!.innerHTML).toContain("Test");
    expect(portal!.innerHTML).toContain("Content");
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(result.current[2]).toBeInstanceOf(Function);
  });

  test("should not return a modal with content after it is closed", () => {
    const { result } = renderHook(() =>
      useModal({ title: "Test", children: <div>Content</div> }),
    );

    act(() => {
      // open the modal
      result.current[1]();
    });

    act(() => {
      // close the modal
      result.current[2]();
    });

    // render the modal
    render(<div>{result.current[0]}</div>);

    const portal = document.getElementById("modalPortal");

    expect(portal!.innerHTML).not.toContain("Test");
    expect(portal!.innerHTML).not.toContain("Content");
    expect(result.current[1]).toBeInstanceOf(Function);
    expect(result.current[2]).toBeInstanceOf(Function);
  });
});
