import { describe, it, expect } from "vitest";

describe("Validation Scripts Logic", () => {
  describe("validate-accordions rule", () => {
    function findAccordionViolations(content: string) {
      const lines = content.split(/\r?\n/);
      let depth = 0;
      const violations: number[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const openAccordions = (line.match(/<Accordions(?=[\s>])/g) || [])
          .length;
        const selfClosingAccordions = (line.match(/<Accordions[^>]*\/>/g) || [])
          .length;
        const closeAccordions = (line.match(/<\/Accordions>/g) || []).length;

        depth += openAccordions - selfClosingAccordions - closeAccordions;

        const accordionMatches = line.match(/<Accordion(?=[\s>])/g);
        if (accordionMatches && accordionMatches.length > 0) {
          if (depth <= 0) {
            violations.push(i + 1);
          }
        }
      }
      return violations;
    }

    it("passes when <Accordion> is properly nested in <Accordions>", () => {
      const validMdx = `
<Accordions>
  <Accordion title="FAQ 1">Answer 1</Accordion>
  <Accordion title="FAQ 2">Answer 2</Accordion>
</Accordions>
`;
      expect(findAccordionViolations(validMdx)).toEqual([]);
    });

    it("flags standalone <Accordion> outside <Accordions>", () => {
      const invalidMdx = `
# Title

<Accordion title="Orphan">Orphan content</Accordion>
`;
      expect(findAccordionViolations(invalidMdx)).toEqual([4]);
    });
  });

  describe("validate-mermaid fence regex", () => {
    function extractMermaidBlocks(content: string): string[] {
      const regex = /^```mermaid\r?\n([\s\S]*?)\r?\n```/gm;
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        matches.push(match[1].trim());
      }
      return matches;
    }

    it("extracts all mermaid code fences from mdx text", () => {
      const mdx = `
# Chapter 1

\`\`\`mermaid
graph TD;
  A-->B;
\`\`\`

Some intermediate text.

\`\`\`mermaid
sequenceDiagram
  Alice->>Bob: Hello
\`\`\`
`;
      const blocks = extractMermaidBlocks(mdx);
      expect(blocks).toHaveLength(2);
      expect(blocks[0]).toContain("graph TD;");
      expect(blocks[1]).toContain("sequenceDiagram");
    });
  });
});
