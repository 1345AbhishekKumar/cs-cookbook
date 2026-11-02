import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MatrixRunnerSimulator } from "@/components/github-actions/matrix-runner-simulator";
import { SecretsAndEnvSimulator } from "@/components/github-actions/secrets-and-env-simulator";
import { ActionAuthoringChooser } from "@/components/github-actions/action-authoring-chooser";
import { WorkflowLifecycleSimulator } from "@/components/github-actions/workflow-lifecycle-simulator";

describe("MatrixRunnerSimulator Component", () => {
  it("renders with matrix configuration controls", () => {
    render(<MatrixRunnerSimulator />);
    expect(
      screen.getByText("Matrix Strategy & Parallelism Playground")
    ).toBeInTheDocument();

    expect(screen.getAllByText("ubuntu-latest").length).toBeGreaterThan(0);
    expect(screen.getAllByText("windows-latest").length).toBeGreaterThan(0);
    expect(screen.getAllByText("macos-latest").length).toBeGreaterThan(0);
  });
});

describe("SecretsAndEnvSimulator Component", () => {
  it("renders secret masking and environment precedence simulation", () => {
    render(<SecretsAndEnvSimulator />);
    expect(
      screen.getByText("Variables, Secrets & Log Masking Inspector")
    ).toBeInTheDocument();
  });
});

describe("ActionAuthoringChooser Component", () => {
  it("renders action comparison chooser options", () => {
    render(<ActionAuthoringChooser />);
    expect(
      screen.getByText("Action Architecture Decision Engine")
    ).toBeInTheDocument();
  });
});

describe("WorkflowLifecycleSimulator Component", () => {
  it("renders workflow lifecycle simulator", () => {
    render(<WorkflowLifecycleSimulator />);
    expect(
      screen.getByText("Interactive Pipeline Simulator (DAG & Jobs)")
    ).toBeInTheDocument();
  });
});
