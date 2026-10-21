"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Boxes,
  GitFork,
  ShieldCheck,
  Shapes,
  FileCheck2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Gauge,
  ArrowRight,
  Terminal,
} from "lucide-react";

export type OopTab =
  "classes" | "inheritance" | "encapsulation" | "polymorphism" | "abstraction";

interface PythonOopSimulatorProps {
  initialTab?: OopTab;
}

// -------------------------------------------------------------
// Syntax Highlighting Helper
// -------------------------------------------------------------
function highlightPythonLine(line: string) {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let keyIdx = 0;

  // Simple regex for Python tokens
  const tokenRegex =
    /(#.*$)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(@\w+)|\b(class|def|return|self|raise|if|else|import|from|for|in|pass|print|max|min)\b|\b(\d+\.?\d*)\b/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={keyIdx++}>{remaining.slice(lastIndex, match.index)}</span>
      );
    }

    const [full, comment, dStr, sStr, decorator, keyword, num] = match;

    if (comment) {
      parts.push(
        <span
          key={keyIdx++}
          className="text-emerald-600/80 italic dark:text-emerald-400/70"
        >
          {comment}
        </span>
      );
    } else if (dStr || sStr) {
      parts.push(
        <span key={keyIdx++} className="text-amber-600 dark:text-amber-400">
          {dStr || sStr}
        </span>
      );
    } else if (decorator) {
      parts.push(
        <span
          key={keyIdx++}
          className="text-violet-600 font-semibold dark:text-violet-400"
        >
          {decorator}
        </span>
      );
    } else if (keyword) {
      parts.push(
        <span
          key={keyIdx++}
          className="text-purple-600 font-semibold dark:text-purple-400"
        >
          {keyword}
        </span>
      );
    } else if (num) {
      parts.push(
        <span key={keyIdx++} className="text-sky-600 dark:text-sky-400">
          {num}
        </span>
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < remaining.length) {
    parts.push(<span key={keyIdx++}>{remaining.slice(lastIndex)}</span>);
  }

  return parts.length ? parts : " ";
}

