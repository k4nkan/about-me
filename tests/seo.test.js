import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pages = [
  ["index.html", "https://www.k4nkan.com/"],
  ["public/projects.html", "https://www.k4nkan.com/projects.html"],
  ["public/about.html", "https://www.k4nkan.com/about.html"],
  ["public/contact.html", "https://www.k4nkan.com/contact.html"]
];

test("各ページに固有のcanonicalとOGPを設定する", () => {
  for (const [path, url] of pages) {
    const html = readFileSync(path, "utf8");
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replaceAll(".", "\\.")}"`));
    assert.match(
      html,
      new RegExp(`<meta property="og:url" content="${url.replaceAll(".", "\\.")}"`)
    );
    assert.match(html, /<meta name="twitter:card" content="summary"/);
  }
});

test("サイトマップとrobots.txtに公開URLを記載する", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  const robots = readFileSync("public/robots.txt", "utf8");

  for (const [, url] of pages)
    assert.match(sitemap, new RegExp(`<loc>${url.replaceAll(".", "\\.")}</loc>`));
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Sitemap: https:\/\/www\.k4nkan\.com\/sitemap\.xml/);
});
