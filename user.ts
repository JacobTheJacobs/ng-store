export interface Roles { 
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }


export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  roles: Roles;
  balance: number;
}
