// Poll deployment status — simpler version that checks every 10s.
const { readFileSync } = await import("fs");

const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();
const DEPLOYMENT_ID = "dpl_Dw9fcutkxMJi3i8naAW7ZmTqwTv3";

for (let i = 0; i < 36; i++) {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${DEPLOYMENT_ID}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const data = await res.json();
  const state = data.readyState;
  console.log(`[${i * 10}s] ${state}`);

  if (state === "READY") {
    console.log("\n✓ DEPLOYMENT READY!");
    console.log("URL:", `https://${data.alias?.[0] || data.url}`);
    for (const alias of data.alias || []) {
      console.log("  -", `https://${alias}`);
    }
    process.exit(0);
  }

  if (state === "ERROR" || state === "CANCELED") {
    console.error("\n✗ Deployment failed:", state);
    console.error("Inspector:", data.inspectorUrl);
    process.exit(1);
  }

  await new Promise((r) => setTimeout(r, 10000));
}
console.error("Timed out");
process.exit(1);
