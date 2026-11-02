import { describe, it, expect } from "vitest";

// ── GitHub Actions simulators ────────────────────────────────────────────────
import * as workflowLifecycle from "@/components/github-actions/workflow-lifecycle-simulator";
import * as matrixRunner from "@/components/github-actions/matrix-runner-simulator";
import * as secretsEnv from "@/components/github-actions/secrets-and-env-simulator";
import * as actionAuthoring from "@/components/github-actions/action-authoring-chooser";

describe("GitHub Actions simulator exports", () => {
  it("exports WorkflowLifecycleSimulator", () => {
    expect(typeof workflowLifecycle.WorkflowLifecycleSimulator).toBe(
      "function"
    );
  });

  it("exports MatrixRunnerSimulator", () => {
    expect(typeof matrixRunner.MatrixRunnerSimulator).toBe("function");
  });

  it("exports SecretsAndEnvSimulator", () => {
    expect(typeof secretsEnv.SecretsAndEnvSimulator).toBe("function");
  });

  it("exports ActionAuthoringChooser", () => {
    expect(typeof actionAuthoring.ActionAuthoringChooser).toBe("function");
  });
});

// ── Computer Networking simulators ───────────────────────────────────────────
import * as networking from "@/components/computer-networking/networking-simulators";

describe("Computer Networking simulator exports", () => {
  it("exports PortInspector", () => {
    expect(typeof networking.PortInspector).toBe("function");
  });

  it("exports CidrCalculator", () => {
    expect(typeof networking.CidrCalculator).toBe("function");
  });

  it("exports FirewallSimulator", () => {
    expect(typeof networking.FirewallSimulator).toBe("function");
  });

  it("exports NatTranslator", () => {
    expect(typeof networking.NatTranslator).toBe("function");
  });

  it("exports K8sServiceSimulator", () => {
    expect(typeof networking.K8sServiceSimulator).toBe("function");
  });

  it("exports PacketJourneyFlow", () => {
    expect(typeof networking.PacketJourneyFlow).toBe("function");
  });
});

// ── API Design simulators ────────────────────────────────────────────────────
import * as apiSim from "@/components/api-design/api-fundamentals-simulator";

describe("API Design simulator exports", () => {
  it("exports ApiRequestLifecycleDemo", () => {
    expect(typeof apiSim.ApiRequestLifecycleDemo).toBe("function");
  });

  it("exports ApiTypesExplorer", () => {
    expect(typeof apiSim.ApiTypesExplorer).toBe("function");
  });

  it("exports RestBookPlayground", () => {
    expect(typeof apiSim.RestBookPlayground).toBe("function");
  });

  it("exports GraphqlOverfetchingDemo", () => {
    expect(typeof apiSim.GraphqlOverfetchingDemo).toBe("function");
  });

  it("exports GrpcStreamingDemo", () => {
    expect(typeof apiSim.GrpcStreamingDemo).toBe("function");
  });

  it("exports ApiArchitectureChooser", () => {
    expect(typeof apiSim.ApiArchitectureChooser).toBe("function");
  });

  it("exports ApiKeySecuritySimulator", () => {
    expect(typeof apiSim.ApiKeySecuritySimulator).toBe("function");
  });
});

// ── Developer Tools simulators ───────────────────────────────────────────────
import * as bashSim from "@/components/developer-tools/bash-simulator";
import * as gitGraph from "@/components/developer-tools/git-graph-simulator";
import * as linuxCmds from "@/components/developer-tools/linux-commands-explorer";
import * as psDemo from "@/components/developer-tools/powershell-demo";
import * as shellSim from "@/components/developer-tools/shell-simulators";
import * as uvBench from "@/components/developer-tools/uv-benchmark-lab";
import * as uvCmd from "@/components/developer-tools/uv-command-builder";
import * as uvTerm from "@/components/developer-tools/uv-terminal-simulator";

