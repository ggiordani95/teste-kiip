import { afterEach, describe, expect, it, vi } from "vitest";
import { type ApiError, httpRequest } from "@/lib/http-client";

describe("httpRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON for success responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ hello: "world" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const data = await httpRequest<{ hello: string }>("/api/test");

    expect(data).toEqual({ hello: "world" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
    expect((fetchMock.mock.calls[0]?.[1] as RequestInit).headers instanceof Headers).toBe(true);
    expect(
      ((fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers).has("Content-Type"),
    ).toBe(false);
  });

  it("returns undefined for 204", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    const data = await httpRequest<void>("/api/test", { method: "DELETE" });

    expect(data).toBeUndefined();
    expect(
      ((fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers).has("Content-Type"),
    ).toBe(false);
  });

  it("sets json content type when body is present", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await httpRequest("/api/test", {
      method: "POST",
      body: JSON.stringify({ title: "Issue" }),
    });

    expect(
      ((fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Headers).get("Content-Type"),
    ).toBe("application/json");
  });

  it("throws ApiError for non-2xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Bad request" }),
      }),
    );

    await expect(httpRequest("/api/test")).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: "ApiError",
        message: "Bad request",
        status: 400,
      }),
    );
  });
});
