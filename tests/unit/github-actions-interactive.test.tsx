import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MatrixRunnerSimulator } from "@/components/github-actions/matrix-runner-simulator";
import { SecretsAndEnvSimulator } from "@/components/github-actions/secrets-and-env-simulator";
import { ActionAuthoringChooser } from "@/components/github-actions/action-authoring-chooser";
import { WorkflowLifecycleSimulator } from "@/components/github-actions/workflow-lifecycle-simulator";

describe("components/github-actions/matrix-runner-simulator.tsx", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders matrix combinations calculation", () => {
    render(<MatrixRunnerSimulator />);

    expect(
      screen.getByText("Matrix Strategy & Parallelism Playground")
    ).toBeInTheDocument();

    // Verify OS badges
    expect(screen.getAllByText("ubuntu-latest").length).toBeGreaterThan(0);
    expect(screen.getAllByText("windows-latest").length).toBeGreaterThan(0);
    expect(screen.getAllByText("macos-latest").length).toBeGreaterThan(0);

    // Verify Run Matrix button
    const runBtn = screen.getByRole("button", { name: /Launch Matrix/i });
    expect(runBtn).toBeInTheDocument();
  });

  it("toggles fail-fast setting", () => {
    render(<MatrixRunnerSimulator />);

    const failFastToggle = screen.getByRole("checkbox", {
      name: /fail-fast/i,
    });
    expect(failFastToggle).toBeChecked();

    fireEvent.click(failFastToggle);
    expect(failFastToggle).not.toBeChecked();
  });
});

describe("components/github-actions/secrets-and-env-simulator.tsx", () => {
  it("renders variable precedence and secret masking tool", () => {
    render(<SecretsAndEnvSimulator />);

    expect(
      screen.getByText("Variables, Secrets & Log Masking Inspector")
    ).toBeInTheDocument();
  });
});

describe("components/github-actions/action-authoring-chooser.tsx", () => {
  it("renders action architecture options", () => {
    render(<ActionAuthoringChooser />);

    expect(
      screen.getByText("Action Architecture Decision Engine")
    ).toBeInTheDocument();
  });
});

describe("components/github-actions/workflow-lifecycle-simulator.tsx", () => {
  it("renders lifecycle simulator and allows trigger switching", () => {
    render(<WorkflowLifecycleSimulator />);

    expect(
      screen.getByText("Interactive Pipeline Simulator (DAG & Jobs)")
    ).toBeInTheDocument();

    // Switch trigger to pull_request
    const prBtn = screen.getByRole("button", { name: /pull_request/i });
    fireEvent.click(prBtn);
    expect(prBtn).toHaveClass("bg-indigo-600");
  });
});
