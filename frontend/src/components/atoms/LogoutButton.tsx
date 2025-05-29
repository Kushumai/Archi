"use client"

import { useAuth } from "@/contexts/authContext"
import { Button, ButtonProps } from "./Button"

export default function LogoutButton(props: ButtonProps) {
  const { logout } = useAuth()

  return (
    <Button onClick={logout} {...props}>
      {props.children}
    </Button>
  )
}