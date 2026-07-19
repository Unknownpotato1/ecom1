// Vercel project creation + env var setup script.
// Uses the Vercel API directly to create the project with all env vars in one call.
const { readFileSync } = await import("fs");

const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();

// Parse .env file into key-value pairs (handles quoted values with \n).
function parseEnv(content) {
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const envContent = readFileSync("/home/z/my-project/.env", "utf8");
const envVars = parseEnv(envContent);

// Build env var array for Vercel API — only production-target, encrypted.
const environmentVariables = Object.entries(envVars).map(([key, value]) => ({
  key,
  value,
  type: "encrypted",
  target: ["production", "preview", "development"],
}));

const body = {
  name: "ecom1",
  framework: "nextjs",
  buildCommand: "next build",
  devCommand: "next dev",
  installCommand: "bun install",
  outputDirectory: ".next",
  gitRepository: {
    type: "github",
    repo: "Unknownpotato1/ecom1",
  },
  environmentVariables,
};

console.log(`Creating Vercel project "ecom1" with ${environmentVariables.length} env vars...`);

const res = await fetch("https://api.vercel.com/v11/projects", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const data = await res.json();
if (!res.ok) {
  if (data.error?.code === "project_name_taken" || data.error?.message?.includes("already")) {
    console.log("Project already exists — fetching existing project info...");
    const res2 = await fetch("https://api.vercel.com/v9/projects/ecom1", {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    const data2 = await res2.json();
    if (res2.ok) {
      console.log("✓ Existing project:", data2.id);
      console.log("  Dashboard:", `https://vercel.com/${data2.accountId}/ecom1`);
      process.exit(0);
    }
  }
  console.error("Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log("✓ Project created:", data.id);
console.log("  Name:", data.name);
console.log("  Dashboard:", `https://vercel.com/${data.accountId}/ecom1`);
