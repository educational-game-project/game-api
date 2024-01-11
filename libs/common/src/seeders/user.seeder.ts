import { UserRole } from "../enums/role.enum";

export const userSeeder = [
  {
    name: "Super Admin",
    role: UserRole.SUPER_ADMIN,
    email: "superadmin@gmail.com",
    phoneNumber: "+6288888888888",
  },
  {
    name: "Admin",
    role: UserRole.ADMIN,
    email: "admin@gmail.com",
    phoneNumber: "+6288888888888",
  },
];
