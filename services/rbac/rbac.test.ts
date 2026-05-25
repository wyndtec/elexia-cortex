/**
 * Testes unitários para o RBAC middleware.
 * Runner: Bun test  →  bun test rbac.test.ts
 */
import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { createRbacMiddleware, hasPermission, ROLES, resolvePermissions } from "./middleware";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeJwt(role: string): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "user-test", role }));
  return `${header}.${payload}.fakesig`;
}

function authHeader(role: string): { Authorization: string } {
  return { Authorization: `Bearer ${makeJwt(role)}` };
}

// ---------------------------------------------------------------------------
// resolvePermissions — herança
// ---------------------------------------------------------------------------

describe("resolvePermissions", () => {
  it("viewer tem apenas permissões básicas de leitura", () => {
    const perms = resolvePermissions("viewer");
    expect(perms).toContain("dashboards:read");
    expect(perms).toContain("reports:read");
    expect(perms).not.toContain("queries:write");
    expect(perms).not.toContain("*");
  });

  it("analyst herda permissões de viewer", () => {
    const perms = resolvePermissions("analyst");
    expect(perms).toContain("dashboards:read"); // herdado de viewer
    expect(perms).toContain("queries:write");   // próprio
  });

  it("manager herda de analyst e viewer", () => {
    const perms = resolvePermissions("manager");
    expect(perms).toContain("dashboards:read");  // viewer
    expect(perms).toContain("queries:write");    // analyst
    expect(perms).toContain("connectors:read");  // manager
  });

  it("admin herda de toda a cadeia", () => {
    const perms = resolvePermissions("admin");
    expect(perms).toContain("dashboards:read");         // viewer
    expect(perms).toContain("queries:write");           // analyst
    expect(perms).toContain("connectors:read");         // manager
    expect(perms).toContain("tokenization:detokenize"); // admin
    expect(perms).not.toContain("*");
  });

  it("owner tem '*' e herda toda a cadeia", () => {
    const perms = resolvePermissions("owner");
    expect(perms).toContain("*");
    expect(perms).toContain("dashboards:read"); // viewer (herdado)
  });

  it("role inválida retorna array vazio", () => {
    expect(resolvePermissions("superuser")).toEqual([]);
    expect(resolvePermissions("")).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// hasPermission
// ---------------------------------------------------------------------------

describe("hasPermission", () => {
  it("viewer NÃO pode fazer queries:write", () => {
    expect(hasPermission("viewer", "queries:write")).toBe(false);
  });

  it("analyst PODE fazer queries:write", () => {
    expect(hasPermission("analyst", "queries:write")).toBe(true);
  });

  it("manager PODE fazer queries:write (herdado de analyst)", () => {
    expect(hasPermission("manager", "queries:write")).toBe(true);
  });

  it("admin PODE fazer tokenization:detokenize", () => {
    expect(hasPermission("admin", "tokenization:detokenize")).toBe(true);
  });

  it("viewer NÃO pode fazer tokenization:detokenize", () => {
    expect(hasPermission("viewer", "tokenization:detokenize")).toBe(false);
  });

  it("owner PODE qualquer permissão via wildcard", () => {
    expect(hasPermission("owner", "tokenization:detokenize")).toBe(true);
    expect(hasPermission("owner", "vault:write")).toBe(true);
    expect(hasPermission("owner", "qualquer:permissao")).toBe(true);
  });

  it("role inválida NÃO tem nenhuma permissão", () => {
    expect(hasPermission("hacker", "dashboards:read")).toBe(false);
    expect(hasPermission("", "dashboards:read")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createRbacMiddleware — integração com Hono
// ---------------------------------------------------------------------------

describe("createRbacMiddleware", () => {
  function buildApp(requiredPermission: string) {
    const app = new Hono();
    app.get("/protected", createRbacMiddleware(requiredPermission), (c) =>
      c.json({ ok: true, role: c.get("userRole") }),
    );
    return app;
  }

  it("retorna 401 sem Authorization header", async () => {
    const app = buildApp("queries:write");
    const res = await app.request("/protected");
    expect(res.status).toBe(401);
  });

  it("retorna 401 com token malformado", async () => {
    const app = buildApp("queries:write");
    const res = await app.request("/protected", {
      headers: { Authorization: "Bearer notavalidjwt" },
    });
    expect(res.status).toBe(401);
  });

  it("viewer recebe 403 para queries:write", async () => {
    const app = buildApp("queries:write");
    const res = await app.request("/protected", { headers: authHeader("viewer") });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.required).toBe("queries:write");
    expect(body.role).toBe("viewer");
  });

  it("analyst recebe 200 para queries:write", async () => {
    const app = buildApp("queries:write");
    const res = await app.request("/protected", { headers: authHeader("analyst") });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.role).toBe("analyst");
  });

  it("manager recebe 200 para queries:write (herdado de analyst)", async () => {
    const app = buildApp("queries:write");
    const res = await app.request("/protected", { headers: authHeader("manager") });
    expect(res.status).toBe(200);
  });

  it("admin recebe 200 para tokenization:detokenize", async () => {
    const app = buildApp("tokenization:detokenize");
    const res = await app.request("/protected", { headers: authHeader("admin") });
    expect(res.status).toBe(200);
  });

  it("owner recebe 200 para qualquer permissão via wildcard", async () => {
    const app = buildApp("qualquer:permissao:inventada");
    const res = await app.request("/protected", { headers: authHeader("owner") });
    expect(res.status).toBe(200);
  });

  it("role inválida recebe 403", async () => {
    const app = buildApp("dashboards:read");
    const res = await app.request("/protected", { headers: authHeader("hacker") });
    expect(res.status).toBe(403);
  });
});
