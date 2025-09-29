import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("/api/token");
        const data = await response.json();

        if (!data.token) {
          router.push("/auth/login");
        }
      } catch (err) {
        console.error(err);
        router.push("/auth/login");
      }
    };

    checkToken();
  }, [router]);
}
