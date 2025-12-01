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
import {
  ShoppingCart,
  Package,
  LogOut,
  LogIn,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  FileBox,
  Mail,
  User as UserIcon,
  HelpCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { count } = useCart();

  const [state, formAction] = useFormState(logoutAction, {
    isSuccess: false,
    error: "",
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleNav = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-center">
        <Spinner size="sm" />
      </nav>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-slate-200/60"
          : "bg-white/70 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-0.5 font-bold text-xl group"
          >
            <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent transition-all group-hover:from-sky-600 group-hover:to-sky-700">
              Filer
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent transition-all group-hover:from-indigo-700 group-hover:to-indigo-800">
              Get
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <FileBox className="w-4 h-4" />
              Products
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              Contact
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold rounded-full shadow-lg shadow-rose-500/30">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            {/* User Menu / Auth */}
            {user ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/25">
                      {getUserInitials(user.name)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden lg:block">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="User Menu"
                  variant="flat"
                  className="w-64"
                >
                  <DropdownSection showDivider>
                    <DropdownItem
                      key="profile"
                      className="h-16 gap-3 cursor-default"
                      textValue="User Profile"
                      isReadOnly
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/25">
                          {getUserInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection showDivider>
                    <DropdownItem
                      key="orders"
                      startContent={
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-sky-600" />
                        </div>
                      }
                      as={Link}
                      href="/dashboard/orders"
                      className="py-2"
                    >
                      <span className="font-medium">My Orders</span>
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSection>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-rose-600" />
                        </div>
                      }
                      className="py-2"
                      onPress={() => {
                        const form = document.createElement("form");
                        form.style.display = "none";
                        document.body.appendChild(form);
                        formAction(new FormData(form));
                      }}
                    >
                      <span className="font-medium">Log Out</span>
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold rounded-full">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 pb-6 pt-2 space-y-2">
          {/* User Info (if logged in) */}
          {user && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/25">
                {getUserInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {user.email || "user@example.com"}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <button
            onClick={() => handleNav("/products")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <FileBox className="w-5 h-5 text-sky-600" />
            </div>
            <span className="font-medium">Products</span>
          </button>

          <button
            onClick={() => handleNav("/faq")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-violet-600" />
            </div>
            <span className="font-medium">FAQ</span>
          </button>

          <button
            onClick={() => handleNav("/contact-us")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-medium">Contact Us</span>
          </button>

          {user ? (
            <>
              <button
                onClick={() => handleNav("/dashboard/orders")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium">My Orders</span>
              </button>

              <div className="pt-2 border-t border-slate-200">
                <form action={formAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="font-medium">Log Out</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="pt-4">
              <button
                onClick={() => handleNav("/auth")}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}