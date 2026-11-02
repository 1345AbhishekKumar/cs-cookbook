import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PowershellPipelineDemo } from "@/components/developer-tools/powershell-demo";
import { GitGraphSimulator } from "@/components/developer-tools/git-graph-simulator";
import {
  ShellPermissionsCalculator,
  ShellCliGuiComparison,
} from "@/components/developer-tools/shell-simulators";
import { BashSimulator } from "@/components/developer-tools/bash-simulator";

// Mock lucide-react to render simple span icons in JSDOM tests
vi.mock("lucide-react", async (importOriginal) => {
  const actual: any = await importOriginal();
  const createMockIcon = (name: string) => {
    const Icon = React.forwardRef((props: any, ref: any) => (
      <span ref={ref} data-testid={`icon-${name}`} {...props} />
    ));
    Icon.displayName = name;
    return Icon;
  };

  const mocked: Record<string, any> = { ...actual };
  for (const key of Object.keys(actual)) {
    if (typeof actual[key] === "object" || typeof actual[key] === "function") {
      mocked[key] = createMockIcon(key);
    }
  }
  return mocked;
});

describe("PowershellPipelineDemo Component", () => {
  it("renders with initial cmdlet stage and 5 processes", () => {
    render(<PowershellPipelineDemo />);
    expect(screen.getByText("Get-Process")).toBeInTheDocument();
    expect(screen.getByText("code")).toBeInTheDocument();
    expect(screen.getByText("chrome")).toBeInTheDocument();
    expect(screen.getByText("node")).toBeInTheDocument();
    expect(screen.getByText("slack")).toBeInTheDocument();
    expect(screen.getByText("powershell")).toBeInTheDocument();
  });

  it("advances to Stage 2 and filters processes with CPU > 20", () => {
    render(<PowershellPipelineDemo />);
    const stage2Btn = screen.getByRole("button", { name: "Stage 2" });
    fireEvent.click(stage2Btn);

    expect(
      screen.getByText(/Get-Process \| Where-Object/i)
    ).toBeInTheDocument();
    expect(screen.getByText("chrome")).toBeInTheDocument();
    expect(screen.getByText("node")).toBeInTheDocument();
    expect(screen.queryByText("slack")).not.toBeInTheDocument();
    expect(screen.queryByText("powershell")).not.toBeInTheDocument();
  });

  it("advances to Stage 3 and projects only selected columns", () => {
    render(<PowershellPipelineDemo />);
    const stage3Btn = screen.getByRole("button", { name: "Stage 3" });
    fireEvent.click(stage3Btn);

    expect(
      screen.getByText(/Select-Object ProcessName, WorkingSet/i)
    ).toBeInTheDocument();
  });
});

describe("GitGraphSimulator Component", () => {
  it("renders with initial clean working tree stage", () => {
    render(<GitGraphSimulator />);
    expect(
      screen.getAllByText(/1\. Clean Working Tree/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText("$ git status")).toBeInTheDocument();
  });

  it("advances stage when clicking Next button and resets with Reset button", () => {
    render(<GitGraphSimulator />);
    const nextBtn = screen.getByRole("button", { name: /^Next/i });
    const resetBtn = screen.getByRole("button", { name: /^Reset/i });

    // Advance to Stage 2
    fireEvent.click(nextBtn);
    expect(
      screen.getAllByText(/2\. Modify File in Working Directory/i).length
    ).toBeGreaterThan(0);

    // Reset back to Stage 1
    fireEvent.click(resetBtn);
    expect(
      screen.getAllByText(/1\. Clean Working Tree/i).length
    ).toBeGreaterThan(0);
  });
});

describe("ShellPermissionsCalculator Component", () => {
  it("renders default octal 754 and symbolic mode -rwxr-xr--", () => {
    render(<ShellPermissionsCalculator />);
    expect(
      screen.getByText("Interactive Linux File Permission & Octal Calculator")
    ).toBeInTheDocument();
    expect(screen.getByText("-rwxr-xr--")).toBeInTheDocument();
    expect(screen.getByText("chmod 754 file.sh")).toBeInTheDocument();
  });

  it("toggles permission checkboxes and updates octal calculation", () => {
    const { container } = render(<ShellPermissionsCalculator />);

    // Toggle the second checkbox (Owner Write)
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    // Index 1 is Owner Write
    fireEvent.click(checkboxes[1]);

    // 7 - 2 = 5 -> octal 554, symbolic -r-xr-xr--
    expect(screen.getByText("-r-xr-xr--")).toBeInTheDocument();
    expect(screen.getByText("chmod 554 file.sh")).toBeInTheDocument();
  });
});

describe("ShellCliGuiComparison Component", () => {
  it("renders race comparison and controls", () => {
    render(<ShellCliGuiComparison />);
    expect(
      screen.getByText("CLI vs GUI: Create 50 Client Folders Race")
    ).toBeInTheDocument();

    const startBtn = screen.getByRole("button", { name: /Start Race/i });
    expect(startBtn).toBeInTheDocument();
  });
});

describe("BashSimulator Component", () => {
  it("renders bash simulator tabs and allows switching to terminal shell", () => {
    render(<BashSimulator />);

    const terminalBtn = screen.getByRole("button", { name: /Terminal Shell/i });
    expect(terminalBtn).toBeInTheDocument();

    fireEvent.click(terminalBtn);
    expect(
      screen.getByText(/Interactive Bash Learning Shell/i)
    ).toBeInTheDocument();
  });
});
