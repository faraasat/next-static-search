import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextStaticSearch } from "../src";

const page = (title: string, subs: Array<[string, string]>) => ({
  meta: { title },
  sub_results: subs.map(([t, url]) => ({
    title: t,
    url,
    excerpt: "an <mark>excerpt</mark>",
  })),
});

const mockPagefind = (pages: unknown[]) => {
  (window as never as { pagefind: unknown }).pagefind = {
    preload: () => Promise.resolve(),
    options: () => Promise.resolve(),
    search: () =>
      Promise.resolve({
        query: "q",
        results: pages.map((p) => ({ data: () => Promise.resolve(p) })),
      }),
  };
};

const input = async () =>
  (await screen.findAllByRole("combobox"))[0] as HTMLInputElement;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 404 } as Response));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete (window as never as { pagefind?: unknown }).pagefind;
});

describe("search box", () => {
  it("renders with the default placeholder", async () => {
    render(<NextStaticSearch />);
    expect(await screen.findAllByPlaceholderText(/Search this Site/i)).not.toHaveLength(0);
  });

  it("honours a custom placeholder", async () => {
    render(<NextStaticSearch placeholder="Find docs" />);
    expect(await screen.findAllByPlaceholderText("Find docs")).not.toHaveLength(0);
  });

  it("exposes combobox semantics", async () => {
    render(<NextStaticSearch />);
    const el = await input();
    expect(el).toHaveAttribute("aria-autocomplete", "list");
    expect(el).toHaveAttribute("aria-expanded", "false");
    expect(el).toHaveAccessibleName("Search");
  });

  it("accepts a custom aria label", async () => {
    render(<NextStaticSearch ariaLabel="Search the handbook" />);
    expect(await input()).toHaveAccessibleName("Search the handbook");
  });
});

describe("results", () => {
  beforeEach(() => mockPagefind([page("Guide", [["Getting started", "/server/app/docs.html"]])]));

  it("renders matches as a listbox", async () => {
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "guide");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: /Getting started/ })).toBeInTheDocument();
  });

  it("strips Next.js build paths off result links", async () => {
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "guide");
    const opt = await screen.findByRole("option", { name: /Getting started/ });
    expect(opt).toHaveAttribute("href", "/docs");
  });

  it("marks the input expanded once results exist", async () => {
    render(<NextStaticSearch debounce={0} />);
    const el = await input();
    await userEvent.type(el, "guide");
    await waitFor(() => expect(el).toHaveAttribute("aria-expanded", "true"));
  });

  it("groups sub-results under their page title", async () => {
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "guide");
    expect(await screen.findByText("Guide")).toBeInTheDocument();
  });

  it("caps results with maxResults", async () => {
    mockPagefind([
      page("A", [["one", "/a.html"]]),
      page("B", [["two", "/b.html"]]),
      page("C", [["three", "/c.html"]]),
    ]);
    render(<NextStaticSearch debounce={0} maxResults={2} />);
    await userEvent.type(await input(), "x");
    await waitFor(async () =>
      expect(await screen.findAllByRole("option")).toHaveLength(2)
    );
  });

  it("filters out pages listed in pagesToIgnore", async () => {
    mockPagefind([page("404", [["Not found", "/404.html"]])]);
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "x");
    await waitFor(() => expect(screen.getByText(/No result found/i)).toBeInTheDocument());
  });

  it("surfaces the error message when the index is missing", async () => {
    // This describe's beforeEach installs a working pagefind; remove it so the
    // loader actually hits the missing-index path.
    delete (window as never as { pagefind?: unknown }).pagefind;
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "test");
    expect(await screen.findByRole("alert")).toHaveTextContent(/error loading the search result/i);
  });
});

describe("keyboard navigation", () => {
  beforeEach(() =>
    mockPagefind([
      page("Guide", [
        ["First", "/one.html"],
        ["Second", "/two.html"],
      ]),
    ])
  );

  it("highlights the first result automatically", async () => {
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "g");
    const options = await screen.findAllByRole("option");
    await waitFor(() => expect(options[0]).toHaveAttribute("aria-selected", "true"));
  });

  it("moves the highlight with ArrowDown", async () => {
    render(<NextStaticSearch debounce={0} />);
    const el = await input();
    await userEvent.type(el, "g");
    await screen.findAllByRole("option");
    await userEvent.keyboard("{ArrowDown}");
    const options = screen.getAllByRole("option");
    await waitFor(() => expect(options[1]).toHaveAttribute("aria-selected", "true"));
  });

  it("wraps around with ArrowUp from the first item", async () => {
    render(<NextStaticSearch debounce={0} />);
    await userEvent.type(await input(), "g");
    await screen.findAllByRole("option");
    await userEvent.keyboard("{ArrowUp}");
    const options = screen.getAllByRole("option");
    await waitFor(() => expect(options[1]).toHaveAttribute("aria-selected", "true"));
  });

  it("points aria-activedescendant at the highlighted option", async () => {
    render(<NextStaticSearch debounce={0} />);
    const el = await input();
    await userEvent.type(el, "g");
    const options = await screen.findAllByRole("option");
    await waitFor(() =>
      expect(el.getAttribute("aria-activedescendant")).toBe(options[0].id)
    );
  });

  it("calls onSelect when Enter is pressed", async () => {
    const onSelect = vi.fn();
    render(<NextStaticSearch debounce={0} onSelect={onSelect} />);
    await userEvent.type(await input(), "g");
    await screen.findAllByRole("option");
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: "First", url: "/one" })
    ));
  });
});

describe("debounce", () => {
  it("issues one query for a burst of keystrokes", async () => {
    const search = vi.fn().mockResolvedValue({ query: "q", results: [] });
    (window as never as { pagefind: unknown }).pagefind = {
      preload: () => Promise.resolve(),
      options: () => Promise.resolve(),
      search,
    };
    render(<NextStaticSearch debounce={50} />);
    await userEvent.type(await input(), "hello");
    await waitFor(() => expect(search).toHaveBeenCalled());
    expect(search.mock.calls.length).toBeLessThan(5);
  });
});
