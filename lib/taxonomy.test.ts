import { describe, expect, it } from "vitest";
import { getPositionSgLevel, parseInitialSection, parseInitialPosition } from "./taxonomy";

describe("getPositionSgLevel", () => {
  it("extracts SG level from standard prefixed positions", () => {
    expect(getPositionSgLevel("SG 24 - Chief Statistical Specialist")).toBe(24);
    expect(getPositionSgLevel("SG 19 - Senior Statistical Specialist")).toBe(19);
    expect(getPositionSgLevel("SG 4 - Administrative Aide IV")).toBe(4);
  });

  it("extracts SG level from custom positions using SG format", () => {
    expect(getPositionSgLevel("SG 15 - Custom Officer")).toBe(15);
    expect(getPositionSgLevel("SG 2 - Aide")).toBe(2);
  });

  it("extracts SG level when COSW asterisk suffix is present", () => {
    expect(getPositionSgLevel("SG 24 - Chief Statistical Specialist*")).toBe(24);
    expect(getPositionSgLevel("SG 9 - Assistant Statistician*")).toBe(9);
    expect(getPositionSgLevel("SG 15 - Custom Officer*")).toBe(15);
  });

  it("resolves SG level for prefix-stripped predefined designations", () => {
    expect(getPositionSgLevel("Chief Statistical Specialist")).toBe(24);
    expect(getPositionSgLevel("Administrative Aide IV")).toBe(4);
    expect(getPositionSgLevel("Supervising Statistical Specialist")).toBe(22);
    // handles typo spelling in comparison
    expect(getPositionSgLevel("Supervising Statistical Specilist")).toBe(22);
  });

  it("returns 0 for unrecognized custom designations", () => {
    expect(getPositionSgLevel("Director")).toBe(0);
    expect(getPositionSgLevel("External Consultant")).toBe(0);
    expect(getPositionSgLevel("")).toBe(0);
  });
});

describe("parseInitialSection", () => {
  it("resolves standard sections correctly", () => {
    expect(parseInitialSection("Statistical Operations")).toEqual({
      selectedSection: "Statistical Operations",
      customSectionText: "",
    });
    expect(parseInitialSection("Administrative and Accounting")).toEqual({
      selectedSection: "Administrative and Accounting",
      customSectionText: "",
    });
  });

  it("resolves custom sections to Custom option", () => {
    expect(parseInitialSection("Finance & Logistics")).toEqual({
      selectedSection: "Custom",
      customSectionText: "Finance & Logistics",
    });
  });

  it("handles null or undefined section input", () => {
    expect(parseInitialSection(null)).toEqual({
      selectedSection: "",
      customSectionText: "",
    });
    expect(parseInitialSection(undefined)).toEqual({
      selectedSection: "",
      customSectionText: "",
    });
  });
});

describe("parseInitialPosition", () => {
  it("resolves standard positions and COSW flag correctly", () => {
    expect(parseInitialPosition("SG 24 - Chief Statistical Specialist")).toEqual({
      isCosw: false,
      selectedPosition: "SG 24 - Chief Statistical Specialist",
      customPositionText: "",
    });
    expect(parseInitialPosition("SG 9 - Assistant Statistician*")).toEqual({
      isCosw: true,
      selectedPosition: "SG 9 - Assistant Statistician",
      customPositionText: "",
    });
  });

  it("resolves suffix matches when prefix is missing", () => {
    expect(parseInitialPosition("Chief Statistical Specialist")).toEqual({
      isCosw: false,
      selectedPosition: "SG 24 - Chief Statistical Specialist",
      customPositionText: "",
    });
    expect(parseInitialPosition("Assistant Statistician*")).toEqual({
      isCosw: true,
      selectedPosition: "SG 9 - Assistant Statistician",
      customPositionText: "",
    });
  });

  it("resolves custom positions correctly", () => {
    expect(parseInitialPosition("SG 15 - Officer")).toEqual({
      isCosw: false,
      selectedPosition: "Custom",
      customPositionText: "SG 15 - Officer",
    });
    expect(parseInitialPosition("Consultant*")).toEqual({
      isCosw: true,
      selectedPosition: "Custom",
      customPositionText: "Consultant",
    });
  });

  it("handles null or undefined position input", () => {
    expect(parseInitialPosition(null)).toEqual({
      isCosw: false,
      selectedPosition: "",
      customPositionText: "",
    });
    expect(parseInitialPosition(undefined)).toEqual({
      isCosw: false,
      selectedPosition: "",
      customPositionText: "",
    });
  });
});

