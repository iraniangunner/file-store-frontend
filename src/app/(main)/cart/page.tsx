// "use client";

// import { useCart } from "@/context/CartContext";
// import {
//   Button,
//   Spinner,
//   Card,
//   CardBody,
//   CardHeader,
//   Select,
//   SelectItem,
//   Divider,
//   Chip,
// } from "@heroui/react";
// import toast, { Toaster } from "react-hot-toast";
// import Image from "next/image";
// import Link from "next/link";
// import api from "@/lib/api";
// import { useState } from "react";
// import { ShoppingCart, Trash2, Package, CreditCard } from "lucide-react";

// export default function CartPage() {
//   const { cart, loading, removeFromCart, count, fetchCart } = useCart();
//   const [checkingOut, setCheckingOut] = useState(false);
//   const [payCurrency, setPayCurrency] = useState("usdtbsc");

//   const currencies = [
//     { label: "USDT (ERC20)", key: "usdterc20", icon: "/images/USDT-ERC20.png" },
//     { label: "USDT (BEP20)", key: "usdtbsc", icon: "/images/USDT-BEP20.png" },
//   ];

//   // ✅ Calculate total
//   const total =
//     cart?.items?.reduce(
//       (sum, item) => sum + Number(item.price) * item.quantity,
//       0
//     ) || 0;

//   // ✅ Checkout handler
//   const handleCheckout = async () => {
//     if (!payCurrency) {
//       toast.error("Please select a payment currency");
//       return;
//     }

//     setCheckingOut(true);
//     try {
//       const guestToken = localStorage.getItem("guest_token");

//       const res = await api.post("/checkout", { pay_currency: payCurrency }, {
//         requiresAuth: true,
//         headers: guestToken ? { "X-Guest-Token": guestToken } : {},
//       } as any);

//       if (res.data.invoice_url) {
//         // 🔗 انتقال به درگاه (می‌تونی اینو به window.open هم تغییر بدی)
//         window.location.href = res.data.invoice_url;
//       } else {
//         toast.success("Order created successfully!");
//         await fetchCart(); // خالی کردن سبد
//       }
//     } catch (err: any) {
//       if (err.response?.status === 401) {
//         toast.error("Please login first");
//       } else {
//         toast.error(err.response?.data?.message || "Checkout failed");
//       }
//     } finally {
//       setCheckingOut(false);
//     }
//   };

//   // 🟡 Loading state
//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-[80vh]">
//         <Spinner size="lg" />
//       </div>
//     );

//   // 🪣 Empty cart
//   if (!cart || count === 0)
//     return (
//       <div className="min-h-[80vh] flex flex-col justify-center items-center">
//         <Toaster />
//         <Card className="max-w-md w-full">
//           <CardBody className="text-center py-12">
//             <div className="flex justify-center mb-4">
//               <div className="bg-default-100 p-6 rounded-full">
//                 <ShoppingCart className="w-12 h-12 text-default-400" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
//             <p className="text-default-500 mb-6">
//               Looks like you haven't added any items to your cart yet.
//             </p>
//             <Button
//               as={Link}
//               href="/products"
//              className="bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white font-semibold"
//               size="lg"
//               startContent={<Package className="w-4 h-4" />}
//             >
//               Browse Products
//             </Button>
//           </CardBody>
//         </Card>
//       </div>
//     );

//   // 🧾 Cart items
//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 mb-36">
//       <Toaster />

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
//         <p className="text-default-500">
//           {count} {count === 1 ? "item" : "items"} in your cart
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-4">
//           {cart.items.map((item:any) => (
//             <Card key={item.id} className="border-none shadow-sm">
//               <CardBody className="p-4">
//                 <div className="flex gap-4">
//                   {item.product.image_path && (
//                     <div className="relative w-24 h-24 flex-shrink-0">
//                       <img
//                         src={`https://filerget.com/storage/${item.product.image_path}` || "/placeholder.svg"}
//                         alt={item.product.title}
//                         className="rounded-lg object-cover aspect-square"
//                       />
//                     </div>
//                   )}

//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-semibold text-lg mb-1 truncate">
//                       {item.product.title}
//                     </h3>
//                     <div className="flex items-center gap-2 mb-3">
//                       <Chip size="sm" variant="flat" color="primary">
//                         ${item.price}
//                       </Chip>
//                       <span className="text-sm text-default-500">
//                         Qty: {item.quantity}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <p className="text-xl font-bold">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </p>
//                       <Button
//                         size="sm"
//                         color="danger"
//                         variant="flat"
//                         startContent={<Trash2 className="w-4 h-4" />}
//                         onClick={() => removeFromCart(item.product_id)}
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>
//           ))}
//         </div>

//         <div className="lg:col-span-1">
//           <Card className="border-none shadow-sm sticky top-6">
//             <CardHeader className="pb-4">
//               <h2 className="text-xl font-bold">Order Summary</h2>
//             </CardHeader>
//             <Divider />
//             <CardBody className="gap-4">
//               <div className="space-y-3">
//                 <div className="flex justify-between text-default-600">
//                   <span>Subtotal</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <Divider />

//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-semibold">Total</span>
//                 <span className="text-2xl font-bold text-primary">
//                   ${total.toFixed(2)}
//                 </span>
//               </div>

//               <Divider />

