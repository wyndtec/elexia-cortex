/**
 * RBAC Middleware para Hono.js
 * Resolve permissões via herança de roles e valida autorização por recurso.
 */
import type { Context, MiddlewareHandler } from "hono";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type RoleName = "owner" | "admin" | "manager" | "analyst" | "viewer";

interface RoleDefinition {
  inherits: RoleName | null;
  permissions: string[];
}

// ---------------------------------------------------------------------------
// Definição de roles (espelha permissions.yaml)
// ---------------------------------------------------------------------------

export const ROLES: Record<RoleName, RoleDefinition> = {
  viewer: {
    inherits: null,
    permissions: ["dashboards:read", "reports:read"],
  },
  analyst: {
    inherits: "viewer",
    permissions: ["queries:write", "queries:read", "reports:write", "reports:read", "dashboards:read"],
  },
  manager: {
    inherits: "analyst",
    permissions: [
      "reports:write",
      "dashboards:write",
      "connectors:read",
      "models:read",
      "customers:read",
      "segments:write",
    ],
  },
  admin: {
    inherits: "manager",
    permissions: [
      "users:write",
      "users:read",
      "vault:write",
      "vault:read",
      "audit:read",
      "tokenization:detokenize",
      "connectors:write",
      "models:deploy",
      "models:write",
      "settings:write",
      "api_keys:write",
    ],
  },
  owner: {
    inherits: "admin",
    permissions: ["*"],
  },
};

// ---------------------------------------------------------------------------
// Resolução de permissões com herança
// ---------------------------------------------------------------------------

const _permissionsCache = new Map<RoleName, Set<string>>();

export function resolvePermissions(role: string): string[] {
  const roleName = role as RoleName;
  if (!ROLES[roleName]) return [];

  if (_permissionsCache.has(roleName)) {
    return Array.from(_permissionsCache.get(roleName)!);
  }

  const collected = new Set<string>();
  let current: RoleName | null = roleName;

  // Percorre a cadeia de herança coletando permissões
  while (current !== null) {
    const def = ROLES[current];
    if (!def) break;
    for (const perm of def.permissions) {
      collected.add(perm);
    }
    current = def.inherits;
  }

  _permissionsCache.set(roleName, collected);
  return Array.from(collected);
}

export function hasPermission(role: string, requiredPermission: string): boolean {
  const permissions = resolvePermissions(role);
  // "*" concede acesso a qualquer permissão
  return permissions.includes("*") || permissions.includes(requiredPermission);
}

// ---------------------------------------------------------------------------
// Extração de role do JWT
// ---------------------------------------------------------------------------

function extractRoleFromJwt(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    // Adicionar padding base64 se necessário
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded)) as Record<string, unknown>;
    return typeof decoded.role === "string" ? decoded.role : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Middleware factory
// ---------------------------------------------------------------------------

/**
 * Cria um middleware Hono que verifica se o JWT do request contém uma role
 * com a permissão requerida.
 *
 * A verificação de ASSINATURA do JWT deve ocorrer em middleware anterior
 * (ex: Clerk, Auth0, ou verificador interno). Este middleware apenas lê o claim 'role'.
 *
 * @example
 * app.get("/admin/users", createRbacMiddleware("users:read"), handler)
 */
export function createRbacMiddleware(requiredPermission: string): MiddlewareHandler {
  return async (c: Context, next) => {
    const authHeader = c.req.header("Authorization");
    const role = extractRoleFromJwt(authHeader);

    if (!role) {
      return c.json(
        { error: "Unauthorized", detail: "Missing or malformed Authorization header" },
        401,
      );
    }

    if (!hasPermission(role, requiredPermission)) {
      return c.json(
        {
          error: "Insufficient permissions",
          required: requiredPermission,
          role,
        },
        403,
      );
    }

    // Disponibiliza role no contexto para handlers downstream
    c.set("userRole", role);
    await next();
  };
}
