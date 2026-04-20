import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envDir = path.resolve(process.cwd(), "env");
const envFile = path.join(envDir, ".env");
const rootEnvFile = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else if (fs.existsSync(rootEnvFile)) {
  dotenv.config({ path: rootEnvFile });
} else {
  dotenv.config();
}

const asBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

export const config = {
  baseUrl: process.env.BASE_URL ?? "https://playwright.dev",
  apiBaseUrl: process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com",
  headless: asBool(process.env.HEADLESS, true),
  isCI: asBool(process.env.CI, false)
};
