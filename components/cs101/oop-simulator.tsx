'use client';

import { useState } from 'react';
import { ShieldCheck, EyeOff, GitFork, Sparkles, CheckCircle2, AlertCircle, Play, RotateCcw } from 'lucide-react';

type Tab = 'encapsulation' | 'abstraction' | 'inheritance' | 'polymorphism';

export function OopSimulator() {
  const [activeTab, setActiveTab] = useState<Tab>('encapsulation');

  // Encapsulation state
  const [balance, setBalance] = useState(100);
  const [encapLog, setEncapLog] = useState<string>('Account initialized with $100.');
  const [encapStatus, setEncapStatus] = useState<'normal' | 'success' | 'error'>('normal');

  // Abstraction state
  const [engineStep, setEngineStep] = useState<number>(0);
  const [engineRunning, setEngineRunning] = useState<boolean>(false);

  // Inheritance state
  const [inheritAction, setInheritAction] = useState<string>('idle');

  // Polymorphism state
  const [polyActive, setPolyActive] = useState<boolean>(false);

  // Handlers for Encapsulation
  const handleDeposit = () => {
    setBalance((prev) => prev + 50);
    setEncapLog('deposit(50) approved: Validated positive amount. Balance updated.');
    setEncapStatus('success');
  };

  const handleWithdraw = () => {
    if (balance >= 30) {
      setBalance((prev) => prev - 30);
      setEncapLog('withdraw(30) approved: Sufficient funds verified.');
      setEncapStatus('success');
    } else {
      setEncapLog('withdraw(30) rejected: Insufficient funds invariant maintained.');
      setEncapStatus('error');
    }
  };

  const handleDirectHack = () => {
    setEncapStatus('error');
    setEncapLog("AttributeError: Cannot write to private '__balance' directly! State protected.");
  };

  // Handlers for Abstraction
  const handleStartCar = () => {
    if (engineRunning) return;
    setEngineRunning(true);
    setEngineStep(1);
    setTimeout(() => setEngineStep(2), 600);
    setTimeout(() => setEngineStep(3), 1200);
    setTimeout(() => setEngineStep(4), 1800);
  };

  const handleResetCar = () => {
    setEngineRunning(false);
    setEngineStep(0);
  };

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
      <div className="border-b border-fd-border bg-fd-secondary/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-500" />
          <h3 className="m-0 text-base font-semibold text-fd-foreground">
            Interactive OOP Simulator: The Four Pillars in Action
          </h3>
        </div>
        <p className="mt-1 text-xs text-fd-muted-foreground">
          Explore how Encapsulation, Abstraction, Inheritance, and Polymorphism behave under the hood.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-fd-border bg-fd-secondary/20">
        <button
          type="button"
          onClick={() => setActiveTab('encapsulation')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'encapsulation'
              ? 'border-b-2 border-sky-500 bg-fd-card text-sky-600 font-semibold dark:text-sky-400'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          1. Encapsulation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('abstraction')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'abstraction'
              ? 'border-b-2 border-sky-500 bg-fd-card text-sky-600 font-semibold dark:text-sky-400'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          <EyeOff className="h-3.5 w-3.5" />
          2. Abstraction
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inheritance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'inheritance'
              ? 'border-b-2 border-sky-500 bg-fd-card text-sky-600 font-semibold dark:text-sky-400'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          <GitFork className="h-3.5 w-3.5" />
          3. Inheritance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('polymorphism')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'polymorphism'
              ? 'border-b-2 border-sky-500 bg-fd-card text-sky-600 font-semibold dark:text-sky-400'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          4. Polymorphism
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* 1. ENCAPSULATION */}
        {activeTab === 'encapsulation' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-4">
              <h4 className="text-sm font-semibold text-fd-foreground">
                Concept: Protecting Internal State via Public Methods
              </h4>
              <p className="mt-1 text-xs text-fd-muted-foreground">
                The variable <code className="rounded bg-fd-secondary px-1 text-sky-600 dark:text-sky-400">__balance</code> is private. Outside callers cannot directly tamper with it — they must call public validated methods.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Object Card */}
              <div className="rounded-lg border-2 border-sky-500/30 bg-fd-card p-4">
                <div className="flex items-center justify-between border-b border-fd-border pb-2">
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    class BankAccount
                  </span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    Encapsulated
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded bg-fd-secondary/50 px-3 py-2">
                    <span className="font-mono text-xs text-fd-muted-foreground">
                      private __balance:
                    </span>
                    <span className="font-mono text-base font-bold text-fd-foreground">
                      ${balance}
                    </span>
                  </div>
                  <div className="rounded border border-fd-border/50 bg-fd-secondary/20 p-2 text-[11px] text-fd-muted-foreground">
                    Public API: <code className="text-xs text-fd-foreground">deposit()</code>, <code className="text-xs text-fd-foreground">withdraw()</code>, <code className="text-xs text-fd-foreground">get_balance()</code>
                  </div>
                </div>
              </div>

              {/* Actions & Console */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDeposit}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    + deposit(50)
                  </button>
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    - withdraw(30)
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectHack}
                    className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                  >
                    Hack: account.__balance = -500
                  </button>
                </div>

                <div
                  className={`flex items-start gap-2 rounded-lg border p-3 font-mono text-xs ${
                    encapStatus === 'error'
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300'
                      : encapStatus === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-fd-border bg-fd-secondary/40 text-fd-muted-foreground'
                  }`}
                >
                  {encapStatus === 'error' ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  )}
                  <span>{encapLog}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ABSTRACTION */}
        {activeTab === 'abstraction' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-4">
              <h4 className="text-sm font-semibold text-fd-foreground">
                Concept: Simple Surface Interface, Hidden Complex Machinery
              </h4>
              <p className="mt-1 text-xs text-fd-muted-foreground">
                The driver only presses <code className="rounded bg-fd-secondary px-1 text-sky-600 dark:text-sky-400">car.start()</code>. All low-level mechanics (fuel injection, spark ignition, sensor calibration) execute invisibly.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* User Surface */}
              <div className="flex flex-col justify-between rounded-lg border border-fd-border bg-fd-card p-5">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    Public Interface (What caller sees)
                  </span>
                  <p className="mt-2 text-xs text-fd-muted-foreground">
                    Just a single clean method call:
                  </p>
                  <pre className="mt-2 rounded bg-fd-secondary p-2.5 font-mono text-xs text-fd-foreground">
                    car.start()
                  </pre>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleStartCar}
                    disabled={engineRunning}
                    className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Press &quot;Start Engine&quot;
                  </button>
                  {engineRunning && (
                    <button
                      type="button"
                      onClick={handleResetCar}
                      className="flex items-center gap-1.5 rounded-md border border-fd-border px-3 py-2 text-xs font-semibold text-fd-foreground hover:bg-fd-secondary"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Internal Machinery */}
              <div className="rounded-lg border border-fd-border bg-fd-secondary/20 p-4">
                <span className="font-mono text-xs font-bold text-fd-muted-foreground">
                  Hidden Implementation (Internal Mechanics)
                </span>
                <div className="mt-3 space-y-2">
                  {[
                    { step: 1, label: '1. Checking battery voltage & starter relay' },
                    { step: 2, label: '2. Pressurizing fuel pump & electronic injection' },
                    { step: 3, label: '3. Firing spark plugs in timing sequence' },
                    { step: 4, label: '4. Engine idling smoothly at 800 RPM' },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className={`flex items-center gap-2 rounded px-3 py-2 text-xs font-mono transition-all ${
                        engineStep >= item.step
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'bg-fd-secondary/40 text-fd-muted-foreground/60'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          engineStep >= item.step ? 'bg-emerald-500' : 'bg-fd-muted-foreground/30'
                        }`}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. INHERITANCE */}
        {activeTab === 'inheritance' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-4">
              <h4 className="text-sm font-semibold text-fd-foreground">
                Concept: Code Reuse Through Parent & Child Hierarchies
              </h4>
              <p className="mt-1 text-xs text-fd-muted-foreground">
                <code className="rounded bg-fd-secondary px-1 text-sky-600 dark:text-sky-400">ElectricCar</code> inherits base attributes and methods from <code className="rounded bg-fd-secondary px-1 text-sky-600 dark:text-sky-400">Vehicle</code>, while adding its own specialized capabilities.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                {/* Parent */}
                <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-fd-foreground">
                      Base Class: Vehicle
                    </span>
                    <span className="rounded bg-fd-secondary px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">
                      Parent
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-xs text-fd-muted-foreground">
                    <div>• brand: &quot;Tesla&quot;</div>
                    <div>• speed: 120 km/h</div>
                    <div className="text-emerald-600 dark:text-emerald-400">
                      • def drive(): &quot;Cruising on highway&quot;
                    </div>
                  </div>
                </div>

                <div className="flex justify-center text-xs font-bold text-sky-500">
                  ↓ inherits from
                </div>

                {/* Child */}
                <div className="rounded-lg border-2 border-sky-500/40 bg-fd-card p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      Subclass: ElectricCar(Vehicle)
                    </span>
                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      Child
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-xs text-fd-muted-foreground">
                    <div className="text-fd-muted-foreground/70">
                      ↳ Inherits all Vehicle methods & properties!
                    </div>
                    <div className="text-sky-600 dark:text-sky-400 font-semibold">
                      + battery_capacity: 85 kWh
                    </div>
                    <div className="text-sky-600 dark:text-sky-400 font-semibold">
                      + def charge(): &quot;Supercharging battery...&quot;
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Demo */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-fd-foreground">
                  Invoke Methods on child instance <code className="text-sky-500">my_ev</code>:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setInheritAction('drive')}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Call my_ev.drive() (Inherited)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInheritAction('charge')}
                    className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Call my_ev.charge() (Specialized)
                  </button>
                </div>

                <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-3 font-mono text-xs">
                  <div className="text-fd-muted-foreground">Execution Output:</div>
                  <div className="mt-1 font-semibold text-fd-foreground">
                    {inheritAction === 'drive' && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        &gt;&gt; [Parent Method] Driving smoothly at 120 km/h!
                      </span>
                    )}
                    {inheritAction === 'charge' && (
                      <span className="text-sky-600 dark:text-sky-400">
                        &gt;&gt; [Child Method] Battery connected to 250 kW Supercharger!
                      </span>
                    )}
                    {inheritAction === 'idle' && (
                      <span className="text-fd-muted-foreground">
                        Click a button above to run inherited or child-specific methods.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. POLYMORPHISM */}
        {activeTab === 'polymorphism' && (
          <div className="space-y-5">
            <div className="rounded-lg border border-fd-border bg-fd-secondary/30 p-4">
              <h4 className="text-sm font-semibold text-fd-foreground">
                Concept: Same Method Call, Diverse Class-Specific Behaviors
              </h4>
              <p className="mt-1 text-xs text-fd-muted-foreground">
                A single unified loop calls <code className="rounded bg-fd-secondary px-1 text-sky-600 dark:text-sky-400">speaker.speak()</code> across different objects. Each object executes its own unique implementation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-fd-foreground">
                  Loop Iteration: <code className="font-mono text-sky-500">for obj in [dog, cat, duck]: obj.speak()</code>
                </span>
                <button
                  type="button"
                  onClick={() => setPolyActive(!polyActive)}
                  className="rounded-md bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {polyActive ? 'Clear Output' : 'Execute .speak() on All'}
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    type: 'Dog',
                    method: 'speak()',
                    response: '"Woof! Woof!" 🐶',
                    color: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                  },
                  {
                    type: 'Cat',
                    method: 'speak()',
                    response: '"Meow! Purr!" 🐱',
                    color: 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300',
                  },
                  {
                    type: 'Duck',
                    method: 'speak()',
                    response: '"Quack! Quack!" 🦆',
                    color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="rounded-lg border border-fd-border bg-fd-card p-4 text-center transition-all"
                  >
                    <div className="font-mono text-xs font-bold text-fd-foreground">
                      class {item.type}
                    </div>
                    <div className="mt-1 text-[11px] text-fd-muted-foreground font-mono">
                      def {item.method}
                    </div>
                    <div
                      className={`mt-3 rounded border p-2 text-xs font-bold transition-all ${
                        polyActive ? item.color : 'border-fd-border bg-fd-secondary/30 text-fd-muted-foreground/40'
                      }`}
                    >
                      {polyActive ? item.response : 'Waiting...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
