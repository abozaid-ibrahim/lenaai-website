import { getClientIdCookie } from "./cookieActions";
import axiosInstance from "@/utils/axiosInstance";
// Fetch units using axios
export async function fetchUnits() {
  try {
    // Get the clientId from the separate cookie action
    const clientId = await getClientIdCookie();

    const response = await axiosInstance.get(`/units/${clientId}`, {
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

export async function fetchUnitById(id) {
  try {
    const response = await axiosInstance.get(`/units_details/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch unit by id:", error.message);
    return { error: error.message };
  }
}

export async function updateUnit(unit) {
  console.log("unit", unit);
  try {
    console.log("request unit", unit);

    const response = await axiosInstance.post(`/update-unit/`, unit);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Failed to update unit:", error.message);
    return { error: error.message };
  }
}

export async function deleteUnit(id) {
  try {
    const response = await axiosInstance.delete(`/delete-unit`, {
      params: {
        unitId: id
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete unit:", error.message);
    return { error: error.message };
  }
}

// You can add your other service fetching functions below
export async function fetchData() {
  // Your fetching logic here
}