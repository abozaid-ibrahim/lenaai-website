"use server"

import axios from "axios";
import { getClientIdCookie } from "./cookieActions";

// Fetch units using axios
export async function fetchUnits() {
  try {
    // Get the clientId from the separate cookie action
    const clientId = await getClientIdCookie();
    
    const response = await axios.get(`https://api.lenaai.net/units/${clientId}`, {
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