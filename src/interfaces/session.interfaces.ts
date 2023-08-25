import { z } from "zod";
import { sessionSchema } from "../schemas/session.schema";

type SessionCreate = z.infer<typeof sessionSchema>;
type SessionReturn = { token: string };

export { SessionCreate, SessionReturn };
