export function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  if (!value && required) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Environment variable ${key} is missing in production.`);
    }
    // In development, we can fail gracefully or return empty string depending on the use case,
    // but typically we should still warn or throw for required variables.
    console.warn(`Warning: Environment variable ${key} is missing.`);
  }
  return value || "";
}
