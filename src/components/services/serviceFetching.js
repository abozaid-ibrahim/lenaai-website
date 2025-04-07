"use server"

import axios from "axios";
import { cookies } from 'next/headers';

// استخدام cookies API من Next.js للصول على الكوكي من الخادم
export async function getClientIdFromCookie() {
  // cookies() doesn't need to be awaited as it's not a Promise
  const cookieStore = cookies();
  return cookieStore.get('clientId')?.value || 'DREAM_HOMES'; // قيمة افتراضية إذا لم يتم العثور على الكوكي
}

// Fetch units using axios
export async function fetchUnits() {
  try {
    // الحصول على clientId من الكوكي مباشرة
    const clientId = await getClientIdFromCookie();
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/units/${clientId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
    
  } catch (error) {
    console.error("Failed to fetch units:", error.message);
    return { error: error.message };
  }
}

export async function fetchcombounds() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
    
  } catch (error) {
    console.error("Failed to fetch units:", error.message);
    return { error: error.message };
  }
}

// You can add your other service fetching functions below
export async function fetchData() {
  // Your fetching logic here
}