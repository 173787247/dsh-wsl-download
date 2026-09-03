import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDownloadHints, format } from "../lib/download.js";

describe("buildDownloadHints", () => {
  it("covers modelscope and flash-next", () => {
    const all = buildDownloadHints("all");
    assert.ok(all.some((t) => /ModelScope/i.test(t)));
    assert.ok(all.some((t) => /Flash-Next/i.test(t)));
    assert.ok(all.some((t) => /does not fetch URLs/i.test(t)));
  });

  it("scopes topic=gguf", () => {
    const tips = buildDownloadHints("gguf");
    assert.ok(tips.some((t) => /GGUF/i.test(t)));
    assert.ok(!tips.some((t) => /ModelScope/i.test(t)));
  });
});

describe("format", () => {
  it("formats hint advice", () => {
    const text = format({ ok: true, action: "hint", advice: ["a tip"] });
    assert.match(text, /action=hint/);
    assert.match(text, /a tip/);
  });
});
