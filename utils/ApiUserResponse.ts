import { User } from "@/types/auth";
import { Role, AccountStatus } from "@/types/common";

export const normalizeUser = (userFromApi: any): User => ({
  id: userFromApi.id,
  username: userFromApi.username,
  email: userFromApi.email,
  phoneNumber: userFromApi.phoneNumber || null,
  role: (userFromApi.roleName as Role) || Role.USER,
  status: (userFromApi.status as AccountStatus) || AccountStatus.ACTIVE,
  createdAt: userFromApi.createdAt,
  updatedAt: userFromApi.updatedAt,
});