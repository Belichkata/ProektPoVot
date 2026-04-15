const assert = require("node:assert/strict");
const { createGenreGraph } = require("../genreCatalog");

const graph = createGenreGraph();
const genresOnly = graph.nodes.filter((node) => node.id !== "Music");
const ids = new Set(graph.nodes.map((node) => node.id));

assert.ok(genresOnly.length >= 300, "catalog should contain at least 300 genres");
assert.equal(graph.nodes.length, graph.stats.nodes, "node stats should match");
assert.equal(graph.links.length, graph.stats.links, "link stats should match");
assert.equal(
  graph.nodes.filter((node) => node.sample?.title && node.sample?.artist && node.sample?.query).length,
  graph.nodes.length,
  "each node should have sample metadata"
);

graph.links.forEach((link) => {
  assert.ok(ids.has(link.source), `missing source ${link.source}`);
  assert.ok(ids.has(link.target), `missing target ${link.target}`);
});

console.log(`Backend catalog tests passed: ${genresOnly.length} genres, ${graph.links.length} links.`);
