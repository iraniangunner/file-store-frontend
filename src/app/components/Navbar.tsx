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
} from "@heroui/react";
import api from "../../lib/api";
import { logoutAction } from "../_actions/logout";
import { useFormState } from "react-dom";
import { InternalAxiosRequestConfig } from "axios";
import { User } from "../../types";
import { Spinner } from "@heroui/react";
import Link from "next/link";

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
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

  if (loading) return <Spinner size="lg" />;

  // helper function to close menu + navigate
  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen}>
      {/* Brand + Mobile Toggle */}
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit text-xl flex items-center gap-1">
            <span className="text-[#3B9FE8]">Filer</span>
            <span className="text-[#3D3D8F]">Get</span>
          </p>
        </NavbarBrand>
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>

      {/* Desktop links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Link href="/products">Products</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact-us">Contact</Link>
        </NavbarItem>
      </NavbarContent>

      {/* Desktop Auth */}
      <NavbarContent className="hidden sm:flex" justify="end">
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

      {/* Mobile menu */}
      <NavbarMenu className="sm:hidden">
        <NavbarMenuItem>
          <p
            className="w-full text-left cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleNav("/products")}
          >
            Products
          </p>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <p
            className="w-full text-left cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleNav("/contact-us")}
          >
            Contact Us
          </p>
        </NavbarMenuItem>

        {user ? (
          <>
            <NavbarMenuItem>
              <p
                className="w-full text-left cursor-pointer hover:text-primary transition-colors"
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
