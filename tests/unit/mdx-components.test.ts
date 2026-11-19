import { describe, it, expect } from "vitest";
import { getMDXComponents, useMDXComponents } from "@/components/mdx";

describe("components/mdx — getMDXComponents()", () => {
  it("should return an object of MDX components", () => {
    const components = getMDXComponents();
    expect(typeof components).toBe("object");
    expect(components).not.toBeNull();
  });

  it("should include standard layout components", () => {
    const c = getMDXComponents();
    expect(c.Tab).toBeDefined();
    expect(c.Tabs).toBeDefined();
    expect(c.Step).toBeDefined();
    expect(c.Steps).toBeDefined();
    expect(c.Card).toBeDefined();
    expect(c.Cards).toBeDefined();
    expect(c.Accordion).toBeDefined();
    expect(c.Accordions).toBeDefined();
    expect(c.File).toBeDefined();
    expect(c.Folder).toBeDefined();
    expect(c.Files).toBeDefined();
    expect(c.TypeTable).toBeDefined();
  });

  it("should include custom pedagogical components", () => {
    const c = getMDXComponents();
    expect(c.ConceptCard).toBeDefined();
    expect(c.ModuleOverview).toBeDefined();
    expect(c.LessonIntro).toBeDefined();
    expect(c.Concepts).toBeDefined();
    expect(c.AnalogyCard).toBeDefined();
    expect(c.LessonNote).toBeDefined();
    expect(c.Flashcard).toBeDefined();
    expect(c.QuickRecall).toBeDefined();
    expect(c.Explain).toBeDefined();
    expect(c.TryIt).toBeDefined();
    expect(c.Takeaway).toBeDefined();
  });

  it("should include DSA simulators", () => {
    const c = getMDXComponents();
    // Sorting
    expect(c.BubbleSortSimulator).toBeDefined();
    expect(c.SelectionSortSimulator).toBeDefined();
    expect(c.InsertionSortSimulator).toBeDefined();
    expect(c.MergeSortSimulator).toBeDefined();
    expect(c.QuickSortSimulator).toBeDefined();
    expect(c.HeapSortSimulator).toBeDefined();
    expect(c.SortingSimulator).toBeDefined();
    // Searching
    expect(c.LinearSearchSimulator).toBeDefined();
    expect(c.BinarySearchSimulator).toBeDefined();
    expect(c.JumpSearchSimulator).toBeDefined();
    expect(c.InterpolationSearchSimulator).toBeDefined();
    expect(c.ExponentialSearchSimulator).toBeDefined();
    expect(c.SearchSimulator).toBeDefined();
    // Memory
    expect(c.ArrayMemorySimulator).toBeDefined();
    expect(c.LinkedListSimulator).toBeDefined();
    expect(c.StackSimulator).toBeDefined();
    expect(c.QueueSimulator).toBeDefined();
    expect(c.HeapStructureSimulator).toBeDefined();
    expect(c.HashLookupSimulator).toBeDefined();
    expect(c.MemorySimulator).toBeDefined();
  });

  it("should include networking and developer tool simulators", () => {
    const c = getMDXComponents();
    expect(c.PortInspector).toBeDefined();
    expect(c.CidrCalculator).toBeDefined();
    expect(c.FirewallSimulator).toBeDefined();
    expect(c.NatTranslator).toBeDefined();
    expect(c.K8sServiceSimulator).toBeDefined();
    expect(c.PacketJourneyFlow).toBeDefined();
    expect(c.GitGraphSimulator).toBeDefined();
    expect(c.BashSimulator).toBeDefined();
    expect(c.PowershellPipelineDemo).toBeDefined();
    expect(c.LinuxCommandsExplorer).toBeDefined();
  });

  it("should include API design simulators", () => {
    const c = getMDXComponents();
    expect(c.ApiRequestLifecycleDemo).toBeDefined();
    expect(c.ApiTypesExplorer).toBeDefined();
    expect(c.RestBookPlayground).toBeDefined();
    expect(c.GraphqlOverfetchingDemo).toBeDefined();
    expect(c.GrpcStreamingDemo).toBeDefined();
    expect(c.ApiArchitectureChooser).toBeDefined();
    expect(c.ApiKeySecuritySimulator).toBeDefined();
  });

  it("should include GitHub Actions simulators", () => {
    const c = getMDXComponents();
    expect(c.WorkflowLifecycleSimulator).toBeDefined();
    expect(c.MatrixRunnerSimulator).toBeDefined();
    expect(c.SecretsAndEnvSimulator).toBeDefined();
    expect(c.ActionAuthoringChooser).toBeDefined();
  });

  it("should allow overriding components via the argument", () => {
    const Custom = () => null;
    const c = getMDXComponents({ Tab: Custom as any });
    expect(c.Tab).toBe(Custom);
  });

  it("should render script tags as null (suppressed)", () => {
    const c = getMDXComponents();
    const ScriptComponent = c.script as any;
    expect(ScriptComponent()).toBeNull();
  });

  it("should route local image paths through the jsDelivr CDN", () => {
    const c = getMDXComponents();
    const ImgComponent = c.img as any;

    // Test /images/ path
    const element1 = ImgComponent({
      src: "/images/concepts/how-ai-agents-work.png",
      alt: "AI Agents",
    });
    expect(element1.props.src).toBe(
      "https://cdn.jsdelivr.net/gh/1345AbhishekKumar/images@main/CS-cookbook/images/concepts/how-ai-agents-work.png"
    );

    // Test /diagrams/ path
    const element2 = ImgComponent({
      src: "/diagrams/git/commit.png",
      alt: "Git",
    });
    expect(element2.props.src).toBe(
      "https://cdn.jsdelivr.net/gh/1345AbhishekKumar/images@main/CS-cookbook/diagrams/git/commit.png"
    );

    // Test object src
    const element3 = ImgComponent({
      src: { src: "/images/cs101/silicon-wafer.jpg" },
      alt: "Wafer",
    });
    expect(element3.props.src).toBe(
      "https://cdn.jsdelivr.net/gh/1345AbhishekKumar/images@main/CS-cookbook/images/cs101/silicon-wafer.jpg"
    );

    // Test external URL remains untouched
    const externalUrl = "https://commons.wikimedia.org/wiki/File:Example.jpg";
    const element4 = ImgComponent({ src: externalUrl, alt: "External" });
    expect(element4.props.src).toBe(externalUrl);
  });
});

describe("components/mdx — useMDXComponents", () => {
  it("should be the same function as getMDXComponents", () => {
    expect(useMDXComponents).toBe(getMDXComponents);
  });
});
