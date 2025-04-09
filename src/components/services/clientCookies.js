"use server"
import { cookies } from "next/headers";
import toast from "react-hot-toast";

export const getClientid = async () => {
  const cookie =  cookies().get("client_id");
  
 console.log(cookie)
  if (!cookie || !cookie.value) return {};

  try {
    return cookie.value
  } catch (error) {
    console.error("Failed to parse client_id cookie:", error);
    return {};
  }
};
export const removeClientId = async () => {
    const cookie =  cookies().get("client_id");
  
    console.log(cookie)
     if (!cookie || !cookie.value) return toast.error("Failed to remove client_id cookie:");
       
    try {
      cookies.delete("client_id");
      console.log("client_id cookie removed");
    } catch (error) {
      console.error("Failed to remove client_id cookie:", error);
    }
  };