import { describe, it, expect, vi } from "vitest";
import React from "react";
import {
  customLucidePlugin,
  activeModule,
  isScopedModuleDev,
  moduleBaseUrl,
  source,
  docsLlms,
} from "@/lib/source";

describe("lib/source — customLucidePlugin", () => {
  it("has plugin name fumadocs:lucide-resolver", () => {
    expect(customLucidePlugin.name).toBe("fumadocs:lucide-resolver");
    expect(customLucidePlugin.transformPageTree).toBeDefined();
  });

  it("file transform transforms string icon name to React element", () => {
    const fileNode = {
      type: "page",
      name: "Binary Search",
      url: "/docs/dsa/searching/binary-search",
      icon: "Search",
    };

    const transformed = customLucidePlugin.transformPageTree.file(fileNode);
    expect(transformed).toBe(fileNode);
    expect(React.isValidElement(transformed.icon)).toBe(true);
  });

  it("file transform preserves node when icon is not a string", () => {
    const alreadyAnElement = React.createElement("span", {
      "data-testid": "custom-icon",
    });
    const nodeWithElement = { icon: alreadyAnElement };
    expect(
      customLucidePlugin.transformPageTree.file(nodeWithElement).icon
    ).toBe(alreadyAnElement);

    const nodeWithoutIcon = { name: "No Icon" };
    expect(
      customLucidePlugin.transformPageTree.file(nodeWithoutIcon).icon
    ).toBeUndefined();
  });

  it("folder transform transforms folder icon string", () => {
    const folderNode = {
      type: "folder",
      name: "01-beginner",
      icon: "Folder",
    };

    const transformed = customLucidePlugin.transformPageTree.folder(folderNode);
    expect(transformed).toBe(folderNode);
    expect(React.isValidElement(transformed.icon)).toBe(true);
  });

  it("separator transform transforms separator icon string", () => {
    const separatorNode = {
      type: "separator",
      name: "Core Fundamentals",
      icon: "Code",
    };

    const transformed =
      customLucidePlugin.transformPageTree.separator(separatorNode);
    expect(transformed).toBe(separatorNode);
    expect(React.isValidElement(transformed.icon)).toBe(true);
  });
});

describe("lib/source — moduleBaseUrl and scoped dev environment", () => {
  it("exports activeModule as string", () => {
    expect(typeof activeModule).toBe("string");
  });

  it("exports isScopedModuleDev as boolean", () => {
    expect(typeof isScopedModuleDev).toBe("boolean");
  });

  it("moduleBaseUrl starts with /docs", () => {
    expect(moduleBaseUrl.startsWith("/docs")).toBe(true);
  });

  it("source object is initialized and exports loader methods", () => {
    expect(source).toBeDefined();
    expect(typeof source.getPage).toBe("function");
    expect(typeof source.getPageTree).toBe("function");
    expect(typeof source.getPages).toBe("function");
  });

  it("docsLlms exports page and pages generator", () => {
    expect(docsLlms).toBeDefined();
    expect(typeof docsLlms.page).toBe("function");
  });
});
