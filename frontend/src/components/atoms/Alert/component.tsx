import { cn } from "@/lib/utils"
import { AlertProps } from "./types"
import { alertVariantClasses, variantIcons } from "./variants"

export function Alert({
  variant = "default",
  title,
  description,
  children,
  className,
  dismissible = false,
  onClose,
  id,
  ...props
}: AlertProps) {
  const Icon = variantIcons[variant]
  const variantClass = alertVariantClasses[variant]
  const isAssertive = variant === "error" || variant === "warning"

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 pl-11 transition-opacity",
        variantClass,
        className
      )}
      role={isAssertive ? "alert" : undefined}
      aria-live={isAssertive ? "assertive" : "polite"}
      aria-atomic="true"
      id={id}
      {...props}
    >
      <Icon className="absolute left-4 top-4 h-5 w-5" aria-hidden="true" />
      <div>
        {title && <h4 className="font-semibold">{title}</h4>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-sm text-gray-500 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label="Fermer l’alerte"
        >
          ✕
        </button>
      )}
    </div>
  )
}