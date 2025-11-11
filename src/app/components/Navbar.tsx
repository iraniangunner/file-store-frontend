"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import api from "../../lib/api";
import { logoutAction } from "../_actions/logout";
import { useFormState } from "react-dom";
import type { InternalAxiosRequestConfig } from "axios";
import type { User } from "../../types";
import { ShoppingCart, Package, LogOut, LogIn, LogOutIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { count } = useCart();

  const [state, formAction] = useFormState(logoutAction, {
    isSuccess: false,
    error: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          requiresAuth: true,
        } as InternalAxiosRequestConfig);
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (state.isSuccess) {
      setUser(null);
      router.push("/auth");
    }
  }, [state, router]);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-4">
        <Spinner size="lg" />
      </div>
    );

  // helper function
  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      {/* Brand */}
      <NavbarContent>
        <NavbarBrand>
          <Link href="/" className="font-bold text-xl flex items-center gap-1">
            <span className="text-[#3B9FE8]">Filer</span>
            <span className="text-[#3D3D8F]">Get</span>
          </Link>
        </NavbarBrand>
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>

      {/* Desktop Links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link href="/products" className="hover:text-[#3B9FE8]">
            Products
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact-us" className="hover:text-[#3B9FE8]">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* Desktop Right Side (Cart + User) */}
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {/* 🛒 Cart Icon */}
        <NavbarItem>
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </Link>
        </NavbarItem>

        {/* User Dropdown / Auth Buttons */}
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform cursor-pointer"
                color="primary"
                name={user.name}
                size="sm"
                showFallback
                fallback={getUserInitials(user.name)}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Menu" variant="flat">
              <DropdownSection showDivider>
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="User Profile"
                  isReadOnly
                >
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-default-500">
                    {user.email || "user@example.com"}
                  </p>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection showDivider>
                <DropdownItem
                  key="orders"
                  startContent={<Package className="w-4 h-4" />}
                  as={Link}
                  href="/dashboard/orders"
                >
                  My Orders
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                  onPress={() => {
                    const form = document.createElement("form");
                    form.style.display = "none";
                    document.body.appendChild(form);
                    formAction(new FormData(form));
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              href="/auth"
              variant="flat"
              className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
            >
              Login / Signup
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* 📱 Mobile Menu */}
      <NavbarMenu className="sm:hidden">
        <NavbarMenuItem>
          <p
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleNav("/products")}
          >
            Products
          </p>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <p
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleNav("/contact-us")}
          >
            Contact Us
          </p>
        </NavbarMenuItem>

        {/* 🛒 Cart in mobile */}
        <NavbarMenuItem>
          <p
            className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => handleNav("/cart")}
          >
            {/* <ShoppingCart className="w-5 h-5" /> */}
            <span>Cart</span>
            {count > 0 && (
              <span className="text-sm text-gray-600">({count})</span>
            )}
          </p>
        </NavbarMenuItem>

        {user ? (
          <>
            <NavbarMenuItem>
              <p
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleNav("/dashboard/orders")}
              >
                My Orders
              </p>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <form action={formAction}>
                <Button
                  type="submit"
                  className="w-full text-left"
                  variant="flat"
                  color="danger"
                >
                  <LogOutIcon className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </form>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem>
            <Button
              as="button"
              className="w-full text-left"
              variant="flat"
              onClick={() => handleNav("/auth")}
            >
              <LogIn className="w-5 h-5" />
              <span>Login / Signup</span>
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
