// Poll deployment status until ready or error.
const { readFileSync } = await import("fs");

const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();
const DEPLOYMENT_ID = readFileSync("/tmp/vercel_deployment_id.txt", "utf8").trim();

console.log(`Polling deployment ${DEPLOYMENT_ID}...`);

async function getStatus() {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${DEPLOYMENT_ID}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  if (!res.ok) {
    console.error("Status fetch failed:", res.status);
    return null;
  }
  return res.json();
}

async function getBuildLogs() {
  try {
    const res = await fetch(`https://api.vercel.com/v3/deployments/${DEPLOYMENT_ID}/events`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch {
    return [];
  }
}

let attempts = 0;
const maxAttempts = 90; // 7.5 minutes max

while (attempts < maxAttempts) {
  const data = await getStatus();
  if (!data) {
    await new Promise((r) => setTimeout(r, 5000));
    attempts++;
    continue;
  }

  const state = data.readyState;
  console.log(`[${new Date().toISOString()}] Status: ${state}`);

  if (state === "READY") {
    console.log("\n✓ DEPLOYMENT READY!");
    console.log("  Production URL:", `https://${data.alias?.[0] || data.url}`);
    console.log("  All aliases:");
    for (const alias of data.alias || []) {
      console.log("    -", `https://${alias}`);
    }
    console.log("  Inspector:", data.inspectorUrl);
    const fs = await import("fs");
    fs.writeFileSync("/tmp/vercel_final_url.txt", `https://${data.alias?.[0] || data.url}`);
    process.exit(0);
  }

  if (state === "ERROR" || state === "CANCELED") {
    console.error("\n✗ Deployment failed:", state);
    console.error("  Inspector:", data.inspectorUrl);
    // Fetch last build logs
    const logs = await getBuildLogs();
    console.log("\nLast build events:");
    for (const evt of logs.slice(-30)) {
      console.log(`  [${evt.created}] ${evt.text || evt.payload?.text || JSON.stringify(evt.payload || "").slice(0, 200)}`);
    }
    process.exit(1);
  }

  // Print last 3 build events for progress visibility
  if (attempts % 6 === 0) {
    const logs = await getBuildLogs();
    const recent = logs.slice(-3);
    for (const evt of recent) {
      const text = evt.text || evt.payload?.text || "";
      if (text) console.log("  ", text.slice(0, 150));
    }
  }

  await new Promise((r) => setTimeout(r, 5000));
  attempts++;
}

console.error("Timed out waiting for deployment");
process.exit(1);
