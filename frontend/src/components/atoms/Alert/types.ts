import { HTMLAttributes, ReactNode } from "react"

export type AlertVariant = "default" | "success" | "warning" | "error" | "info"

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  description?: string
  children?: ReactNode
  dismissible?: boolean
  onClose?: () => void
  id?: string
}
