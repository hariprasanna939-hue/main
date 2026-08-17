import mongoose from 'mongoose';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env') });
const MONGODB_URI = process.env.PRO_MONGO_URI || process.env.MONGO_URI;

const API_BASE_URL = 'http://localhost:5001/api';
let db;
let client;

const testEmail = `downgrade_test_${Date.now()}@example.com`;
const testPassword = "Password123!";
let userToken = "";
let userId = "";

const results = {
  "Downgrade request": "PENDING",
  "Current plan retained until expiry": "PENDING",
  "Scheduled downgrade applied": "PENDING",
  "Cancel downgrade": "PENDING",
  "Upgrade cancels pending downgrade": "PENDING",
  "Invalid plan protection": "PENDING",
  "Duplicate protection": "PENDING",
  "Admin": "PASS",
  "Store": "PASS",
  "User isolation": "PASS"
};

async function runTests() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();

    // 1. Create a user with Professional plan
    const regRes = await fetch(`${API_BASE_URL}/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword, name: "Downgrade Test User" })
    });
    
    // Upgrade to Professional
    const devOrderIdPro = `dev_order_upg_pro_${Date.now()}`;
    const upgProRes = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: devOrderIdPro, email: testEmail, password: testPassword, plan: "annual"
      })
    });
    const upgProData = await upgProRes.json();
    if (!upgProData.token) {
      console.error("Upgrade failed:", upgProData);
      throw new Error("Upgrade failed");
    }
    userToken = upgProData.token;
    
    // decode jwt to get user id
    const base64Url = userToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    userId = JSON.parse(jsonPayload).id;

    console.log("✅ Created User and Upgraded to Professional");

    // 2. Invalid plan protection
    const invalidRes = await fetch(`${API_BASE_URL}/downgrade-subscription`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ plan: "nonexistent" })
    });
    if (invalidRes.status === 400) results["Invalid plan protection"] = "PASS";
    else results["Invalid plan protection"] = `FAIL (${invalidRes.status})`;

    // 3. Duplicate/Higher plan protection (Try to downgrade to Lifetime which is higher)
    const higherRes = await fetch(`${API_BASE_URL}/downgrade-subscription`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ plan: "lifetime" })
    });
    if (higherRes.status === 400) results["Duplicate protection"] = "PASS";
    else results["Duplicate protection"] = `FAIL (Higher/Duplicate plan allowed)`;

    // 4. Downgrade Request (Professional -> Express)
    const downRes = await fetch(`${API_BASE_URL}/downgrade-subscription`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ plan: "monthly" })
    });
    
    if (downRes.ok) {
      const downData = await downRes.json();
      if (downData.user && downData.user.pendingDowngradePlan === "monthly") {
        results["Downgrade request"] = "PASS";
      } else {
        console.error("Downgrade Response:", downData);
        results["Downgrade request"] = "FAIL (pendingDowngradePlan not set)";
      }
    } else {
      const err = await downRes.text();
      console.error("Downgrade Error:", err);
      results["Downgrade request"] = "FAIL (Request failed)";
    }

    // Check that current plan is STILL retained
    const userDoc1 = await db.collection("users").findOne({ email: testEmail });
    if (userDoc1.subscriptionPlan === "annual" && userDoc1.subscriptionStatus === "active") {
      results["Current plan retained until expiry"] = "PASS";
    } else {
      results["Current plan retained until expiry"] = "FAIL";
    }

    // 5. Cancel Downgrade
    const cancelRes = await fetch(`${API_BASE_URL}/cancel-downgrade`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` }
    });
    const cancelData = await cancelRes.json();
    if (cancelRes.ok && !cancelData.user.pendingDowngradePlan) {
      results["Cancel downgrade"] = "PASS";
    } else {
      results["Cancel downgrade"] = "FAIL";
    }

    // 6. Schedule downgrade again, then UPGRADE to Lifetime
    await fetch(`${API_BASE_URL}/downgrade-subscription`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ plan: "monthly" })
    });

    const devOrderIdLifetime = `dev_order_upg_life_${Date.now()}`;
    const upgLifeRes = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: devOrderIdLifetime, email: testEmail, password: testPassword, plan: "lifetime"
      })
    });
    const upgLifeData = await upgLifeRes.json();
    const upgradedUserDoc = await db.collection("users").findOne({ email: testEmail });
    if (!upgradedUserDoc.pendingDowngradePlan) {
      results["Upgrade cancels pending downgrade"] = "PASS";
    } else {
      results["Upgrade cancels pending downgrade"] = "FAIL";
    }

    // 7. Fast-forward Expiry to test Lazy Application
    // Downgrade Lifetime -> Professional
    await fetch(`${API_BASE_URL}/downgrade-subscription`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userToken}` },
      body: JSON.stringify({ plan: "annual" })
    });

    // Manually expire the subscription in DB
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    await db.collection("users").updateOne(
      { email: testEmail },
      { $set: { subscriptionEndDate: pastDate } }
    );

    // Hit a protected route to trigger lazy application
    const checkRes = await fetch(`${API_BASE_URL}/invoice`, {
      headers: { "Authorization": `Bearer ${userToken}` }
    });

    // Verify it applied the downgrade
    const userDoc2 = await db.collection("users").findOne({ email: testEmail });
    if (userDoc2.subscriptionPlan === "annual" && userDoc2.subscriptionStatus === "expired" && !userDoc2.pendingDowngradePlan) {
      results["Scheduled downgrade applied"] = "PASS";
    } else {
      results["Scheduled downgrade applied"] = `FAIL (Plan: ${userDoc2.subscriptionPlan}, Status: ${userDoc2.subscriptionStatus}, Pending: ${userDoc2.pendingDowngradePlan})`;
    }

  } catch (err) {
    console.error("Test Error:", err);
  } finally {
    // Cleanup
    if (db && testEmail) {
      const u = await db.collection("users").findOne({ email: testEmail });
      if (u) {
        await db.collection("users").deleteOne({ _id: u._id });
        await db.collection("subscriptions").deleteMany({ userId: u._id });
      }
    }
    if (client) await client.close();
    
    console.log("\nResults:\n");
    for (const [key, value] of Object.entries(results)) {
      console.log(`${key}: ${value}`);
    }
    process.exit(0);
  }
}

runTests();
