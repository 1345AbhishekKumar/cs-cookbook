import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LinuxCommandsExplorer } from "@/components/developer-tools/linux-commands-explorer";
import { UvBenchmarkLab } from "@/components/developer-tools/uv-benchmark-lab";
import { UvCommandBuilder } from "@/components/developer-tools/uv-command-builder";
import { UvTerminalSimulator } from "@/components/developer-tools/uv-terminal-simulator";

describe("components/developer-tools/linux-commands-explorer.tsx", () => {
  it("renders the 50 commands explorer header and search box", () => {
    render(<LinuxCommandsExplorer />);

    expect(
      screen.getByText("Interactive 50 Linux Commands Explorer")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search commands or syntax...")
    ).toBeInTheDocument();
  });

  it("filters command list by text search", () => {
    render(<LinuxCommandsExplorer />);

    const searchInput = screen.getByPlaceholderText(
      "Search commands or syntax..."
    );
    fireEvent.change(searchInput, { target: { value: "grep" } });

    expect(screen.getByText("grep")).toBeInTheDocument();
    expect(
      screen.getByText(/Searches text and files using regular expressions/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("whoami")).not.toBeInTheDocument();
  });

  it("filters command list by category pill", () => {
    render(<LinuxCommandsExplorer />);

    const categoryBtn = screen.getByRole("button", {
      name: "Users & Permissions",
    });
    fireEvent.click(categoryBtn);

    expect(screen.getByText("chmod")).toBeInTheDocument();
    expect(screen.getByText("chown")).toBeInTheDocument();
    expect(screen.getByText("sudo")).toBeInTheDocument();
    expect(screen.queryByText("whoami")).not.toBeInTheDocument();
  });

  it("clears command results when no commands match search", () => {
    render(<LinuxCommandsExplorer />);

    const searchInput = screen.getByPlaceholderText(
      "Search commands or syntax..."
    );
    fireEvent.change(searchInput, {
      target: { value: "nonexistent-command-xyz" },
    });

    expect(screen.queryByText("chmod")).not.toBeInTheDocument();
    expect(screen.queryByText("whoami")).not.toBeInTheDocument();
  });
});

describe("components/developer-tools/uv-benchmark-lab.tsx", () => {
  it("renders benchmark lab and switches scenario benchmarks", () => {
    const { container } = render(<UvBenchmarkLab />);

    expect(
      screen.getByText(/Interactive Benchmark Lab: Resolution & Install Speed/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/107x faster/i)).toBeInTheDocument();

    // Adjust slider range to tier 1
    const slider = container.querySelector<HTMLInputElement>(
      'input[type="range"]'
    )!;
    fireEvent.change(slider, { target: { value: "1" } });

    expect(screen.getByText(/80x faster/i)).toBeInTheDocument();
  });
});

describe("components/developer-tools/uv-command-builder.tsx", () => {
  it("renders command builder with subcommands and flags", () => {
    render(<UvCommandBuilder />);

    expect(
      screen.getByText(/Interactive uv Command Builder/i)
    ).toBeInTheDocument();

    // Verify subcommands exist
    expect(screen.getByRole("button", { name: /uv add/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /uv pip install/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /uv run/i })).toBeInTheDocument();
  });

  it("switches subcommands and toggles command flags", () => {
    render(<UvCommandBuilder />);

    const pipBtn = screen.getByRole("button", { name: /uv pip install/i });
    fireEvent.click(pipBtn);

    expect(screen.getByText(/Drop-in pip replacement/i)).toBeInTheDocument();
  });
});

describe("components/developer-tools/uv-terminal-simulator.tsx", () => {
  it("renders terminal simulator and allows executing actions", () => {
    render(<UvTerminalSimulator />);

    expect(screen.getByText(/uv-interactive-shell — zsh/i)).toBeInTheDocument();

    const addBtn = screen.getByRole("button", { name: /uv add fastapi/i });
    expect(addBtn).toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(screen.getByText(/Resolved 21 packages/i)).toBeInTheDocument();
  });
});
