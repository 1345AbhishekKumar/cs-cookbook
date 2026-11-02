/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT_DIR = process.cwd();

export interface ScriptConfig {
  name: string;
  file: string;
  timeout?: number;
}

// Configured list of scripts from the scripts/ directory to run as part of the unit test suite.
// Add any additional scripts here to include them in the test run.
const SCRIPTS: ScriptConfig[] = [
  {
    name: "validate-icons.mjs",
    file: path.join(ROOT_DIR, "scripts", "validate-icons.mjs"),
    timeout: 30_000,
  },
  {
    name: "validate-accordions.mjs",
    file: path.join(ROOT_DIR, "scripts", "validate-accordions.mjs"),
    timeout: 30_000,
  },
  {
    name: "validate-mermaid.mjs",
    file: path.join(ROOT_DIR, "scripts", "validate-mermaid.mjs"),
    timeout: 240_000, // Mermaid parsing across 900+ docs can take 1-2 minutes
  },
];

describe("Scripts Directory Test Suite", () => {
  for (const script of SCRIPTS) {
    it(
      `executes ${script.name} with exit code 0`,
      async () => {
        try {
          const { stdout, stderr } = await execFileAsync(
            process.execPath,
            [script.file],
            {
              cwd: ROOT_DIR,
              timeout: script.timeout ?? 60_000,
              env: { ...process.env, FORCE_COLOR: "0" },
            }
          );

          if (stderr && stderr.trim().length > 0) {
            console.warn(`[${script.name} stderr]:\n${stderr}`);
          }

          expect(stdout).toBeDefined();
        } catch (error: any) {
          const stdout = error.stdout ? `\nSTDOUT:\n${error.stdout}` : "";
          const stderr = error.stderr ? `\nSTDERR:\n${error.stderr}` : "";
          const message = error.message ? `\nMESSAGE:\n${error.message}` : "";
          throw new Error(
            `Script "${script.name}" failed with exit code ${error.code}.${message}${stdout}${stderr}`
          );
        }
      },
      script.timeout ?? 60_000
    );
  }
});
