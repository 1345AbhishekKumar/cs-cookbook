import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PythonOopSimulator } from "@/components/learn-python/python-oop-simulator";

describe("components/learn-python/python-oop-simulator.tsx", () => {
  it("renders the simulator with header and default Classes tab", () => {
    render(<PythonOopSimulator />);

    expect(
      screen.getByText("How OOP Works in Python: Interactive Simulator")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /1\. Class & Object/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /2\. Inheritance/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /3\. Encapsulation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /4\. Polymorphism/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /5\. Abstraction/i })
    ).toBeInTheDocument();
  });

  it("respects initialTab prop", () => {
    render(<PythonOopSimulator initialTab="encapsulation" />);
    expect(screen.getByText("The BankAccount Class")).toBeInTheDocument();
  });

  it("allows switching tabs across all 5 OOP pillars", () => {
    render(<PythonOopSimulator />);

    // Switch to Inheritance
    fireEvent.click(screen.getByRole("button", { name: /2\. Inheritance/i }));
    expect(
      screen.getByText(/Interactive Class Hierarchy Inspector/i)
    ).toBeInTheDocument();

    // Switch to Encapsulation
    fireEvent.click(screen.getByRole("button", { name: /3\. Encapsulation/i }));
    expect(screen.getByText("The BankAccount Class")).toBeInTheDocument();

    // Switch to Polymorphism
    fireEvent.click(screen.getByRole("button", { name: /4\. Polymorphism/i }));
    expect(
      screen.getByText(/Three Classes, One Method Interface/i)
    ).toBeInTheDocument();

    // Switch to Abstraction
    fireEvent.click(screen.getByRole("button", { name: /5\. Abstraction/i }));
    expect(screen.getByText("The ABC Contract")).toBeInTheDocument();

    // Switch back to Classes
    fireEvent.click(
      screen.getByRole("button", { name: /1\. Class & Object/i })
    );
    expect(
      screen.getByText("The Blueprint (Written Once)")
    ).toBeInTheDocument();
  });

  describe("Classes Tab Interactive Logic", () => {
    it("instantiates a new car and manipulates speed", () => {
      render(<PythonOopSimulator initialTab="classes" />);

      // Initial car exists in state (car1 with speed 20 km/h)
      expect(screen.getByText("car1")).toBeInTheDocument();
      expect(screen.getByText(/20 km\/h/i)).toBeInTheDocument();

      const accelerateButtons = screen.getAllByRole("button", {
        name: /accelerate\(\)/i,
      });
      expect(accelerateButtons.length).toBeGreaterThan(0);

      // Accelerate first car: 20 + 20 = 40 km/h
      fireEvent.click(accelerateButtons[0]);
      expect(screen.getByText(/40 km\/h/i)).toBeInTheDocument();
    });
  });

  describe("Encapsulation Tab Interactive Logic", () => {
    it("allows valid positive deposit and updates balance", () => {
      render(<PythonOopSimulator initialTab="encapsulation" />);

      const depositBtn = screen.getByRole("button", {
        name: "acct.deposit(100)",
      });
      fireEvent.click(depositBtn);

      // Initial 100 + 100 = 200
      expect(screen.getByText("$200")).toBeInTheDocument();
    });

    it("handles direct tamper attempt", () => {
      render(<PythonOopSimulator initialTab="encapsulation" />);

      const tamperBtn = screen.getByRole("button", {
        name: /acct\.__balance \(Direct Tamper\)/i,
      });
      fireEvent.click(tamperBtn);

      expect(
        screen.getByText(
          /AttributeError: 'BankAccount' object has no attribute '__balance'/i
        )
      ).toBeInTheDocument();
    });
  });

  describe("Abstraction Tab Interactive Logic", () => {
    it("shows error when attempting to instantiate abstract base class Shape()", () => {
      render(<PythonOopSimulator initialTab="abstraction" />);

      const shapeBtn = screen.getByRole("button", { name: "Shape()" });
      fireEvent.click(shapeBtn);

      expect(
        screen.getByText(/TypeError: Can't instantiate abstract class Shape/i)
      ).toBeInTheDocument();
    });

    it("shows error when instantiating non-compliant Blob() missing area()", () => {
      render(<PythonOopSimulator initialTab="abstraction" />);

      const blobBtn = screen.getByRole("button", { name: "Blob()" });
      fireEvent.click(blobBtn);

      expect(
        screen.getByText(/TypeError: Can't instantiate abstract class Blob/i)
      ).toBeInTheDocument();
    });

    it("successfully instantiates compliant Circle(2) with valid area", () => {
      render(<PythonOopSimulator initialTab="abstraction" />);

      const circleBtn = screen.getByRole("button", { name: "Circle(2)" });
      fireEvent.click(circleBtn);

      expect(screen.getByText(/created successfully!/i)).toBeInTheDocument();
    });
  });
});
