"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  // 인증 확인 중에만 컨텐츠를 숨깁니다.
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