//               {total > 0 && (
//                 <div>
//                   <label className="text-sm font-medium mb-2 block">
//                     Payment Currency
//                   </label>
//                   <Select
//                     items={currencies}
//                     selectedKeys={[payCurrency]}
//                     onChange={(e) => setPayCurrency(e.target.value)}
//                     placeholder="Select currency"
//                     classNames={{
//                       trigger: "h-12",
//                     }}
//                   >
//                     {(currency) => (
//                       <SelectItem key={currency.key} textValue={currency.label}>
//                         <div className="flex items-center gap-3">
//                           <Image
//                             src={currency.icon || "/placeholder.svg"}
//                             alt={currency.label}
//                             width={24}
//                             height={24}
//                             className="rounded-full"
//                           />
//                           <span className="font-medium">{currency.label}</span>
//                         </div>
//                       </SelectItem>
//                     )}
//                   </Select>
//                 </div>
//               )}

//               <Button
//                 color="primary"
//                 size="lg"
//                 className="w-full font-semibold bg-gradient-to-r from-[#3B9FE8] to-[#3D3D8F] text-white"
//                 onClick={handleCheckout}
//                 disabled={checkingOut}
//                 startContent={
//                   checkingOut ? (
//                     <Spinner size="sm" color="white" />
//                   ) : (
//                     <CreditCard className="w-5 h-5" />
//                   )
//                 }
//               >
//                 {checkingOut
//                   ? "Processing..."
//                   : total === 0
//                   ? "Get for Free"
//                   : "Proceed to Checkout"}
//               </Button>

//               <Button
//                 as={Link}
//                 href="/products"
//                 variant="flat"
//                 className="w-full"
//               >
//                 Continue Shopping
//               </Button>
//             </CardBody>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useCart } from "@/context/CartContext";
import { Spinner } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useState } from "react";
import {
  ShoppingCart,
  Trash2,
  Package,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Minus,
  Plus,
  Tag,
} from "lucide-react";

export default function CartPage() {
  const { cart, loading, removeFromCart, count, fetchCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [payCurrency, setPayCurrency] = useState("usdtbsc");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const currencies = [
    { label: "USDT (ERC20)", key: "usdterc20", icon: "/images/USDT-ERC20.png" },
    { label: "USDT (BEP20)", key: "usdtbsc", icon: "/images/USDT-BEP20.png" },
  ];

  const selectedCurrency = currencies.find((c) => c.key === payCurrency);

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    ) || 0;

  const handleCheckout = async () => {
    if (!payCurrency) {
      toast.error("Please select a payment currency");
      return;
    }

    setCheckingOut(true);
    try {
      const guestToken = localStorage.getItem("guest_token");

      const res = await api.post(
        "/checkout",
        { pay_currency: payCurrency },
        {
          requiresAuth: true,
          headers: guestToken ? { "X-Guest-Token": guestToken } : {},
        } as any
      );

      if (res.data.invoice_url) {
        window.location.href = res.data.invoice_url;
      } else {
        toast.success("Order created successfully!");
        await fetchCart();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error(err.response?.data?.message || "Checkout failed");
      }
    } finally {
      setCheckingOut(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-slate-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || count === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        <Toaster position="top-right" />

        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-violet-100/40 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-8 sm:p-12 max-w-md w-full text-center">
            {/* Empty Icon */}
            <div className="relative mb-8 inline-block">
              <div className="absolute inset-0 bg-violet-200 rounded-full blur-2xl opacity-40" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-12 h-12 text-slate-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start
              exploring our products!
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <Toaster position="top-right" />

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-100/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 mb-24">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg shadow-violet-500/25">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-slate-500 mt-0.5">
                {count} {count === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any, index: number) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex gap-5">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={
                          item.product.image_path
                            ? `https://filerget.com/storage/${item.product.image_path}`
                            : "/placeholder.svg"
                        }
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                      {Number(item.price) === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md">
                          FREE
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 text-lg truncate mb-1">
                            {item.product.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-lg">
                              <Tag className="w-3 h-3" />$
                              {Number(item.price).toFixed(2)}
                            </span>
                            <span className="text-sm text-slate-400">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 transition-all duration-200 group"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Continue Shopping</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm sticky top-24 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Subtotal */}
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({count} items)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Processing Fee</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Payment Currency Selector */}
                {total > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Payment Currency
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsSelectOpen(!isSelectOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-left hover:border-violet-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          {selectedCurrency && (
                            <Image
                              src={selectedCurrency.icon}
                              alt={selectedCurrency.label}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          <span className="font-medium text-slate-900">
                            {selectedCurrency?.label || "Select currency"}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                            isSelectOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Dropdown */}
                      {isSelectOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-10">
                          {currencies.map((currency) => (
                            <button
                              key={currency.key}
                              type="button"
                              onClick={() => {
                                setPayCurrency(currency.key);
                                setIsSelectOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                                payCurrency === currency.key
                                  ? "bg-violet-50"
                                  : ""
                              }`}
                            >
                              <Image
                                src={currency.icon}
                                alt={currency.label}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                              <span
                                className={`font-medium ${
                                  payCurrency === currency.key
                                    ? "text-violet-600"
                                    : "text-slate-700"
                                }`}
                              >
                                {currency.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-500 to-violet-600 
                           hover:from-violet-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400
                           text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 
                           hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none
                           transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {checkingOut ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {total === 0 ? "Get for Free" : "Proceed to Checkout"}
                      </span>
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-sm text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}