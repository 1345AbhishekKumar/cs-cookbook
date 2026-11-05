import { describe, it, expect } from "vitest";
import { COMMON_ICON_ALIASES } from "@/lib/icon-aliases";

describe("Validation Scripts Parsing Logic", () => {
  describe("scripts/verify-python-questions rules", () => {
    function verifyPythonContent(content: string) {
      const errors: string[] = [];
      if (/<Accordion\s+title=["']Question/i.test(content)) {
        errors.push('Contains <Accordion title="Question..."');
      }

      const lines = content.split(/\r?\n/);
      let depth = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/<Accordion[\s>]/i.test(line) && !/<\/Accordion>/i.test(line)) {
          depth++;
          if (depth > 1) {
            errors.push(`Nested Accordion at line ${i + 1}`);
            break;
          }
        }
        if (/<\/Accordion>/i.test(line)) {
          depth = Math.max(0, depth - 1);
        }
      }
      return errors;
    }

    it("passes for compliant MDX with single-depth Accordions", () => {
      const valid = `
<Accordions>
  <Accordion title="Self Check 1">Answer 1</Accordion>
  <Accordion title="Self Check 2">Answer 2</Accordion>
</Accordions>
`;
      expect(verifyPythonContent(valid)).toEqual([]);
    });

    it("flags illegal Accordion title='Question 1'", () => {
      const invalid = `
<Accordions>
  <Accordion title="Question 1">Answer</Accordion>
</Accordions>
`;
      const errors = verifyPythonContent(invalid);
      expect(errors).toContain('Contains <Accordion title="Question..."');
    });

    it("flags nested Accordions inside each other", () => {
      const nested = `
<Accordion title="Outer">
  <Accordion title="Inner">
    Deep answer
  </Accordion>
</Accordion>
`;
      const errors = verifyPythonContent(nested);
      expect(errors.some((e) => e.includes("Nested Accordion"))).toBe(true);
    });
  });

  describe("scripts/validate-icons aliases matching", () => {
    it("maps legacy Lucide icon names to canonical names", () => {
      expect(COMMON_ICON_ALIASES["AlertCircle"]).toBe("CircleAlert");
      expect(COMMON_ICON_ALIASES["CheckCircle"]).toBe("CircleCheck");
      expect(COMMON_ICON_ALIASES["HelpCircle"]).toBe("CircleHelp");
      expect(COMMON_ICON_ALIASES["Sliders"]).toBe("SlidersHorizontal");
    });
  });
});
