"use server"

import { cookies } from "next/headers";

export async function setClientIdCookie() {
  const cookieStore = cookies();
  cookieStore.set("clientId", "DREAM_HOMES", { 
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });
  return true;
}

export async function getClientIdCookie() {
  const cookieStore = cookies();
  return cookieStore.get("clientId")?.value || "DREAM_HOMES";
}