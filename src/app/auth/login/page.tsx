// "use client";
// import { useState } from "react";
// import api from "../../../lib/api";
// import { setAuth } from "../../../lib/auth";
// import { useRouter } from "next/navigation";
// import { User } from "../../../types";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await api.post<{ token: string; user: User }>("/login", form);
//       setAuth(res.data.token, res.data.user);
//       // router.push("/products");
//       window.location.href = "/products";
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "خطا در ورود");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-bold mb-4">ورود</h2>
//       <form onSubmit={submit} className="space-y-3">
//         <input
//           required
//           type="email"
//           placeholder="ایمیل"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="w-full p-2 border rounded"
//         />
//         <input
//           required
//           type="password"
//           placeholder="رمز عبور"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="w-full p-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer"
//           disabled={loading}
//         >
//           {loading ? "در حال ورود..." : "ورود"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { setAuth } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { User } from "../../../types";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // ارسال login به backend
      const res = await api.post<{
        access_token: string;
        expires_in: number;
        token_type: string;
        user: User;
      }>("/login", form);

      // ذخیره access token و user در memory
     setAuth(res.data.access_token, res.data.user);

      // ریدایرکت به محصولات
      // window.location.href = "/dashboard";
      router.push("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">ورود</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          type="email"
          placeholder="ایمیل"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          placeholder="رمز عبور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer"
          disabled={loading}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
