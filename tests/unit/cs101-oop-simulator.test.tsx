import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OopSimulator } from "@/components/cs101/oop-simulator";

describe("components/cs101/oop-simulator.tsx", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders simulator header and tabs", () => {
    render(<OopSimulator />);

    expect(
      screen.getByText(/Interactive OOP Simulator: The Four Pillars in Action/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /1\. Encapsulation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /2\. Abstraction/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /3\. Inheritance/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /4\. Polymorphism/i })
    ).toBeInTheDocument();
  });

  describe("Encapsulation Pillar", () => {
    it("initializes with $100 balance and allows deposits", () => {
      render(<OopSimulator />);

      expect(screen.getByText("$100")).toBeInTheDocument();
      expect(
        screen.getByText(/Account initialized with \$100/i)
      ).toBeInTheDocument();

      const depositBtn = screen.getByRole("button", {
        name: /\+ deposit\(50\)/i,
      });
      fireEvent.click(depositBtn);

      expect(screen.getByText("$150")).toBeInTheDocument();
      expect(screen.getByText(/deposit\(50\) approved/i)).toBeInTheDocument();
    });

    it("allows valid withdrawal and decrements balance", () => {
      render(<OopSimulator />);

      const withdrawBtn = screen.getByRole("button", {
        name: /- withdraw\(30\)/i,
      });
      fireEvent.click(withdrawBtn);

      expect(screen.getByText("$70")).toBeInTheDocument();
      expect(screen.getByText(/withdraw\(30\) approved/i)).toBeInTheDocument();
    });

    it("prevents overdrafts and maintains balance invariant", () => {
      render(<OopSimulator />);

      const withdrawBtn = screen.getByRole("button", {
        name: /- withdraw\(30\)/i,
      });

      // 100 - 30 = 70
      fireEvent.click(withdrawBtn);
      // 70 - 30 = 40
      fireEvent.click(withdrawBtn);
      // 40 - 30 = 10
      fireEvent.click(withdrawBtn);
      expect(screen.getByText("$10")).toBeInTheDocument();

      // Attempt withdrawal when balance < 30
      fireEvent.click(withdrawBtn);
      expect(screen.getByText("$10")).toBeInTheDocument(); // Invariant maintained
      expect(
        screen.getByText(/Insufficient funds invariant maintained/i)
      ).toBeInTheDocument();
    });

    it("rejects direct attribute hacking", () => {
      render(<OopSimulator />);

      const hackBtn = screen.getByRole("button", {
        name: /Hack: account\.__balance = -500/i,
      });
      fireEvent.click(hackBtn);

      expect(
        screen.getByText(/Cannot write to private '__balance' directly/i)
      ).toBeInTheDocument();
    });
  });

  describe("Abstraction Pillar", () => {
    it("runs engine sequence with timers and supports resetting", () => {
      render(<OopSimulator />);

      // Switch to Abstraction tab
      fireEvent.click(screen.getByRole("button", { name: /2\. Abstraction/i }));
      expect(
        screen.getByText(/Public Interface \(What caller sees\)/i)
      ).toBeInTheDocument();

      const startBtn = screen.getByRole("button", {
        name: /Press "Start Engine"/i,
      });
      fireEvent.click(startBtn);

      // Verify Step 1
      expect(
        screen.getByText(/1\. Checking battery voltage & starter relay/i)
      ).toBeInTheDocument();

      // Advance timers for step 2 (600ms)
      act(() => {
        vi.advanceTimersByTime(650);
      });
      expect(
        screen.getByText(/2\. Pressurizing fuel pump & electronic injection/i)
      ).toBeInTheDocument();

      // Advance timers for step 3 (1200ms)
      act(() => {
        vi.advanceTimersByTime(650);
      });
      expect(
        screen.getByText(/3\. Firing spark plugs in timing sequence/i)
      ).toBeInTheDocument();

      // Advance timers for step 4 (1800ms)
      act(() => {
        vi.advanceTimersByTime(650);
      });
      expect(
        screen.getByText(/4\. Engine idling smoothly at 800 RPM/i)
      ).toBeInTheDocument();

      // Reset
      const resetBtn = screen.getByRole("button", { name: /Reset/i });
      fireEvent.click(resetBtn);
    });
  });

  describe("Inheritance and Polymorphism Pillars", () => {
    it("allows switching to Inheritance and Polymorphism tabs", () => {
      render(<OopSimulator />);

      fireEvent.click(screen.getByRole("button", { name: /3\. Inheritance/i }));
      expect(
        screen.getByText(
          /Concept: Code Reuse Through Parent & Child Hierarchies/i
        )
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", { name: /4\. Polymorphism/i })
      );
      expect(
        screen.getByText(
          /Concept: Same Method Call, Diverse Class-Specific Behaviors/i
        )
      ).toBeInTheDocument();
    });
  });
});
