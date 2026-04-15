import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");
jest.mock("react-force-graph-2d", () => () => <div data-testid="genre-graph" />);

test("renders the music map shell", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ results: [] })
  });

  axios.get.mockResolvedValueOnce({
    data: {
      nodes: [{ id: "Music", family: "All", sample: { title: "Music", artist: "Various", query: "" } }],
      links: [],
      families: [],
      stats: { nodes: 1, links: 0, families: 0 }
    }
  });

  render(<App />);

  await waitFor(() => expect(screen.queryByText("Loading the catalog...")).not.toBeInTheDocument());

  expect(screen.getByText("Music Map")).toBeInTheDocument();
  expect(screen.getByLabelText("Find a genre")).toBeInTheDocument();
  expect(screen.getByTestId("genre-graph")).toBeInTheDocument();
});
