import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import axios from "axios";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getNodeId = (node) => (typeof node === "object" ? node.id : node);

const formatCount = (value) => new Intl.NumberFormat("en").format(value || 0);

function App() {
  const graphRef = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [], families: [], stats: null });
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("All");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState({ state: "idle" });
  const [size, setSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let alive = true;

    axios
      .get(`${API_BASE}/genres`)
      .then((response) => {
        if (!alive) {
          return;
        }

        setGraphData(response.data);
        setSelected(response.data.nodes.find((node) => node.id === "Music") || null);
        setStatus("ready");
        setError("");
        setTimeout(() => graphRef.current?.zoomToFit(650, 64), 250);
      })
      .catch(() => {
        if (!alive) {
          return;
        }

        setStatus("error");
        setError("Start the backend on port 5000, then refresh the map.");
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selected?.sample?.query) {
      setPreview({ state: "idle" });
      return;
    }

    const controller = new AbortController();
    const url = `https://itunes.apple.com/search?media=music&entity=song&limit=1&term=${encodeURIComponent(
      selected.sample.query
    )}`;

    setPreview({ state: "loading" });

    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!data?.results?.length) {
          setPreview({
            state: "missing",
            message: "No public preview was returned for this pick."
          });
          return;
        }

        const result = data.results[0];
        setPreview({
          state: "ready",
          title: result.trackName,
          artist: result.artistName,
          album: result.collectionName,
          previewUrl: result.previewUrl,
          artwork:
            result.artworkUrl100?.replace("100x100bb", "400x400bb") ||
            result.artworkUrl100,
          url: result.trackViewUrl
        });
      })
      .catch((fetchError) => {
        if (fetchError.name === "AbortError") {
          return;
        }

        setPreview({
          state: "missing",
          message: "Preview lookup is unavailable right now."
        });
      });

    return () => controller.abort();
  }, [selected]);

  const familyOptions = useMemo(() => graphData.families || [], [graphData.families]);
  const query = search.trim().toLowerCase();

  const visibleGraph = useMemo(() => {
    if (family === "All") {
      return graphData;
    }

    const visibleIds = new Set(
      graphData.nodes
        .filter((node) => node.id === "Music" || node.family === family || node.id === family)
        .map((node) => node.id)
    );

    return {
      ...graphData,
      nodes: graphData.nodes.filter((node) => visibleIds.has(node.id)),
      links: graphData.links.filter((link) => {
        const source = getNodeId(link.source);
        const target = getNodeId(link.target);
        return visibleIds.has(source) && visibleIds.has(target);
      })
    };
  }, [family, graphData]);

  const searchMatches = useMemo(() => {
    if (!query) {
      return new Set();
    }

    return new Set(
      visibleGraph.nodes
        .filter((node) => {
          const haystack = `${node.id} ${node.family} ${node.parent}`.toLowerCase();
          return haystack.includes(query);
        })
        .map((node) => node.id)
    );
  }, [query, visibleGraph.nodes]);

  const searchResults = useMemo(() => {
    if (!query) {
      return [];
    }

    return visibleGraph.nodes
      .filter((node) => searchMatches.has(node.id))
      .sort((a, b) => a.id.localeCompare(b.id))
      .slice(0, 10);
  }, [query, searchMatches, visibleGraph.nodes]);

  const selectedNeighbors = useMemo(() => {
    if (!selected) {
      return [];
    }

    const neighbors = new Set();
    graphData.links.forEach((link) => {
      const source = getNodeId(link.source);
      const target = getNodeId(link.target);

      if (source === selected.id) {
        neighbors.add(target);
      }

      if (target === selected.id) {
        neighbors.add(source);
      }
    });

    return [...neighbors].sort((a, b) => a.localeCompare(b));
  }, [graphData.links, selected]);

  const activeIds = useMemo(() => {
    const ids = new Set(searchMatches);

    if (selected) {
      ids.add(selected.id);
      selectedNeighbors.forEach((neighbor) => ids.add(neighbor));
    }

    if (hovered) {
      ids.add(hovered.id);
    }

    return ids;
  }, [hovered, searchMatches, selected, selectedNeighbors]);

  const selectNode = useCallback((node) => {
    setSelected(node);
    setFamily((currentFamily) => (currentFamily === "All" ? currentFamily : node.family || currentFamily));

    if (node.x && node.y) {
      graphRef.current?.centerAt(node.x, node.y, 650);
      graphRef.current?.zoom(3.1, 650);
    }
  }, []);

  const jumpToNode = useCallback(
    (node) => {
      setSearch(node.id);
      selectNode(node);
    },
    [selectNode]
  );

  const resetView = useCallback(() => {
    setSelected(null);
    setHovered(null);
    graphRef.current?.zoomToFit(650, 72);
  }, []);

  const drawNode = useCallback(
    (node, ctx, globalScale) => {
      const isRoot = node.id === "Music";
      const isSelected = selected?.id === node.id;
      const isHovered = hovered?.id === node.id;
      const isSearchMatch = searchMatches.has(node.id);
      const isActive = activeIds.has(node.id);
      const radius = isRoot ? 12 : node.level === 1 ? 8 : node.level === 2 ? 5.5 : 3.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = node.color || "#2de2c2";
      ctx.globalAlpha = activeIds.size && !isActive ? 0.24 : 0.95;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (isSelected || isHovered || isSearchMatch || isRoot) {
        ctx.lineWidth = isSelected ? 3.2 : 1.8;
        ctx.strokeStyle = isSelected ? "#f7f4ea" : "#f2d94e";
        ctx.stroke();
      }

      const shouldShowLabel =
        isRoot || node.level <= 1 || isSelected || isHovered || isSearchMatch || globalScale > 1.15;

      if (!shouldShowLabel) {
        return;
      }

      const label = node.id;
      const fontSize = Math.max(3.5, 12 / globalScale);
      const textWidth = ctx.measureText(label).width;
      const padding = 2.8 / globalScale;

      ctx.font = `${fontSize}px Inter, Segoe UI, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(8, 9, 9, 0.78)";
      ctx.fillRect(
        node.x - textWidth / 2 - padding,
        node.y + radius + padding,
        textWidth + padding * 2,
        fontSize + padding * 2
      );
      ctx.fillStyle = "#f7f4ea";
      ctx.fillText(label, node.x, node.y + radius + fontSize / 2 + padding);
    },
    [activeIds, hovered, searchMatches, selected]
  );

  const nodePointerPaint = useCallback((node, color, ctx) => {
    const radius = node.level === 1 ? 10 : node.level === 2 ? 8 : 6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }, []);

  const linkIsActive = useCallback(
    (link) => {
      if (!selected) {
        return false;
      }

      const source = getNodeId(link.source);
      const target = getNodeId(link.target);
      return source === selected.id || target === selected.id;
    },
    [selected]
  );

  const stats = graphData.stats || {
    nodes: graphData.nodes.length,
    links: graphData.links.length,
    families: familyOptions.length
  };

  return (
    <main className="app-shell">
      <section className="graph-stage" aria-label="Music genre map">
        <ForceGraph2D
          ref={graphRef}
          graphData={visibleGraph}
          width={size.width}
          height={size.height}
          backgroundColor="#080909"
          cooldownTicks={140}
          d3AlphaDecay={0.025}
          d3VelocityDecay={0.32}
          nodeId="id"
          nodeVal={(node) => (node.level === 0 ? 14 : node.level === 1 ? 8 : node.level === 2 ? 4 : 1.8)}
          nodeLabel={(node) => `${node.id} - ${node.family}`}
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={nodePointerPaint}
          linkColor={(link) => (linkIsActive(link) ? "rgba(247, 244, 234, 0.82)" : "rgba(116, 126, 116, 0.28)")}
          linkWidth={(link) => (linkIsActive(link) ? 2 : 0.8)}
          linkDirectionalParticles={(link) => (linkIsActive(link) ? 3 : 0)}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.004}
          onNodeClick={selectNode}
          onNodeHover={setHovered}
          onBackgroundClick={resetView}
        />
      </section>

      <header className="topbar">
        <div>
          <p className="eyebrow">Interactive atlas</p>
          <h1>Music Map</h1>
        </div>
        <div className="topbar-stats" aria-label="Map totals">
          <span>{formatCount(Math.max(0, stats.nodes - 1))} genres</span>
          <span>{formatCount(stats.links)} links</span>
          <span>{formatCount(stats.families)} families</span>
        </div>
      </header>

      <aside className="control-panel" aria-label="Map controls">
        <label className="field-label" htmlFor="genre-search">
          Find a genre
        </label>
        <div className="search-row">
          <input
            id="genre-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try amapiano, shoegaze, salsa..."
          />
          {search && (
            <button className="icon-button" type="button" onClick={() => setSearch("")} aria-label="Clear search">
              Clear
            </button>
          )}
        </div>

        <label className="field-label" htmlFor="family-filter">
          Family
        </label>
        <select id="family-filter" value={family} onChange={(event) => setFamily(event.target.value)}>
          <option value="All">All families</option>
          {familyOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id}
            </option>
          ))}
        </select>

        <div className="control-actions">
          <button type="button" onClick={resetView}>
            Fit map
          </button>
          <button type="button" onClick={() => setFamily("All")}>
            All families
          </button>
        </div>

        {query && (
          <div className="result-list">
            <p className="mini-heading">{searchResults.length ? "Matches" : "No matches"}</p>
            {searchResults.map((node) => (
              <button key={node.id} type="button" onClick={() => jumpToNode(node)}>
                <span>{node.id}</span>
                <small>{node.family}</small>
              </button>
            ))}
          </div>
        )}

        {status === "loading" && <p className="panel-note">Loading the catalog...</p>}
        {status === "error" && <p className="panel-note error">{error}</p>}
      </aside>

      <aside className={`detail-panel ${selected ? "is-open" : ""}`} aria-label="Selected genre details">
        {selected ? (
          <>
            <div className="detail-header">
              <div>
                <p className="eyebrow">{selected.family}</p>
                <h2>{selected.id}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <p className="description">{selected.description}</p>

            <div className="meta-grid">
              <span>Parent: {selected.parent || "none"}</span>
              <span>Era: {selected.era}</span>
              <span>Links: {selectedNeighbors.length}</span>
            </div>

            <section className="sample-panel" aria-label="Music sample">
              <p className="mini-heading">Music sample</p>
              <h3>
                {selected.sample?.title} <span>by {selected.sample?.artist}</span>
              </h3>

              {preview.state === "loading" && <p className="panel-note">Finding a playable preview...</p>}

              {preview.state === "ready" && (
                <div className="preview">
                  {preview.artwork && <img src={preview.artwork} alt={`${preview.album || preview.title} cover`} />}
                  <div className="preview-copy">
                    <strong>{preview.title}</strong>
                    <span>{preview.artist}</span>
                    {preview.previewUrl && <audio controls src={preview.previewUrl} preload="none" />}
                    {preview.url && (
                      <a href={preview.url} target="_blank" rel="noreferrer">
                        Open track
                      </a>
                    )}
                  </div>
                </div>
              )}

              {preview.state === "missing" && (
                <p className="panel-note">{preview.message || "No preview is available for this pick."}</p>
              )}
            </section>

            <section className="neighbors" aria-label="Related genres">
              <p className="mini-heading">Nearby genres</p>
              <div>
                {selectedNeighbors.slice(0, 18).map((neighbor) => (
                  <button
                    key={neighbor}
                    type="button"
                    onClick={() => {
                      const node = graphData.nodes.find((item) => item.id === neighbor);
                      if (node) {
                        selectNode(node);
                      }
                    }}
                  >
                    {neighbor}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="empty-detail">
            <p className="eyebrow">Select a node</p>
            <h2>Choose a sound</h2>
            <p>Each genre opens with nearby styles and a playable preview when a public sample is available.</p>
          </div>
        )}
      </aside>

      <footer className="status-strip">
        <span>
          Showing {formatCount(visibleGraph.nodes.length)} of {formatCount(stats.nodes)} nodes
        </span>
        <span>{hovered ? hovered.id : selected ? selected.id : "Drag, zoom, or search"}</span>
      </footer>
    </main>
  );
}

export default App;
