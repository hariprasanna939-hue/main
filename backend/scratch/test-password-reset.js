import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

// Load dotenv environment variables from backend/.env
dotenv.config({ path: "/Users/subburajj/Downloads/main-1/backend/.env" });

const API_BASE_URL = "http://localhost:5001/api";

async function testPasswordReset() {
  console.log("🚀 Testing Password Reset Flow...");

  const testEmail = `temp_${Date.now()}@example.com`;
  const testPassword = "InitialPassword123!";
  const newPassword = "NewSecurePassword456!";

  // 1. Create a user first via signup-trial
  console.log("\n1. Creating temporary user for test...");
  const signupRes = await fetch(`${API_BASE_URL}/signup-trial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      role: "admin"
    })
  });

  const signupData = await signupRes.json();
  if (!signupRes.ok) {
    throw new Error(`Signup failed: ${signupData.message}`);
  }
  console.log("✅ User created successfully");

  // 2. Test Forgot Password with UNREGISTERED email
  console.log("\n2. Testing Forgot Password with UNREGISTERED email...");
  const fakeEmail = `fake_${Date.now()}@example.com`;
  const forgotFakeRes = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: fakeEmail })
  });

  const forgotFakeData = await forgotFakeRes.json();
  console.log(`Response status: ${forgotFakeRes.status}`);
  console.log(`Response content:`, forgotFakeData);
  if (!forgotFakeRes.ok || !forgotFakeData.success) {
    throw new Error("Fake forgot password email check failed to return success status");
  }

  // 3. Test Forgot Password with REGISTERED email
  console.log("\n3. Testing Forgot Password with REGISTERED email...");
  const forgotRealRes = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail })
  });

  const forgotRealData = await forgotRealRes.json();
  console.log(`Response status: ${forgotRealRes.status}`);
  console.log(`Response content:`, forgotRealData);
  if (!forgotRealRes.ok || !forgotRealData.success) {
    throw new Error("Real forgot password email check failed");
  }

  // 4. Retrieve reset token from DB using direct query
  console.log("\n4. Retrieving reset token from DB...");
  const { MongoClient } = await import("mongodb");
  const mongoUri = process.env.PRO_MONGO_URI || process.env.DEV_MONGO_URI;
  if (!mongoUri) {
    throw new Error("MongoDB URI is missing from environment");
  }
  
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const user = await db.collection("users").findOne({ email: testEmail });
  await client.close();

  if (!user || !user.resetPasswordToken) {
    throw new Error("No reset token found in database for user");
  }
  console.log(`✅ Hashed reset token found: ${user.resetPasswordToken}`);

  // Note: We need the raw token to reset. Since it's sent to console, let's look at the console log output of server!
  const fs = await import("fs");
  const logContent = fs.readFileSync("/Users/subburajj/Downloads/main-1/backend/server.log", "utf8");
  const tokenMatch = logContent.match(/token=([a-f0-9]+)/);
  if (!tokenMatch) {
    throw new Error("Failed to find raw token in server.log");
  }
  const rawToken = tokenMatch[1];
  console.log(`✅ Raw token extracted from logs: ${rawToken}`);

  // 5. Test Reset Password with INVALID token
  console.log("\n5. Testing Reset Password with INVALID token...");
  const resetFakeRes = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "invalidtoken123", password: newPassword })
  });

  const resetFakeData = await resetFakeRes.json();
  console.log(`Response status: ${resetFakeRes.status}`);
  console.log(`Response content:`, resetFakeData);
  if (resetFakeRes.status !== 400) {
    throw new Error("Invalid token reset should have been rejected with 400");
  }

  // 6. Test Reset Password with VALID token
  console.log("\n6. Testing Reset Password with VALID token...");
  const resetRealRes = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: rawToken, password: newPassword })
  });

  const resetRealData = await resetRealRes.json();
  console.log(`Response status: ${resetRealRes.status}`);
  console.log(`Response content:`, resetRealData);
  if (!resetRealRes.ok || !resetRealData.success) {
    throw new Error("Password reset with valid token failed");
  }

  // 7. Verify token is invalidated and cannot be reused
  console.log("\n7. Verifying token cannot be reused...");
  const resetReuseRes = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: rawToken, password: newPassword })
  });

  const resetReuseData = await resetReuseRes.json();
  console.log(`Response status: ${resetReuseRes.status}`);
  console.log(`Response content:`, resetReuseData);
  if (resetReuseRes.status !== 400) {
    throw new Error("Token reuse should be rejected");
  }

  // 8. Verify old password cannot log in
  console.log("\n8. Verifying old password cannot login...");
  const loginOldRes = await fetch(`${API_BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: testPassword, role: "admin" })
  });

  const loginOldData = await loginOldRes.json();
  console.log(`Response status: ${loginOldRes.status}`);
  console.log(`Response content:`, loginOldData);
  if (loginOldRes.status === 200) {
    throw new Error("Old password should not be allowed to log in");
  }

  // 9. Verify new password log in succeeds
  console.log("\n9. Verifying new password login succeeds...");
  const loginNewRes = await fetch(`${API_BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testEmail, password: newPassword, role: "admin" })
  });

  const loginNewData = await loginNewRes.json();
  console.log(`Response status: ${loginNewRes.status}`);
  console.log(`Response content:`, loginNewData);
  if (!loginNewRes.ok) {
    throw new Error("New password login failed");
  }

  console.log("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY WITH 100% SUCCESS STATUS!");
}

testPasswordReset().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
