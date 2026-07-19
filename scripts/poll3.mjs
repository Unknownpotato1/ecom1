// Quick poll for deployment status
const { readFileSync } = await import("fs");
const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();
const DEPLOYMENT_ID = "dpl_GxJLKnhNibtr2thmZ7TSKB1UmsSq";

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
    process.exit(0);
  }
  if (state === "ERROR" || state === "CANCELED") {
    console.error("\n✗ Failed:", state);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 10000));
}
