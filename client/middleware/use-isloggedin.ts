'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 전역 인증 상태를 관리하고 리다이렉트를 수행하는 커스텀 훅
 * @param redirectToIfFound 로그인 상태일 때 리다이렉트할 경로 (예: 로그인 페이지에서 사용)
 * @param redirectToIfNotFound 로그아웃 상태일 때 리다이렉트할 경로 (예: 대시보드에서 사용)
 */
export function useIsLoggedIn(redirectToIfFound?: string, redirectToIfNotFound?: string) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

      if (isLoggedIn && redirectToIfFound) {
        router.replace(redirectToIfFound)
      } else if (!isLoggedIn && redirectToIfNotFound) {
        router.replace(redirectToIfNotFound)
      } else {
        // 인증 상태 확정
        setIsAuthorized(isLoggedIn)
      }
    }

    // 마운트 시 즉시 실행
    checkAuth()
  }, [router, redirectToIfFound, redirectToIfNotFound])

  return { isAuthorized }
}
