import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BinarySwitchboard } from "@/components/it-support/binary-switchboard";
import { CircuitSimulator } from "@/components/it-support/circuit-simulator";
import { RgbMixer } from "@/components/it-support/rgb-mixer";

function getReadouts(container: HTMLElement) {
  const binaryEl = screen.getByText("Binary String").parentElement!;
  const decimalEl = screen.getByText("Decimal Total").parentElement!;
  const hexEl = screen.getByText("Hexadecimal").parentElement!;
  const asciiEl = screen.getByText("ASCII Symbol").parentElement!;

  return {
    binary: binaryEl.children[1].textContent?.trim(),
    decimal: decimalEl.children[1].textContent?.trim(),
    hex: hexEl.children[1].textContent?.trim(),
    ascii: asciiEl.children[1].textContent?.trim(),
  };
}

describe("BinarySwitchboard Simulator", () => {
  it("renders with initial 0 value, 00000000, 0x00, and [NUL]", () => {
    const { container } = render(<BinarySwitchboard />);
    expect(
      screen.getByText("Interactive 8-Bit Binary Switchboard")
    ).toBeInTheDocument();

    const readouts = getReadouts(container);
    expect(readouts.binary).toBe("00000000");
    expect(readouts.decimal).toBe("0");
    expect(readouts.hex).toBe("0x00");
    expect(readouts.ascii).toBe("[NUL]");
  });

  it("toggles bit 7 (128) and updates calculation", () => {
    const { container } = render(<BinarySwitchboard />);
    const bit128 = screen.getByRole("button", { name: "Bit 7 (weight 128)" });
    fireEvent.click(bit128);

    expect(bit128).toHaveAttribute("aria-pressed", "true");
    let readouts = getReadouts(container);
    expect(readouts.binary).toBe("10000000");
    expect(readouts.decimal).toBe("128");
    expect(readouts.hex).toBe("0x80");
    expect(readouts.ascii).toBe("[Extended: 128]");

    // Clicking again turns it off
    fireEvent.click(bit128);
    expect(bit128).toHaveAttribute("aria-pressed", "false");
    readouts = getReadouts(container);
    expect(readouts.binary).toBe("00000000");
    expect(readouts.decimal).toBe("0");
    expect(readouts.hex).toBe("0x00");
  });

  it("calculates ASCII character 'A' (65 = 64 + 1)", () => {
    const { container } = render(<BinarySwitchboard />);
    const bit64 = screen.getByRole("button", { name: "Bit 6 (weight 64)" });
    const bit1 = screen.getByRole("button", { name: "Bit 0 (weight 1)" });

    fireEvent.click(bit64);
    fireEvent.click(bit1);

    const readouts = getReadouts(container);
    expect(readouts.binary).toBe("01000001");
    expect(readouts.decimal).toBe("65");
    expect(readouts.hex).toBe("0x41");
    expect(readouts.ascii).toBe("'A'");
  });

  it("calculates ASCII [SPACE] (32)", () => {
    const { container } = render(<BinarySwitchboard />);
    const bit32 = screen.getByRole("button", { name: "Bit 5 (weight 32)" });
    fireEvent.click(bit32);

    const readouts = getReadouts(container);
    expect(readouts.binary).toBe("00100000");
    expect(readouts.decimal).toBe("32");
    expect(readouts.hex).toBe("0x20");
    expect(readouts.ascii).toBe("[SPACE]");
  });

  it("calculates maximum total 255 with all bits active", () => {
    const { container } = render(<BinarySwitchboard />);
    const buttons = [
      screen.getByRole("button", { name: "Bit 7 (weight 128)" }),
      screen.getByRole("button", { name: "Bit 6 (weight 64)" }),
      screen.getByRole("button", { name: "Bit 5 (weight 32)" }),
      screen.getByRole("button", { name: "Bit 4 (weight 16)" }),
      screen.getByRole("button", { name: "Bit 3 (weight 8)" }),
      screen.getByRole("button", { name: "Bit 2 (weight 4)" }),
      screen.getByRole("button", { name: "Bit 1 (weight 2)" }),
      screen.getByRole("button", { name: "Bit 0 (weight 1)" }),
    ];

    buttons.forEach((btn) => fireEvent.click(btn));

    const readouts = getReadouts(container);
    expect(readouts.binary).toBe("11111111");
    expect(readouts.decimal).toBe("255");
    expect(readouts.hex).toBe("0xFF");
    expect(readouts.ascii).toBe("[Extended: 255]");
  });
});

