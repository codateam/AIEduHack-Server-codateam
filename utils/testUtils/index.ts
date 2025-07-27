import { v4 } from "uuid";

export function generateEmailAndPassword() {
  const generatedUUID = v4();
  const email = `${generatedUUID}@example.com`;
  const password = generatedUUID.replace(/-/g, ""); // Removing dashes from UUID for password
  return { email, password };
}
