"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Home, Settings, LogOut, Menu, FolderKanban, X } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";
import { logoutAction } from "../../../app/_actions/logout";
import { useRouter } from "next/navigation";

export function MainSideBar() {
  const [open, setOpen] = useState(true); // فقط برای دسکتاپ
  const [mobileOpen, setMobileOpen] = useState(false); // برای موبایل
  const [isDesktop, setIsDesktop] = useState(false);

  const [state, formAction] = useFormState(logoutAction, {
    isSuccess: false,
    error: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (state.isSuccess) {
      router.push("/auth"); // بعد از logout ریدایرکت
    }
  }, [state.isSuccess, router]);

  // ✅ تشخیص حالت دسکتاپ یا موبایل
  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/admin" },
    {
      name: "Products",
      icon: <FolderKanban size={18} />,
      href: "/admin/products",
    },
    {
      name: "Categories",
      icon: <Settings size={18} />,
      href: "/admin/categories",
    },

    {
      name: "Comments",
      icon: <Settings size={18} />,
      href: "/admin/comments",
    },

    {
      name: "Product Comments",
      icon: <Settings size={18} />,
      href: "/admin/product-comments",
    },
  ];

  return (
    <>
      {/* 🔹 نوار بالا در موبایل */}
      {!isDesktop && (
        <div className="flex items-center justify-between p-4 border-b border-default bg-background sticky top-0 z-40">
          <span className="font-bold text-lg">Filerget</span>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </Button>
        </div>
      )}

      {/* 🔸 پس‌زمینه تار هنگام باز بودن در موبایل */}
      {mobileOpen && !isDesktop && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        ></div>
      )}

      {/* 🔹 سایدبار اصلی */}
      <aside
        className={`fixed md:relative top-0 left-0 h-screen bg-background border-r border-default z-50 transition-all duration-300 ease-in-out
          ${
            mobileOpen && !isDesktop
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          ${open && isDesktop ? "md:w-64" : "md:w-20"}
        `}
      >
        <Card className="h-full rounded-none border-none bg-transparent">
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                {/* لوگو */}
                {(open || !isDesktop) && (
                  <span className="font-bold text-lg">Filerget</span>
                )}

                {/* دکمه‌های کنترل */}
                <div className="flex gap-2">
                  {/* بستن در موبایل */}
                  {!isDesktop && (
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => setMobileOpen(false)}
                    >
                      <X size={20} />
                    </Button>
                  )}

                  {/* باز/بستن در دسکتاپ */}
                  {isDesktop && (
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => setOpen(!open)}
                    >
                      <Menu size={20} />
                    </Button>
                  )}
                </div>
              </div>

              {/* منوها */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    fullWidth
                    variant="light"
                    className="justify-start"
                    startContent={item.icon}
                    onPress={() => setMobileOpen(false)}
                  >
                    {(open || mobileOpen) && item.name}
                  </Button>
                ))}

                {/* Logout */}
                <form action={formAction}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="light"
                    className="justify-start"
                    startContent={<LogOut size={18} />}
                  >
                    {(open || mobileOpen) && "Logout"}
                  </Button>
                </form>
              </nav>
            </div>
          </CardBody>
        </Card>
      </aside>
    </>
  );
}
