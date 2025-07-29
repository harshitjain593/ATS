"use client"

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/redux/usersSlice";

export default function ClientUserInitializer() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      dispatch(setCurrentUser(user));
      // Sync currentUserId for context-based auth
      if (user && user.id) {
        localStorage.setItem("currentUserId", user.id);
      }
    }
  }, [dispatch]);
  return null;
} 