describe("CircuitSimulator", () => {
  it("renders inputs A and B in initial OFF states (0,0)", () => {
    const { container } = render(<CircuitSimulator />);
    expect(screen.getByText("Live Circuit Simulation")).toBeInTheDocument();
    const btnA = screen.getByRole("button", { name: /Input A/i });
    const btnB = screen.getByRole("button", { name: /Input B/i });
    expect(btnA.textContent).toContain("0 (OFF)");
    expect(btnB.textContent).toContain("0 (OFF)");

    // Initial state: xor=0, not=1, out1=0, out2=0
    const values = Array.from(container.querySelectorAll("strong")).map(
      (el) => el.textContent
    );
    expect(values).toEqual(["0", "1", "0", "0"]);
  });

  it("evaluates complete truth-table transitions", () => {
    const { container } = render(<CircuitSimulator />);
    const btnA = screen.getByRole("button", { name: /Input A/i });
    const btnB = screen.getByRole("button", { name: /Input B/i });

    // Transition to (A=1, B=0)
    fireEvent.click(btnA);
    expect(btnA.textContent).toContain("1 (ON)");
    let values = Array.from(container.querySelectorAll("strong")).map(
      (el) => el.textContent
    );
    // xor=1, not=0, out1=0, out2=1
    expect(values).toEqual(["1", "0", "0", "1"]);

    // Transition to (A=1, B=1)
    fireEvent.click(btnB);
    expect(btnB.textContent).toContain("1 (ON)");
    values = Array.from(container.querySelectorAll("strong")).map(
      (el) => el.textContent
    );
    // xor=0, not=1, out1=1, out2=0
    expect(values).toEqual(["0", "1", "1", "0"]);

    // Transition to (A=0, B=1)
    fireEvent.click(btnA);
    expect(btnA.textContent).toContain("0 (OFF)");
    values = Array.from(container.querySelectorAll("strong")).map(
      (el) => el.textContent
    );
    // xor=1, not=0, out1=0, out2=1
    expect(values).toEqual(["1", "0", "0", "1"]);

    // Return to (A=0, B=0)
    fireEvent.click(btnB);
    expect(btnB.textContent).toContain("0 (OFF)");
    values = Array.from(container.querySelectorAll("strong")).map(
      (el) => el.textContent
    );
    expect(values).toEqual(["0", "1", "0", "0"]);
  });
});

describe("RgbMixer", () => {
  it("renders RGB channel sliders with default values and status badge", () => {
    render(<RgbMixer />);
    expect(screen.getByText("24-Bit RGB Pixel Simulation")).toBeInTheDocument();
    expect(screen.getByText(/#4285F4/)).toBeInTheDocument();
  });

  it("updates hex value and status badge when changing Red slider", () => {
    render(<RgbMixer />);
    const redSlider = screen.getByLabelText("RED (R) channel 0 to 255");
    fireEvent.change(redSlider, { target: { value: "255" } });
    expect(screen.getByText(/#FF85F4/)).toBeInTheDocument();
  });

  it("sets black (0,0,0) and displays white text contrast", () => {
    render(<RgbMixer />);
    const red = screen.getByLabelText("RED (R) channel 0 to 255");
    const green = screen.getByLabelText("GREEN (G) channel 0 to 255");
    const blue = screen.getByLabelText("BLUE (B) channel 0 to 255");

    fireEvent.change(red, { target: { value: "0" } });
    fireEvent.change(green, { target: { value: "0" } });
    fireEvent.change(blue, { target: { value: "0" } });

    const status = screen.getByRole("status");
    expect(status.textContent).toContain("#000000");
    expect(status).toHaveStyle({ color: "#FFFFFF" });
  });

  it("sets white (255,255,255) and displays black text contrast", () => {
    render(<RgbMixer />);
    const red = screen.getByLabelText("RED (R) channel 0 to 255");
    const green = screen.getByLabelText("GREEN (G) channel 0 to 255");
    const blue = screen.getByLabelText("BLUE (B) channel 0 to 255");

    fireEvent.change(red, { target: { value: "255" } });
    fireEvent.change(green, { target: { value: "255" } });
    fireEvent.change(blue, { target: { value: "255" } });

    const status = screen.getByRole("status");
    expect(status.textContent).toContain("#FFFFFF");
    expect(status).toHaveStyle({ color: "#000000" });
  });
});
