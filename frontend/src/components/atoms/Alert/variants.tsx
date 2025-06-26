import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  InfoIcon,
} from "lucide-react"
import type { AlertVariant } from "./types"

export const variantIcons: Record<AlertVariant, React.ElementType> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: InfoIcon,
}

export const alertVariantClasses: Record<AlertVariant, string> = {
  default: "bg-gray-50 text-gray-900 border-gray-300",
  success: "bg-green-50 text-green-900 border-green-300",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-300",
  error: "bg-red-50 text-red-900 border-red-300",
  info: "bg-blue-50 text-blue-900 border-blue-300",
}