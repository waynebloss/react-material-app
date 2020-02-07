// #region RULES to reduce bundle size, avoid circular imports and clutter:
//
// - ALL lib files should be self-contained or depend ONLY on files in lib.
// - DO NOT export lib files that are only used inside lib.
// - DO NOT export lib files that are optionally used in only one place.
// - ONLY export very commonly used libs from here. If something is only used
// in one spot in your entire app, then we can reduce clutter for others who
// want to just `import from "./lib"`. (This is not the most important rule.)
//
// Files not exported:
//
// export * from "./async";         // Only currently used in ./routing/.
//
// #endregion

export * from "./routing";
export * from "./AuthRequest";
export * from "./hooks";
export * from "./utils";
