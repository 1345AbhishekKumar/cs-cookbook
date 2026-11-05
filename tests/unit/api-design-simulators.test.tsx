import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  ApiRequestLifecycleDemo,
  RestBookPlayground,
  GraphqlOverfetchingDemo,
  GrpcStreamingDemo,
  ApiArchitectureChooser,
  ApiKeySecuritySimulator,
} from "@/components/api-design/api-fundamentals-simulator";

describe("ApiRequestLifecycleDemo Component", () => {
  it("renders lifecycle nodes and controls", () => {
    render(<ApiRequestLifecycleDemo />);

    expect(
      screen.getByText(/Interactive API Request & Response Lifecycle/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Client App")).toBeInTheDocument();
    expect(screen.getByText("API Gateway / Proxy")).toBeInTheDocument();
    expect(screen.getByText("Backend & Database")).toBeInTheDocument();

    const getBtn = screen.getByRole("button", { name: /^GET/i });
    expect(getBtn).toBeInTheDocument();
  });
});

describe("RestBookPlayground Component", () => {
  it("renders REST playground with HTTP methods", () => {
    render(<RestBookPlayground />);

    expect(
      screen.getByText(/Live In-Memory REST CRUD Playground/i)
    ).toBeInTheDocument();

    expect(screen.getByText("GET /books")).toBeInTheDocument();
    expect(screen.getByText("POST /books")).toBeInTheDocument();
  });

  it("switches to POST method and shows created status in response log", () => {
    render(<RestBookPlayground />);

    const postBtn = screen.getByText("POST /books");
    fireEvent.click(postBtn);

    expect(screen.getByText(/201 Created/i)).toBeInTheDocument();
  });
});

describe("GraphqlOverfetchingDemo Component", () => {
  it("renders field checkboxes and shows payload comparison", () => {
    render(<GraphqlOverfetchingDemo />);

    expect(
      screen.getByText(
        /Interactive GraphQL: Preventing Over-Fetching & Under-Fetching/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("price")).toBeInTheDocument();
  });
});

describe("GrpcStreamingDemo Component", () => {
  it("renders gRPC modes and allows switching to Bidirectional Streaming", () => {
    render(<GrpcStreamingDemo />);

    expect(
      screen.getByText(/Interactive gRPC & HTTP\/2 Streaming Patterns/i)
    ).toBeInTheDocument();

    const bidiBtn = screen.getByRole("button", {
      name: /4\. Bidirectional \(N:N\)/i,
    });
    fireEvent.click(bidiBtn);

    expect(
      screen.getByText(/Used for low-latency multiplayer gaming/i)
    ).toBeInTheDocument();
  });
});

describe("ApiArchitectureChooser Component", () => {
  it("renders decision options and protocol recommendations", () => {
    render(<ApiArchitectureChooser />);

    expect(
      screen.getByText(/Interactive API Architecture Decision Recommender/i)
    ).toBeInTheDocument();
  });
});

describe("ApiKeySecuritySimulator Component", () => {
  it("renders security vulnerability comparison", () => {
    render(<ApiKeySecuritySimulator />);

    expect(
      screen.getByText(/Interactive API Key Security & Leak Simulator/i)
    ).toBeInTheDocument();
  });
});
