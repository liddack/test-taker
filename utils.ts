import * as cryptoServer from "crypto";

export function getRandomUUID() {
  if (typeof window === "undefined") {
    return cryptoServer.randomBytes(16).toString("hex");
  }
  return crypto.randomUUID();
}
