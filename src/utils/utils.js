import store from "src/redux";

export const hasPermission = (req) => {
  const permissions = store.getState().user.user.role.RolePermissions.map((p) => p.permission.name);
  return permissions.includes(req);
};
