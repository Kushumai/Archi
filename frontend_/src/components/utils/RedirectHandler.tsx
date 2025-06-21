"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function RedirectHandler() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  useEffect(() => {
    const form = document.getElementById("login-form")
    if (form) {
      form.setAttribute("data-redirect", redirect)
    }
  }, [redirect])

  return null
}
