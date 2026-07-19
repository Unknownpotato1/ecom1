// Update Vercel env vars with the real Firebase web config.
const { readFileSync } = await import("fs");

const VERCEL_TOKEN = readFileSync("/tmp/vercel_token.txt", "utf8").trim();

// The new values we need to set
const updates = [
  { key: "NEXT_PUBLIC_FIREBASE_API_KEY", value: "AIzaSyB5_Iqk_TqvJVmfvtE_8Bc_twZ1XZaw_rg" },
  { key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", value: "ecom1-eefbc.firebaseapp.com" },
  { key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", value: "ecom1-eefbc" },
  { key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", value: "ecom1-eefbc.firebasestorage.app" },
  { key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", value: "397502184417" },
  { key: "NEXT_PUBLIC_FIREBASE_APP_ID", value: "1:397502184417:web:7ceed276c2abdf98acb0a0" },
];

// Get project ID
const res = await fetch("https://api.vercel.com/v9/projects/ecom1", {
  headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
});
const project = await res.json();
if (!res.ok) {
  console.error("Failed to fetch project:", JSON.stringify(project, null, 2));
  process.exit(1);
}
const projectId = project.id;
console.log(`Project ID: ${projectId}`);

// Get existing env vars
const envRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
  headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
});
const envData = await envRes.json();
const existingVars = new Map((envData.envs || []).map((v) => [v.key, v]));

// Update each var
for (const { key, value } of updates) {
  const existing = existingVars.get(key);
  if (existing) {
    // Update existing
    const updateRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, target: ["production", "preview", "development"] }),
    });
    const updateData = await updateRes.json();
    if (updateRes.ok) {
      console.log(`✓ Updated ${key}`);
    } else {
      console.error(`✗ Failed to update ${key}:`, JSON.stringify(updateData));
    }
  } else {
    // Create new
    const createRes = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    });
    const createData = await createRes.json();
    if (createRes.ok) {
      console.log(`✓ Created ${key}`);
    } else {
      console.error(`✗ Failed to create ${key}:`, JSON.stringify(createData));
    }
  }
}

console.log("\n✓ All Firebase env vars updated on Vercel.");