describe("Developer Tools simulator exports", () => {
  it("exports BashSimulator", () => {
    expect(typeof bashSim.BashSimulator).toBe("function");
  });

  it("exports GitGraphSimulator", () => {
    expect(typeof gitGraph.GitGraphSimulator).toBe("function");
  });

  it("exports LinuxCommandsExplorer", () => {
    expect(typeof linuxCmds.LinuxCommandsExplorer).toBe("function");
  });

  it("exports PowershellPipelineDemo", () => {
    expect(typeof psDemo.PowershellPipelineDemo).toBe("function");
  });

  it("exports ShellCliGuiComparison", () => {
    expect(typeof shellSim.ShellCliGuiComparison).toBe("function");
  });

  it("exports ShellPermissionsCalculator", () => {
    expect(typeof shellSim.ShellPermissionsCalculator).toBe("function");
  });

  it("exports UvBenchmarkLab", () => {
    expect(typeof uvBench.UvBenchmarkLab).toBe("function");
  });

  it("exports UvCommandBuilder", () => {
    expect(typeof uvCmd.UvCommandBuilder).toBe("function");
  });

  it("exports UvTerminalSimulator", () => {
    expect(typeof uvTerm.UvTerminalSimulator).toBe("function");
  });
});

// ── IT Support simulators ────────────────────────────────────────────────────
import * as binarySwitch from "@/components/it-support/binary-switchboard";
import * as circuit from "@/components/it-support/circuit-simulator";
import * as rgb from "@/components/it-support/rgb-mixer";

describe("IT Support simulator exports", () => {
  it("exports BinarySwitchboard", () => {
    expect(typeof binarySwitch.BinarySwitchboard).toBe("function");
  });

  it("exports CircuitSimulator", () => {
    expect(typeof circuit.CircuitSimulator).toBe("function");
  });

  it("exports RgbMixer", () => {
    expect(typeof rgb.RgbMixer).toBe("function");
  });
});

// ── CS101 components ─────────────────────────────────────────────────────────
import * as conceptCard from "@/components/cs101/concept-card";
import * as lessonBlocks from "@/components/cs101/lesson-blocks";
import * as moduleDiag from "@/components/cs101/module-diagram";
import * as oopSim from "@/components/cs101/oop-simulator";

describe("CS101 component exports", () => {
  it("exports ConceptCard", () => {
    expect(typeof conceptCard.ConceptCard).toBe("function");
  });

  it("exports all lesson block components", () => {
    expect(typeof lessonBlocks.LessonIntro).toBe("function");
    expect(typeof lessonBlocks.Concepts).toBe("function");
    expect(typeof lessonBlocks.AnalogyCard).toBe("function");
    expect(typeof lessonBlocks.LessonNote).toBe("function");
    expect(typeof lessonBlocks.Flashcard).toBe("function");
    expect(typeof lessonBlocks.QuickRecall).toBe("function");
    expect(typeof lessonBlocks.Explain).toBe("function");
    expect(typeof lessonBlocks.TryIt).toBe("function");
    expect(typeof lessonBlocks.Takeaway).toBe("function");
  });

  it("exports ModuleDiagram", () => {
    expect(typeof moduleDiag.ModuleDiagram).toBe("function");
  });

  it("exports OopSimulator", () => {
    expect(typeof oopSim.OopSimulator).toBe("function");
  });
});

// ── Intro to Programming ─────────────────────────────────────────────────────
import * as lessonDiag from "@/components/intro-to-programming/lesson-diagram";

describe("Intro to Programming component exports", () => {
  it("exports LessonDiagram", () => {
    expect(typeof lessonDiag.LessonDiagram).toBe("function");
  });
});

// ── Learn Python ─────────────────────────────────────────────────────────────
import * as pythonOop from "@/components/learn-python/python-oop-simulator";

describe("Learn Python component exports", () => {
  it("exports PythonOopSimulator", () => {
    expect(typeof pythonOop.PythonOopSimulator).toBe("function");
  });
});
