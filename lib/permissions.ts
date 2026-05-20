import type { UserRole } from "@prisma/client";

export type PermissionAction = "view" | "create" | "update" | "manage" | "comment";

export type PermissionResource =
  | "dashboard"
  | "project"
  | "personnel"
  | "task"
  | "remark"
  | "admin"
  | "settings"
  | "auditLog"
  | "user";

export type PermissionUser = {
  role: UserRole;
  isActive?: boolean;
};

const permissions: Record<Exclude<UserRole, "SUPER_ADMIN">, Partial<Record<PermissionResource, PermissionAction[]>>> = {
  ADMIN: {
    dashboard: ["view"],
    project: ["view", "create", "update", "manage"],
    personnel: ["view", "create", "update", "manage"],
    task: ["view", "create", "update", "manage"],
    remark: ["view", "create", "update", "manage", "comment"],
    admin: ["view"],
    settings: ["view"],
    auditLog: ["view"],
    user: ["view"]
  },
  SUPERVISOR: {
    dashboard: ["view"],
    project: ["view", "update"],
    personnel: ["view"],
    task: ["view", "update"],
    remark: ["view", "create", "comment"]
  },
  EMPLOYEE: {
    dashboard: ["view"],
    project: ["view"],
    personnel: ["view"],
    task: ["view", "update"],
    remark: ["view", "create", "comment"]
  },
  VIEWER: {
    dashboard: ["view"],
    project: ["view"],
    personnel: ["view"],
    task: ["view"],
    remark: ["view"]
  }
};

export function checkUserPermission(
  user: PermissionUser | null | undefined,
  action: PermissionAction,
  resource: PermissionResource
) {
  if (!user || user.isActive === false) {
    return false;
  }

  if (user.role === "SUPER_ADMIN") {
    return true;
  }

  const allowedActions = permissions[user.role]?.[resource] ?? [];
  return allowedActions.includes(action) || allowedActions.includes("manage");
}

export function canManageSettings(user: PermissionUser | null | undefined) {
  return Boolean(user && user.isActive !== false && user.role === "SUPER_ADMIN");
}
