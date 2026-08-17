export type Role = 'requester' | 'driver' | 'dispatcher';

export interface RoleOption {
  key: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  route?: `/requester` | `/driver` | `/dispatcher`;
}
