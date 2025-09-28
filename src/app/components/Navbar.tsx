// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { getUser, clearAuth } from "../../lib/auth";
// import { User } from "../../types";
// import { useRouter } from "next/navigation";
// import { Button } from "@heroui/react";

// export default function Navbar() {
//   const [user, setUser] = useState<User | null>(null);
//   const [open, setOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setUser(getUser());
//   }, []);

//   // const logout = () => {
//   //   clearAuth();
//   //   setUser(null);
//   //   router.push("/auth/login");
//   // };
//   const logout = async () => {
//     try {
//       await fetch("/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch {}
//     clearAuth();
//     setUser(null);
//     router.push("/auth/login");
//   };

 
//   return (
//     <nav className="bg-white shadow px-4 py-3 mb-8 flex items-center justify-between">
//       {/* سمت چپ */}
//       <div className="flex items-center gap-4">
//         <Link href="/" className="font-bold text-lg">
//           FileShop
//         </Link>
//         <Link href="/products" className="text-sm text-gray-600">
//           محصولات
//         </Link>
//       </div>

//       {/* سمت راست */}
//       <div>
//         {user ? (
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-700">سلام، {user.name}</span>
//             <Button
//               onClick={logout}
//               size="sm"
//               className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
//             >
//               خروج
//             </Button>
//           </div>
//         ) : (
//           <div className="flex gap-2">
//             <Link
//               href="/auth/login"
//               className="text-sm px-3 py-1 border rounded"
//             >
//               ورود
//             </Link>
//             <Link
//               href="/auth/register"
//               className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
//             >
//               ثبت‌نام
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User } from "../../types";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import api from "../../lib/api"; // instance شما
import { getToken } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const res = await api.get("/auth/me");
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white shadow px-4 py-3 mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">FileShop</Link>
        <Link href="/products" className="text-sm text-gray-600">محصولات</Link>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">سلام، {user.name}</span>
            <Button
              onClick={logout}
              size="sm"
              className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
            >
              خروج
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/login" className="text-sm px-3 py-1 border rounded">ورود</Link>
            <Link href="/auth/register" className="text-sm px-3 py-1 bg-blue-500 text-white rounded">ثبت‌نام</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
