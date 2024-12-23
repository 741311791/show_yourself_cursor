import { useEffect, useState } from "react"
import { useMediaQuery } from "usehooks-ts"

export function useBreakpoint() {
  const [mounted, setMounted] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    isDesktop: mounted ? isDesktop : true,
  }
} 