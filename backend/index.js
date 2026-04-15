const cors = require("cors");
const express = require("express");
const { createGenreGraph } = require("./genreCatalog");

const app = express();
const port = process.env.PORT || 5000;
const graph = createGenreGraph();
const startedAt = Date.now();
const metrics = {
  requestsTotal: 0,
  requestsByRoute: new Map(),
  requestDurationMsTotal: 0
};

app.use(cors());
app.use((req, res, next) => {
  const started = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - started;
    const route = `${req.method} ${req.route?.path || req.path}`;
    metrics.requestsTotal += 1;
    metrics.requestDurationMsTotal += duration;
    metrics.requestsByRoute.set(route, (metrics.requestsByRoute.get(route) || 0) + 1);

    console.log(
      JSON.stringify({
        level: res.statusCode >= 500 ? "error" : "info",
        message: "http_request",
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: duration
      })
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    name: "Music Map API",
    endpoints: ["/genres", "/health", "/metrics"],
    stats: graph.stats
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, stats: graph.stats });
});

app.get("/genres", (req, res) => {
  res.json(graph);
});

app.get("/metrics", (req, res) => {
  const uptimeSeconds = Math.round((Date.now() - startedAt) / 1000);
  const averageDuration =
    metrics.requestsTotal === 0 ? 0 : metrics.requestDurationMsTotal / metrics.requestsTotal;
  const routeLines = [...metrics.requestsByRoute.entries()]
    .map(([route, count]) => {
      const safeRoute = route.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `music_map_http_requests_by_route_total{route="${safeRoute}"} ${count}`;
    })
    .join("\n");

  res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(`# HELP music_map_info Static application info
# TYPE music_map_info gauge
music_map_info{service="backend"} 1
# HELP music_map_uptime_seconds Process uptime in seconds
# TYPE music_map_uptime_seconds gauge
music_map_uptime_seconds ${uptimeSeconds}
# HELP music_map_genres_total Number of graph nodes
# TYPE music_map_genres_total gauge
music_map_genres_total ${graph.stats.nodes}
# HELP music_map_links_total Number of graph links
# TYPE music_map_links_total gauge
music_map_links_total ${graph.stats.links}
# HELP music_map_http_requests_total Total HTTP requests
# TYPE music_map_http_requests_total counter
music_map_http_requests_total ${metrics.requestsTotal}
# HELP music_map_http_request_duration_ms_average Average request duration in milliseconds
# TYPE music_map_http_request_duration_ms_average gauge
music_map_http_request_duration_ms_average ${averageDuration.toFixed(2)}
# HELP music_map_http_requests_by_route_total Total HTTP requests by route
# TYPE music_map_http_requests_by_route_total counter
${routeLines}
`);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(JSON.stringify({ level: "info", message: "server_started", port }));
  });
}

module.exports = app;
