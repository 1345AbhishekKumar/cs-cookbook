import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  CidrCalculator,
  PortInspector,
  FirewallSimulator,
} from "@/components/computer-networking/networking-simulators";
import {
  ApiTypesExplorer,
  ApiKeySecuritySimulator,
} from "@/components/api-design/api-fundamentals-simulator";

describe("CidrCalculator Component", () => {
  it("renders default /24 with subnet mask 255.255.255.0 and 254 usable hosts", () => {
    render(<CidrCalculator />);
    expect(
      screen.getByText("Interactive CIDR & Subnet Calculator")
    ).toBeInTheDocument();

    expect(screen.getByText("255.255.255.0")).toBeInTheDocument();
    expect(screen.getByText(/256/)).toBeInTheDocument();
    expect(screen.getByText("254")).toBeInTheDocument();
  });

  it("updates subnet calculation when changing prefix slider", () => {
    const { container } = render(<CidrCalculator />);
    const slider = container.querySelector<HTMLInputElement>(
      'input[type="range"]'
    )!;

    // Change to /16
    fireEvent.change(slider, { target: { value: "16" } });
    expect(screen.getByText("255.255.0.0")).toBeInTheDocument();
    expect(screen.getByText(/65,536/)).toBeInTheDocument();
    expect(screen.getByText(/65,534/)).toBeInTheDocument();

    // Change to /30
    fireEvent.change(slider, { target: { value: "30" } });
    expect(screen.getByText("255.255.255.252")).toBeInTheDocument();
    expect(screen.getByText(/2\^2 = 4/)).toBeInTheDocument();
  });
});

describe("PortInspector Component", () => {
  it("renders port inspector with search filter and port buttons", () => {
    render(<PortInspector />);
    expect(screen.getByText("Interactive Port Inspector")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /80/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /443/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /22/ })).toBeInTheDocument();
  });
});

describe("FirewallSimulator Component", () => {
  it("renders firewall simulator with rule engine", () => {
    render(<FirewallSimulator />);
    expect(screen.getByText("Stateful Firewall Engine")).toBeInTheDocument();
  });
});

describe("ApiTypesExplorer Component", () => {
  it("renders API architectural scopes tabs", () => {
    render(<ApiTypesExplorer />);
    expect(
      screen.getByText(/Interactive API Types & Architectural Scopes/i)
    ).toBeInTheDocument();
  });
});

describe("ApiKeySecuritySimulator Component", () => {
  it("renders API key security comparison", () => {
    render(<ApiKeySecuritySimulator />);
    expect(screen.getByText(/API Key Security/i)).toBeInTheDocument();
  });
});
