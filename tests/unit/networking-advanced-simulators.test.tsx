import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  NatTranslator,
  K8sServiceSimulator,
  PacketJourneyFlow,
  FirewallSimulator,
} from "@/components/computer-networking/networking-simulators";

describe("NatTranslator Component", () => {
  it("renders initial outbound request stage and advances through NAT steps", () => {
    render(<NatTranslator />);

    expect(
      screen.getByText("NAT / PAT Translation Stepper")
    ).toBeInTheDocument();
    expect(
      screen.getByText("1. Internal Host Generates Outbound Request")
    ).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /Next Step/i });
    fireEvent.click(nextBtn);

    expect(
      screen.getByText("2. NAT Gateway Rewrites Source Address (SNAT)")
    ).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(
      screen.getByText("3. Internet Server Replies to Public Address")
    ).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(
      screen.getByText("4. NAT Gateway Rewrites Destination & Forwards (DNAT)")
    ).toBeInTheDocument();
  });
});

describe("K8sServiceSimulator Component", () => {
  it("renders Kubernetes Service virtual IP routing simulator", () => {
    render(<K8sServiceSimulator />);

    expect(
      screen.getByText(/Kubernetes Service & Pod Churn Simulator/i)
    ).toBeInTheDocument();
  });
});

describe("PacketJourneyFlow Component", () => {
  it("renders packet journey encapsulation stepper", () => {
    render(<PacketJourneyFlow />);

    expect(
      screen.getByText(/The Complete Packet Journey \(End-to-End\)/i)
    ).toBeInTheDocument();
  });
});

describe("FirewallSimulator Component Rules", () => {
  it("renders firewall simulator with rule engine interface", () => {
    render(<FirewallSimulator />);

    expect(screen.getByText("Stateful Firewall Engine")).toBeInTheDocument();
  });
});
