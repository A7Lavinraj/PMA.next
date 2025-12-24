export {};

export type Roles = "user" | "driver" | "manager" | "admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
