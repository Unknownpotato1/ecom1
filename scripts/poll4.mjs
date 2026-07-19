const { readFileSync } = await import("fs");
const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();
const DEPLOYMENT_ID = "dpl_EJnTMZQ81T1QZHQ8t5XBZjnf2ZSg";
for (let i = 0; i < 36; i++) {
  const res = await fetch(`https://api.vercel.com/v13/deployments/${DEPLOYMENT_ID}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  const data = await res.json();
  console.log(`[${i*10}s] ${data.readyState}`);
  if (data.readyState === "READY") {
    console.log("\n✓ READY:", `https://${data.alias?.[0] || data.url}`);
    process.exit(0);
  }
  if (data.readyState === "ERROR" || data.readyState === "CANCELED") {
    console.error("✗ Failed:", data.readyState);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 10000));
}
