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
  | "user"
  | "vehicleRequest"
  | "roomReservation"
  | "convocation"
  | "adminReports";

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
    user: ["view"],
    vehicleRequest: ["view", "create", "update", "manage"],
    roomReservation: ["view", "create", "update", "manage"],
    convocation: ["view", "create", "update", "manage"]
  },
  SUPERVISOR: {
    dashboard: ["view"],
    project: ["view", "update"],
    personnel: ["view"],
    task: ["view", "update"],
    remark: ["view", "create", "comment"],
    vehicleRequest: ["view", "create"],
    roomReservation: ["view", "create"],
    convocation: ["view"]
  },
  EMPLOYEE: {
    dashboard: ["view"],
    project: ["view"],
    personnel: ["view"],
    task: ["view", "update"],
    remark: ["view", "create", "comment"],
    vehicleRequest: ["view", "create"],
    roomReservation: ["view", "create"],
    convocation: ["view"]
  },
  VIEWER: {
    dashboard: ["view"],
    project: ["view"],
    personnel: ["view"],
    task: ["view"],
    remark: ["view"],
    convocation: ["view"]
  }
};

const publicPermissions: Partial<Record<PermissionResource, PermissionAction[]>> = {
  dashboard: ["view"],
  project: ["view"],
  personnel: ["view"],
  task: ["view"],
  remark: ["view"],
  convocation: ["view"]
};

export function checkUserPermission(
  user: PermissionUser | null | undefined,
  action: PermissionAction,
  resource: PermissionResource
) {
  if (!user || user.isActive === false) {
    if (!user) {
      const allowedActions = publicPermissions[resource] ?? [];
      return allowedActions.includes(action);
    }
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

export type ProjectPermissionType = "canView" | "canEdit" | "canSubmit" | "canApprove" | "canManage";

export type ProjectPermissionData = {
  canView: boolean;
  canEdit: boolean;
  canSubmit: boolean;
  canApprove: boolean;
  canManage: boolean;
};

export function checkProjectPermission(
  user: PermissionUser | null | undefined,
  permissions: ProjectPermissionData | null | undefined,
  type: ProjectPermissionType
) {
  if (!user || user.isActive === false) return false;
  if (user.role === "SUPER_ADMIN") return true;

  if (!permissions) return false;
  return permissions[type] === true || permissions.canManage === true;
}