// Code viewer with active line highlighting
function CodeViewer({
  code,
  highlightedLines = [],
}: {
  code: string[];
  highlightedLines?: number[];
}) {
  return (
    <pre className="not-prose overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary/30 p-3 font-mono text-[12.5px] leading-relaxed text-fd-foreground">
      <code>
        {code.map((line, idx) => {
          const isHighlighted = highlightedLines.includes(idx);
          return (
            <div
              key={idx}
              className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                isHighlighted
                  ? "bg-amber-500/15 border-l-2 border-amber-500 text-fd-foreground font-semibold dark:bg-amber-500/20"
                  : "border-l-2 border-transparent text-fd-foreground/85"
              }`}
            >
              <span className="mr-3 w-5 select-none text-right text-[11px] text-fd-muted-foreground/60">
                {idx + 1}
              </span>
              <span className="flex-1 whitespace-pre">
                {highlightPythonLine(line)}
              </span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}

// -------------------------------------------------------------
// 0. Class and Object Data & Logic
// -------------------------------------------------------------
const CAR_BLUEPRINT_CODE = [
  "class Car:",
  "    def __init__(self, brand):",
  "        self.brand = brand",
  "        self.speed = 0",
  "    def accelerate(self):",
  "        self.speed = min(100, self.speed + 20)",
  "    def brake(self):",
  "        self.speed = max(0, self.speed - 20)",
];

interface CarInstance {
  id: string;
  name: string;
  brand: string;
  speed: number;
}

// -------------------------------------------------------------
// 1. Inheritance Data & Logic
// -------------------------------------------------------------
const INHERITANCE_CODE = [
  "class Animal:",
  "    def __init__(self, name):",
  "        self.name = name",
  "    def eat(self):",
  '        return f"{self.name} eats"',
  "    def speak(self):",
  '        return "..."',
  "",
  "class Dog(Animal):",
  "    def speak(self):",
  '        return "Woof"',
  "    def fetch(self):",
  '        return f"{self.name} fetches"',
  "",
  "class Cat(Animal):",
  "    def speak(self):",
  '        return "Meow"',
];

const INHERITANCE_DATA: Record<
  string,
  {
    lines: number[];
    members: Array<{ name: string; tag: "own" | "inherited" | "overridden" }>;
  }
> = {
  Animal: {
    lines: [0, 1, 2, 3, 4, 5, 6],
    members: [
      { name: "name", tag: "own" },
      { name: "eat()", tag: "own" },
      { name: "speak()", tag: "own" },
    ],
  },
  Dog: {
    lines: [8, 9, 10, 11, 12],
    members: [
      { name: "name", tag: "inherited" },
      { name: "eat()", tag: "inherited" },
      { name: "speak()", tag: "overridden" },
      { name: "fetch()", tag: "own" },
    ],
  },
  Cat: {
    lines: [14, 15, 16],
    members: [
      { name: "name", tag: "inherited" },
      { name: "eat()", tag: "inherited" },
      { name: "speak()", tag: "overridden" },
    ],
  },
};

// -------------------------------------------------------------
// 2. Encapsulation Data & Logic
// -------------------------------------------------------------
const ENCAPSULATION_CODE = [
  "class BankAccount:",
  "    def __init__(self, owner):",
  "        self.owner = owner",
  "        self.__balance = 0",
  "    def deposit(self, amt):",
  "        if amt <= 0: raise ValueError",
  "        self.__balance += amt",
  "    def withdraw(self, amt):",
  "        if amt > self.__balance:",
  '            raise ValueError("Insufficient funds")',
  "        self.__balance -= amt",
  "    @property",
  "    def balance(self):",
  "        return self.__balance",
];

// -------------------------------------------------------------
// 3. Polymorphism Data & Logic
// -------------------------------------------------------------
const POLYMORPHISM_CODE = [
  "class Circle:",
  "    def __init__(self, r): self.r = r",
  "    def area(self): return 3.14159 * self.r ** 2",
  "class Square:",
  "    def __init__(self, s): self.s = s",
  "    def area(self): return self.s ** 2",
  "class Triangle:",
  "    def __init__(self, b, h): self.b, self.h = b, h",
  "    def area(self): return 0.5 * self.b * self.h",
  "",
  "shapes = [Circle(2), Square(3), Triangle(4, 5)]",
  "for s in shapes:",
  "    print(s.area())",
];

// -------------------------------------------------------------
// 4. Abstraction Data & Logic
// -------------------------------------------------------------
const ABSTRACTION_CODE = [
  "from abc import ABC, abstractmethod",
  "",
  "class Shape(ABC):",
  "    @abstractmethod",
  "    def area(self): ...",
  "",
  "class Circle(Shape):",
  "    def __init__(self, r): self.r = r",
  "    def area(self): return 3.14159 * self.r ** 2",
  "",
  "class Blob(Shape):",
  "    pass",
];

interface LogEntry {
  id: number;
  text: string;
  type: "ok" | "err" | "info";
}

export function PythonOopSimulator({
  initialTab = "classes",
}: PythonOopSimulatorProps) {
  const [activeTab, setActiveTab] = useState<OopTab>(initialTab);

  // Sync if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // -----------------------------------------------------------
  // Tab 0 State (Class & Objects)
  // -----------------------------------------------------------
  const [cars, setCars] = useState<CarInstance[]>([
    { id: "car1", name: "car1", brand: "Tesla", speed: 20 },
  ]);
  const [newBrand, setNewBrand] = useState("Porsche");
  const [carLines, setCarLines] = useState<number[]>([]);
  const [carScript, setCarScript] = useState<string[]>([
    "# Your executed calls appear here:",
    'car1 = Car("Tesla")',
    "car1.accelerate()",
  ]);

  const handleBuildCar = () => {
    if (cars.length >= 4) return;
    const count = cars.length + 1;
    const name = `car${count}`;
    const brand = newBrand.trim() || "Tesla";
    const newCar: CarInstance = { id: name, name, brand, speed: 0 };
    setCars((prev) => [...prev, newCar]);
    setCarScript((prev) => [...prev.slice(-6), `${name} = Car("${brand}")`]);
    setCarLines([1, 2, 3]);
    setNewBrand(count === 2 ? "BMW" : count === 3 ? "Audi" : "Toyota");
  };

  const handleCarAction = (carId: string, action: "accelerate" | "brake") => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        const speed =
          action === "accelerate"
            ? Math.min(100, c.speed + 20)
            : Math.max(0, c.speed - 20);
        return { ...c, speed };
      })
    );
    setCarScript((prev) => [...prev.slice(-6), `${carId}.${action}()`]);
    setCarLines(action === "accelerate" ? [4, 5] : [6, 7]);
  };

  // -----------------------------------------------------------
  // Tab 1 State (Inheritance)
  // -----------------------------------------------------------
  const [selectedClass, setSelectedClass] = useState<"Animal" | "Dog" | "Cat">(
    "Dog"
  );
  const inheritanceDetails = INHERITANCE_DATA[selectedClass];

  // -----------------------------------------------------------
  // Tab 2 State (Encapsulation)
  // -----------------------------------------------------------
  const [balance, setBalance] = useState(100);
  const [encapLines, setEncapLines] = useState<number[]>([1, 2, 3]);
  const [encapLogs, setEncapLogs] = useState<LogEntry[]>([
    {
      id: 1,
      text: 'acct = BankAccount("Ada")  # balance initialized to 0',
      type: "info",
    },
    { id: 2, text: "acct.deposit(100)  # ok (balance is 100)", type: "ok" },
  ]);

  const addEncapLog = (text: string, type: "ok" | "err" | "info") => {
    setEncapLogs((prev) => [
      ...prev.slice(-6),
      { id: Date.now() + Math.random(), text, type },
    ]);
  };

  const handleEncapDeposit = () => {
    setBalance((prev) => prev + 100);
    setEncapLines([4, 5, 6]);
    addEncapLog(
      `acct.deposit(100)  =>  OK (New balance: $${balance + 100})`,
      "ok"
    );
  };

  const handleEncapWithdraw = (amt: number) => {
    if (amt > balance) {
      setEncapLines([7, 8, 9]);
      addEncapLog(
        `acct.withdraw(${amt})  =>  ValueError: Insufficient funds (Current: $${balance})`,
        "err"
      );
    } else {
      setBalance((prev) => prev - amt);
      setEncapLines([7, 8, 10]);
      addEncapLog(
        `acct.withdraw(${amt})  =>  OK (Remaining balance: $${balance - amt})`,
        "ok"
      );
    }
  };

  const handleEncapDirectAccess = () => {
    setEncapLines([3]);
    addEncapLog(
      "acct.__balance  =>  AttributeError: 'BankAccount' object has no attribute '__balance' (Private / Name-mangled)",
      "err"
    );
  };

  const handleEncapProperty = () => {
    setEncapLines([11, 12, 13]);
    addEncapLog(
      `acct.balance  =>  ${balance}  (Read via @property getter)`,
      "ok"
    );
  };

  // -----------------------------------------------------------
  // Tab 3 State (Polymorphism)
  // -----------------------------------------------------------
  const [polyActiveShape, setPolyActiveShape] = useState<number | null>(null);
  const [polyRunning, setPolyRunning] = useState(false);
  const [polyLines, setPolyLines] = useState<number[]>([]);
  const [polyLogs, setPolyLogs] = useState<LogEntry[]>([
    {
      id: 1,
      text: "shapes = [Circle(2), Square(3), Triangle(4, 5)]",
      type: "info",
    },
  ]);

  const runPolyLoop = () => {
    if (polyRunning) return;
    setPolyRunning(true);
    setPolyLogs([]);
    setPolyActiveShape(null);

    const items = [
      { name: "Circle", val: "12.56637", lines: [1, 2, 10, 11] },
      { name: "Square", val: "9", lines: [4, 5, 10, 11] },
      { name: "Triangle", val: "10.0", lines: [7, 8, 10, 11] },
    ];

    items.forEach((item, idx) => {
      setTimeout(() => {
        setPolyActiveShape(idx);
        setPolyLines(item.lines);
        setPolyLogs((prev) => [
          ...prev,
          {
            id: Date.now() + idx,
            text: `s.area() -> ${item.name}(...).area() = ${item.val}`,
            type: "ok",
          },
        ]);

        if (idx === items.length - 1) {
          setTimeout(() => {
            setPolyActiveShape(null);
            setPolyLines([]);
            setPolyRunning(false);
          }, 1000);
        }
      }, idx * 1100);
    });
  };

  // -----------------------------------------------------------
  // Tab 4 State (Abstraction)
  // -----------------------------------------------------------
  const [abstractLines, setAbstractLines] = useState<number[]>([]);
  const [abstractLogs, setAbstractLogs] = useState<LogEntry[]>([
    {
      id: 1,
      text: "Click buttons below to instantiate Shape, Blob, or Circle:",
      type: "info",
    },
  ]);

  const handleInstantiate = (target: "Shape" | "Blob" | "Circle") => {
    if (target === "Circle") {
      setAbstractLines([6, 7, 8]);
      setAbstractLogs((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          text: "Circle(2)  =>  <Circle object at 0x7f8a> created successfully!",
          type: "ok",
        },
      ]);
    } else if (target === "Shape") {
      setAbstractLines([2, 3, 4]);
      setAbstractLogs((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          text: "Shape()  =>  TypeError: Can't instantiate abstract class Shape with abstract method 'area'",
          type: "err",
        },
      ]);
    } else {
      setAbstractLines([10, 11]);
      setAbstractLogs((prev) => [
        ...prev.slice(-5),
        {
          id: Date.now(),
          text: "Blob()  =>  TypeError: Can't instantiate abstract class Blob with abstract method 'area'",
          type: "err",
        },
      ]);
    }
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
      {/* Header */}
      <div className="border-b border-fd-border bg-fd-secondary/40 px-5 py-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="m-0 text-base font-semibold text-fd-foreground">
                How OOP Works in Python: Interactive Simulator
              </h3>
              <p className="m-0 text-xs text-fd-muted-foreground">
                A class is a blueprint; an object is a live instance. Press
                actions and watch the matching lines of code light up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-fd-border bg-fd-secondary/20">
        {[
          { id: "classes", label: "1. Class & Object", icon: Boxes },
          { id: "inheritance", label: "2. Inheritance", icon: GitFork },
          { id: "encapsulation", label: "3. Encapsulation", icon: ShieldCheck },
          { id: "polymorphism", label: "4. Polymorphism", icon: Shapes },
          { id: "abstraction", label: "5. Abstraction", icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as OopTab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-medium transition-all ${
                isActive
                  ? "border-amber-500 bg-fd-card text-amber-600 font-semibold dark:text-amber-400"
                  : "border-transparent text-fd-muted-foreground hover:bg-fd-secondary/40 hover:text-fd-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-5 md:p-6">
        {/* ======================================================== */}
        {/* 0. CLASS & OBJECT                                        */}
        {/* ======================================================== */}
        {activeTab === "classes" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Code Views */}
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-fd-foreground">
                    The Blueprint (Written Once)
                  </span>
                  <span className="text-[11px] text-fd-muted-foreground">
                    Defines state & methods
                  </span>
                </div>
                <CodeViewer
                  code={CAR_BLUEPRINT_CODE}
                  highlightedLines={carLines}
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-fd-foreground">
                    Live Script Execution
                  </span>
                  <span className="text-[11px] text-fd-muted-foreground">
                    Active method invocations
                  </span>
                </div>
                <pre className="not-prose overflow-x-auto rounded-lg border border-fd-border bg-fd-secondary/40 p-3 font-mono text-[12px] text-fd-foreground/90">
                  {carScript.slice(-6).map((line, i) => (
                    <div
                      key={i}
                      className={
                        i === carScript.slice(-6).length - 1
                          ? "font-semibold text-amber-600 dark:text-amber-400"
                          : "text-fd-muted-foreground"
                      }
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Right: Interactive Blueprint & Instances */}
            <div className="space-y-4">
              {/* Blueprint Summary Box */}
              <div className="rounded-lg border-2 border-dashed border-fd-border bg-fd-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    class Car:
                  </span>
                  <span className="text-[11px] text-fd-muted-foreground">
                    Blueprint Specification
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-xs text-fd-muted-foreground">
                  <div>• attribute: brand</div>
                  <div>• method: accelerate()</div>
                  <div>• attribute: speed (0-100)</div>
                  <div>• method: brake()</div>
                </div>
              </div>

              {/* Build New Car Controls */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  maxLength={12}
                  placeholder="Car Brand (e.g. Tesla)"
                  className="w-40 rounded-md border border-fd-border bg-fd-card px-3 py-1.5 text-xs font-mono text-fd-foreground placeholder:text-fd-muted-foreground/50 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleBuildCar}
                  disabled={cars.length >= 4}
                  className="flex items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 dark:text-slate-950"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Build Instance ({cars.length}/4)
                </button>
              </div>

              {/* Instances Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className="flex flex-col justify-between rounded-lg border-2 border-amber-500/40 bg-fd-card p-3.5 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-fd-border pb-1.5 font-mono text-xs">
                        <span className="font-bold text-fd-foreground">
                          {car.name}
                        </span>
                        <span className="text-fd-muted-foreground">
                          brand:{" "}
                          <strong className="text-fd-foreground">
                            {car.brand}
                          </strong>
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-fd-muted-foreground">Speed:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {car.speed} km/h
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-fd-secondary">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${car.speed}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCarAction(car.id, "accelerate")}
                        className="flex-1 rounded border border-fd-border bg-fd-secondary/70 py-1 text-center font-mono text-[11px] font-semibold text-fd-foreground hover:bg-fd-secondary"
                      >
                        accelerate()
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCarAction(car.id, "brake")}
                        className="flex-1 rounded border border-fd-border bg-fd-secondary/70 py-1 text-center font-mono text-[11px] font-semibold text-fd-foreground hover:bg-fd-secondary"
                      >
                        brake()
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 1. INHERITANCE                                           */}
        {/* ======================================================== */}
        {activeTab === "inheritance" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Code Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-fd-foreground">
                  The Classes & Method Definitions
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  Subclasses inherit everything from Animal
                </span>
              </div>
              <CodeViewer
                code={INHERITANCE_CODE}
                highlightedLines={inheritanceDetails.lines}
              />
            </div>

            {/* Right: Interactive Family Tree */}
            <div className="space-y-5">
              <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-4">
                <h4 className="m-0 text-xs font-semibold text-fd-foreground">
                  Interactive Class Hierarchy Inspector
                </h4>
                <p className="mt-1 text-xs text-fd-muted-foreground">
                  Select a class node to inspect which members it defines
                  directly, inherits from its parent, or overrides with a
                  specialized implementation.
                </p>
              </div>

              {/* Family Tree Nodes */}
              <div className="flex flex-col items-center">
                {/* Animal Parent */}
                <button
                  type="button"
                  onClick={() => setSelectedClass("Animal")}
                  className={`rounded-lg border-2 px-6 py-2.5 font-mono text-xs font-bold transition-all ${
                    selectedClass === "Animal"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-fd-border bg-fd-card text-fd-foreground hover:border-fd-border/80"
                  }`}
                >
                  Animal (Base Class)
                </button>

                {/* Connector Branch Line */}
                <div className="my-1.5 h-6 w-0.5 bg-fd-border" />

                {/* Subclasses */}
                <div className="flex gap-6">
                  {(["Dog", "Cat"] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`rounded-lg border-2 px-5 py-2 font-mono text-xs font-bold transition-all ${
                        selectedClass === cls
                          ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-fd-border bg-fd-card text-fd-foreground hover:border-fd-border/80"
                      }`}
                    >
                      {cls}(Animal)
                    </button>
                  ))}
                </div>
              </div>

              {/* Member Breakdown Inspector */}
              <div className="rounded-lg border border-fd-border bg-fd-card p-4">
                <div className="flex items-center justify-between border-b border-fd-border pb-2">
                  <span className="font-mono text-xs font-bold text-fd-foreground">
                    Members of{" "}
                    <code className="text-amber-600 dark:text-amber-400">
                      {selectedClass}
                    </code>
                  </span>
                  <span className="text-[11px] text-fd-muted-foreground">
                    Namespace resolution
                  </span>
                </div>

                <div className="mt-3 space-y-2 font-mono text-xs">
                  {inheritanceDetails.members.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between rounded bg-fd-secondary/30 px-3 py-1.5"
                    >
                      <span className="text-fd-foreground">{member.name}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          member.tag === "own"
                            ? "border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : member.tag === "overridden"
                              ? "border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "border border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                        }`}
                      >
                        {member.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ENCAPSULATION                                         */}
        {/* ======================================================== */}
        {activeTab === "encapsulation" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Code Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-fd-foreground">
                  The BankAccount Class
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  Double underscore __balance hides state
                </span>
              </div>
              <CodeViewer
                code={ENCAPSULATION_CODE}
                highlightedLines={encapLines}
              />
            </div>

            {/* Right: The Vault & Actions */}
            <div className="space-y-4">
              {/* The Vault Graphic */}
              <div className="relative rounded-xl border-2 border-fd-border bg-fd-card p-6 text-center shadow-sm">
                <span className="absolute -top-3 left-4 bg-fd-card px-2 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  inside the object namespace
                </span>
                <div className="font-mono text-xs text-fd-muted-foreground">
                  Private State:{" "}
                  <code className="text-fd-foreground font-semibold">
                    self.__balance
                  </code>
                </div>
                <div className="mt-2 font-mono text-4xl font-extrabold text-amber-600 dark:text-amber-400">
                  ${balance}
                </div>
                <div className="mt-1 text-xs text-fd-muted-foreground">
                  Protected by Python Name Mangling (
                  <code className="text-[11px]">_BankAccount__balance</code>)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-fd-foreground">
                  Simulate Calls From External Code:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleEncapDeposit}
                    className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    acct.deposit(100)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEncapWithdraw(50)}
                    className="rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-sky-600 hover:bg-sky-500/20 dark:text-sky-400"
                  >
                    acct.withdraw(50)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEncapWithdraw(500)}
                    className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                  >
                    acct.withdraw(500)
                  </button>
                  <button
                    type="button"
                    onClick={handleEncapDirectAccess}
                    className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                  >
                    acct.__balance (Direct Tamper)
                  </button>
                  <button
                    type="button"
                    onClick={handleEncapProperty}
                    className="rounded-md border border-purple-500/40 bg-purple-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-purple-600 hover:bg-purple-500/20 dark:text-purple-400"
                  >
                    acct.balance (@property)
                  </button>
                </div>
              </div>

              {/* Console Output */}
              <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-fd-muted-foreground pb-2 border-b border-fd-border/50">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Execution Log</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {encapLogs.map((log) => (
                    <div
                      key={log.id}
                      className={
                        log.type === "err"
                          ? "text-rose-600 dark:text-rose-400 font-medium"
                          : log.type === "ok"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-fd-muted-foreground"
                      }
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. POLYMORPHISM                                          */}
        {/* ======================================================== */}
        {activeTab === "polymorphism" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Code Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-fd-foreground">
                  Three Classes, One Method Interface
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  Each class answers .area() its own way
                </span>
              </div>
              <CodeViewer
                code={POLYMORPHISM_CODE}
                highlightedLines={polyLines}
              />
            </div>

            {/* Right: Shapes SVG Visualizer & Loop Runner */}
            <div className="space-y-4">
              <div className="rounded-lg border border-fd-border bg-fd-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-fd-foreground">
                    One Loop, Multiple Underlying Forms
                  </span>
                  <span className="text-[11px] text-fd-muted-foreground">
                    Duck Typing in action
                  </span>
                </div>

                {/* SVG Visual */}
                <div className="flex justify-center py-2">
                  <svg viewBox="0 0 360 120" className="w-full max-w-sm">
                    {/* Circle */}
                    <circle
                      cx="60"
                      cy="50"
                      r="32"
                      className={`transition-all duration-300 ${
                        polyActiveShape === 0
                          ? "fill-amber-500/30 stroke-amber-500 stroke-[3]"
                          : "fill-fd-secondary/50 stroke-fd-border stroke-2"
                      }`}
                    />
                    <text
                      x="60"
                      y="106"
                      textAnchor="middle"
                      className="fill-fd-foreground font-mono text-[12px] font-semibold"
                    >
                      Circle(2)
                    </text>

                    {/* Square */}
                    <rect
                      x="148"
                      y="18"
                      width="64"
                      height="64"
                      className={`transition-all duration-300 ${
                        polyActiveShape === 1
                          ? "fill-amber-500/30 stroke-amber-500 stroke-[3]"
                          : "fill-fd-secondary/50 stroke-fd-border stroke-2"
                      }`}
                    />
                    <text
                      x="180"
                      y="106"
                      textAnchor="middle"
                      className="fill-fd-foreground font-mono text-[12px] font-semibold"
                    >
                      Square(3)
                    </text>

                    {/* Triangle */}
                    <polygon
                      points="300,18 336,82 264,82"
                      className={`transition-all duration-300 ${
                        polyActiveShape === 2
                          ? "fill-amber-500/30 stroke-amber-500 stroke-[3]"
                          : "fill-fd-secondary/50 stroke-fd-border stroke-2"
                      }`}
                    />
                    <text
                      x="300"
                      y="106"
                      textAnchor="middle"
                      className="fill-fd-foreground font-mono text-[12px] font-semibold"
                    >
                      Triangle(4, 5)
                    </text>
                  </svg>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={runPolyLoop}
                    disabled={polyRunning}
                    className="flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 dark:text-slate-950"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {polyRunning
                      ? "Executing Loop..."
                      : "Execute for s in shapes: s.area()"}
                  </button>
                </div>
              </div>

              {/* Console Output */}
              <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-fd-muted-foreground pb-2 border-b border-fd-border/50">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Polymorphic Dispatch Output</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {polyLogs.map((log) => (
                    <div
                      key={log.id}
                      className={
                        log.type === "ok"
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-fd-muted-foreground"
                      }
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. ABSTRACTION                                           */}
        {/* ======================================================== */}
        {activeTab === "abstraction" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left: Code Viewer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-fd-foreground">
                  The ABC Contract
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  Shape requires all subclasses to implement area()
                </span>
              </div>
              <CodeViewer
                code={ABSTRACTION_CODE}
                highlightedLines={abstractLines}
              />
            </div>

            {/* Right: Contract Compliance Matrix & Actions */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-fd-border bg-fd-secondary/30 px-3.5 py-2.5 font-mono text-xs">
                  <span className="font-semibold text-fd-foreground">
                    Shape (Abstract Base Class)
                  </span>
                  <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    area() is abstract
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-dashed border-rose-500/40 bg-rose-500/5 px-3.5 py-2.5 font-mono text-xs">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Blob(Shape) — Non-compliant
                  </span>
                  <span className="rounded bg-rose-500/15 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    area() is missing
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-emerald-500/40 bg-emerald-500/5 px-3.5 py-2.5 font-mono text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Circle(Shape) — Compliant
                  </span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    area() is implemented
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-fd-foreground">
                  Attempt Instantiation:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantiate("Shape")}
                    className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                  >
                    Shape()
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantiate("Blob")}
                    className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                  >
                    Blob()
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantiate("Circle")}
                    className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    Circle(2)
                  </button>
                </div>
              </div>

              {/* Console Output */}
              <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-fd-muted-foreground pb-2 border-b border-fd-border/50">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Python Runtime Type Verification</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {abstractLogs.map((log) => (
                    <div
                      key={log.id}
                      className={
                        log.type === "err"
                          ? "text-rose-600 dark:text-rose-400 font-medium"
                          : log.type === "ok"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-fd-muted-foreground"
                      }
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
