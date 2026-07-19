// Trigger a production deployment via the Vercel API.
const { readFileSync } = await import("fs");

const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();

const body = {
  name: "ecom1",
  gitSource: {
    type: "github",
    org: "Unknownpotato1",
    repo: "ecom1",
    ref: "main",
  },
  target: "production",
  source: "cli",
  projectSettings: {
    framework: "nextjs",
    buildCommand: "next build",
    devCommand: "next dev",
    installCommand: "bun install",
    outputDirectory: ".next",
  },
};

console.log("Triggering production deployment from GitHub main branch...");

const res = await fetch("https://api.vercel.com/v13/deployments", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const data = await res.json();
if (!res.ok) {
  console.error("Failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log("✓ Deployment triggered!");
console.log("  ID:", data.id);
console.log("  URL:", data.url ? `https://${data.url}` : "pending");
console.log("  Inspector:", data.inspectorUrl);
console.log("  Status:", data.readyState);

// Save deployment ID for status polling
const fs = await import("fs");
fs.writeFileSync("/tmp/vercel_deployment_id.txt", data.id);
if (data.url) fs.writeFileSync("/tmp/vercel_deployment_url.txt", `https://${data.url}`);
