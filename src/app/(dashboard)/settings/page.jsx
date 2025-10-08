"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to categories page by default
    router.push("/settings/categories");
  }, [router]);

  return null;
};

export default SettingsPage;
