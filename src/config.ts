import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envDir = path.resolve(process.cwd(), "env");
const envFile = path.join(envDir, ".env");
const rootEnvFile = path.resolve(process.cwd(), ".env");
let envSource = "default dotenv resolution";

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  envSource = "env/.env";
} else if (fs.existsSync(rootEnvFile)) {
  dotenv.config({ path: rootEnvFile });
  envSource = ".env (project root)";
} else {
  dotenv.config();
}

console.info(`[config] Loaded environment from: ${envSource}`);

const asBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

const asString = (value: string | undefined, fallback = ""): string => {
  if (value === undefined) {
    return fallback;
  }
  return value.trim();
};

export const config = {
  loginUrl: asString(process.env.LOGIN_URL, "https://login.salesforce.com/"),
  baseUrl: asString(
    process.env.BASE_URL,
    "https://quadrantrca-dev-ed.develop.lightning.force.com/"
  ),
  tmUsername: asString(process.env.TM_USERNAME),
  tmPassword: asString(process.env.TM_PASSWORD),
  //headless: asBool(process.env.HEADLESS, true),
  //isCI: asBool(process.env.CI, false)
};
