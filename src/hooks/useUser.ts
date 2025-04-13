"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/users";
import { Tables } from "@/types";

export function useUser() {
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al obtener el usuario"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
