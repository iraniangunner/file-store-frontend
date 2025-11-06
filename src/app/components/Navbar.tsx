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
  Spinner,
} from "@heroui/react";
import Link from "next/link";
import api from "../../lib/api";
import { logoutAction } from "../_actions/logout";
import { useFormState } from "react-dom";
import { InternalAxiosRequestConfig } from "axios";
import { User } from "../../types";
import { ShoppingCart } from "lucide-react";
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
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat">Hi {user.name}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Menu">
              <DropdownItem key="orders">
                <Link href="/dashboard/orders" className="w-full block">
                  Orders
                </Link>
              </DropdownItem>
              <DropdownItem key="logout">
                <form action={formAction}>
                  <Button
                    type="submit"
                    className="w-full text-left"
                    variant="flat"
                  >
                    Logout
                  </Button>
                </form>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button as={Link} href="/auth" variant="flat">
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
            <ShoppingCart className="w-5 h-5" />
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
                Orders
              </p>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <form action={formAction}>
                <Button
                  type="submit"
                  className="w-full text-left"
                  variant="flat"
                >
                  Logout
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
              Login / Signup
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
