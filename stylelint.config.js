module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen", "mixin", "include"]
      }
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["font-named-instance"]
      }
    ],
    "declaration-colon-newline-after": null,
    "value-list-comma-newline-after": null,
    "no-invalid-position-at-import-rule": null,
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "selector-no-qualifying-type": null
  }
};
