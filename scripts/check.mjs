import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { publications, experience, education } from "../data/portfolio.mjs";
const pages = [
  "index.html",
  "about.html",
  "projects.html",
  "publications.html",
  "demo.html",
];
const html = Object.fromEntries(
  await Promise.all(
    pages.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);
let localLinks = 0;
for (const [file, content] of Object.entries(html)) {
  assert.equal(
    (content.match(/<h1[ >]/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  let previousHeading = 0;
  for (const match of content.matchAll(/<h([1-6])(?:\s|>)/g)) {
    const level = Number(match[1]);
    assert(
      level <= previousHeading + 1,
      `${file}: heading skips H${previousHeading} to H${level}`,
    );
    previousHeading = level;
  }
  assert(
    !/M\.S\. Research Student|M2SLAM\.pdf|\/Users\/|Submission no\.|CONFIDENTIAL|TCSVT/.test(
      content,
    ),
    `${file}: stale or private content`,
  );
  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
  for (const match of content.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (/^(https?:|mailto:)/.test(url)) continue;
    const [path, hash] = url.split("#");
    const target = path.split("?")[0] || file;
    await access(target);
    localLinks++;
    if (hash && html[target])
      assert(
        html[target].includes(`id="${hash}"`),
        `${file}: broken anchor ${url}`,
      );
  }
  for (const match of content.matchAll(/<img\b[^>]*>/g))
    assert(/alt="[^"]+"/.test(match[0]), `${file}: nonempty image alt`);
}
assert(html["index.html"].includes('aria-describedby="scene-description"'));
assert(
  html["index.html"].includes('id="scene-description" class="visually-hidden"'),
);
assert.deepEqual(
  experience.slice(0, 3).map((e) => [e.organization, e.role, e.date]),
  [
    ["KETI", "Researcher", "Sep. 2026 – Present"],
    ["StradVision", "Researcher", "Jul. 2026 – Jul. 2026"],
    ["MotifDrive", "Researcher", "May 2026 – Jul. 2026"],
  ],
);
assert.equal(education[0].date, "Mar. 2024 – Feb. 2026");
assert.equal(education[0].description, "Advisor: Prof. Soohwan Song");
for (const id of ["m2depth", "m2slam"]) {
  const p = publications.find((p) => p.id === id);
  assert.equal(p.status, "Under Review");
  assert.equal(p.role, "First Author");
  assert(
    html["publications.html"].indexOf(`id="${id}"`) >
      html["publications.html"].indexOf('id="under-review"'),
  );
}
assert.equal(publications.find((p) => p.id === "m2slam").links.length, 0);
console.log(
  `Passed: ${pages.length} pages, ${localLinks} HTML local links/assets, anchors, heading order, nonempty image alternatives, required facts, publication separation, and public-content checks. External URLs, JS-loaded resources and description quality require separate verification.`,
);
