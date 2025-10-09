"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to employees page by default
    router.push("/settings/employees");
  }, [router]);

  return null;
};

export default SettingsPage;
