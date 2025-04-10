import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import { getClientid } from "./clientCookies";



export async function fetchUnits() {
  const clientId = await getClientid();

  try {
    const response = await axiosInstance.get(`units/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch units:", error.message);
    return { error: error.message };
  }
}

export async function fetchcombounds() {
  try {
    const response = await axiosInstance.get(`projects/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch units:", error.message);
    return { error: error.message };
  }
}

export async function uploadImages(formData) {
  try {
    const response = await axiosInstance.post(`/images/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload images:", error.message);
    return { error: error.message };
  }
}

export async function deleteImage(imageId) {
  try {
    const response = await axiosInstance.delete(`/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete image:", error.message);
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
  try {
    const response = await axiosInstance.post(`/update-unit/`, unit);
    return response.data;
  } catch (error) {
    console.error("Failed to update unit:", error.message);
    return { error: error.message };
  }
}

export async function deleteUnit(id) {
  try {
    const response = await axiosInstance.delete(`/delete-unit`, {
      headers: {
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

export async function fetchUsersData(cursor) {

  const clientId = await getClientid();
  try {
    const params = {
      limit: 5,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    const response = await axiosInstance.get(`dashboard/${clientId}`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
    return { error: error.message};
  }
}

export async function fetchDevelopers() {
  try {
    const response = await axiosInstance.get(`/developers/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch developers data:", error.message);
    return { error: error.message };
  }
}
// Add this function to your serviceFetching.js file

export async function addUnit(unitData) {
  try {
    const response = await axiosInstance.post(`/add-unit/`, unitData);
    return response.data;
  } catch (error) {
    console.error("Failed to add unit:", error.message);
    throw { message: error.response?.data?.message || error.message };
  }
}

export async function addCompound(compoundData) {
  try {
    const response = await axiosInstance.post(`/projects/`, compoundData);
    return response.data;
  } catch (error) {
    console.error("Failed to add compound:", error.message);
    throw { message: error.response?.data?.message || error.message };
  }
}

export async function loginUser(formData) {
  try {
    const response = await axiosInstance.post("/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw { message: error.response?.data?.message || error.message };
  }
}

export async function fetchData() {
  // Your fetching logic here
}

export async function getChatHistory(userId) {
  try {
    const response = await axiosInstance.get(`history/ALL/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
    return { error: error.message };
  }
}
