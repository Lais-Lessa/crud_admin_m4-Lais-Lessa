import { JwtPayload } from "jsonwebtoken";

export interface Token extends JwtPayload {
  admin: boolean;
}
