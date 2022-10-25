import { TGarden } from 'test/garden-test-values'
import { RoleAssignment, RolePatch, User, UserPatch } from 'types/backend-types'

export const TRole = {
  id: 'role1',
  name: 'testRole',
  permissions: ['basic'],
  sync_status: { someGarden: false },
}

export const TRoleAssignment: RoleAssignment = {
  domain: {
    scope: 'System',
    identifiers: { namespace: 'child' },
  },
  role: TRole,
}

export const TAdminRole = {
  id: 'role2',
  name: 'adminRole',
  permissions: ['admin'],
  sync_status: { someGarden: true },
}

export const TAdminRoleAssignment: RoleAssignment = {
  domain: {
    scope: 'System',
    identifiers: { name: 'default' },
  },
  role: TAdminRole,
}

export const TUser: User = {
  username: 'someUser',
  id: 'usr1',
  role_assignments: [TRoleAssignment],
  permissions: { domain_permissions: {}, global_permissions: ['basic'] },
  sync_status: null,
}

export const TAdmin: User = {
  username: 'adminUser',
  id: 'usr2',
  role_assignments: [TAdminRoleAssignment],
  permissions: {
    domain_permissions: {},
    global_permissions: [
      'system:update',
      'user:update',
      'garden:update',
      'user:create',
      'job:update',
    ],
  },
  sync_status: { [TGarden.name]: true },
}

export const TRolePatch: RolePatch = {
  role_name: 'testRole',
  domain: {
    scope: 'Global',
    identifiers: { namespace: 'child' },
  },
}

export const TUserPatch: UserPatch = {
  password: 'soSecure',
  role_assignments: [TRolePatch],
}
