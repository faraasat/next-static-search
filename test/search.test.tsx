import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextStaticSearch } from "../src";

const result = (title: string, subTitle: string) => ({
  meta: { title },
  sub_results: [{ title: subTitle, url: "/server/app/docs.html", excerpt: "an <mark>excerpt</mark>" }],
});

describe("NextStaticSearch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 404 } as Response));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (window as any).pagefind;
  });

  it("renders the search input with the default placeholder", async () => {
    render(<NextStaticSearch />);
    expect(await screen.findAllByPlaceholderText(/Search this Site/i)).not.toHaveLength(0);
  });

  it("honours a custom placeholder", async () => {
    render(<NextStaticSearch placeholder="Find docs" />);
    expect(await screen.findAllByPlaceholderText("Find docs")).not.toHaveLength(0);
  });

  it("surfaces the error message when the pagefind bundle is absent", async () => {
    render(<NextStaticSearch />);
    const input = (await screen.findAllByPlaceholderText(/Search this Site/i))[0];
    await userEvent.type(input, "test");
    expect(await screen.findByText(/error loading the search result/i)).toBeInTheDocument();
  });

  it("renders matching results returned by pagefind", async () => {
    (window as any).pagefind = {
      preload: () => Promise.resolve(),
      search: () => Promise.resolve({ query: "guide", results: [{ data: () => Promise.resolve(result("Guide", "Getting started")) }] }),
    };
    render(<NextStaticSearch />);
    const input = (await screen.findAllByPlaceholderText(/Search this Site/i))[0];
    await userEvent.type(input, "guide");
    expect(await screen.findByText("Getting started")).toBeInTheDocument();
  });

  it("strips Next.js build paths off result links", async () => {
    (window as any).pagefind = {
      preload: () => Promise.resolve(),
      search: () => Promise.resolve({ query: "guide", results: [{ data: () => Promise.resolve(result("Guide", "Getting started")) }] }),
    };
    render(<NextStaticSearch />);
    const input = (await screen.findAllByPlaceholderText(/Search this Site/i))[0];
    await userEvent.type(input, "guide");
    const link = await screen.findByRole("link", { name: /Getting started/ });
    expect(link.getAttribute("href")).toBe("/docs");
  });

  it("filters out pages listed in pagesToIgnore", async () => {
    (window as any).pagefind = {
      preload: () => Promise.resolve(),
      search: () => Promise.resolve({ query: "x", results: [{ data: () => Promise.resolve(result("404", "Not found")) }] }),
    };
    render(<NextStaticSearch />);
    const input = (await screen.findAllByPlaceholderText(/Search this Site/i))[0];
    await userEvent.type(input, "x");
    await waitFor(() => expect(screen.getByText(/No result found/i)).toBeInTheDocument());
  });
});
