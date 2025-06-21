import * as React from "react"
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const variantIcons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantIcons
  title: string
  description?: string
}

export function Alert({
  variant = "default",
  title,
  description,
  className,
  ...props
}: AlertProps) {
  const Icon = variantIcons[variant]

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 pl-11",
        variant === "default" && "bg-background text-foreground border",
        variant === "success" && "bg-green-50 text-green-900 border-green-300",
        variant === "warning" && "bg-yellow-50 text-yellow-900 border-yellow-300",
        variant === "error" && "bg-red-50 text-red-900 border-red-300",
        className
      )}
      {...props}
    >
      <Icon className="absolute left-4 top-4 h-5 w-5" />
      <h4 className="font-semibold">{title}</h4>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}