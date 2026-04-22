'use client'

import { usePathname } from 'next/navigation'
import { useIsLoggedIn } from '@/client/middleware/use-isloggedin'

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  /**
   * 전역 인증 관리:
   * 1. 로그인된 유저가 /login 접속 시 -> / 로 리다이렉트 (redirectToIfFound: "/")
   * 2. 로그아웃된 유저가 / (또는 하위 경로) 접속 시 -> /login 으로 리다이렉트 (redirectToIfNotFound: "/login")
   */
  const { isAuthorized } = useIsLoggedIn(
    isLoginPage ? '/' : undefined,
    !isLoginPage ? '/login' : undefined,
  )

  // 인증 확인 중이거나 리다이렉트 중일 때 보안상 컨텐츠 노출을 방지합니다.
  if (!isLoginPage && !isAuthorized) {
    return null
  }

  return <>{children}</>
}
