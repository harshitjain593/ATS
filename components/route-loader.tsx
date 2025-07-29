"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import GlobalLoader from "@/components/global-loader";

export default function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;
  return <GlobalLoader />;
} 