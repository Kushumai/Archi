"use client"

import * as React from "react"
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

export const AlertDialog = RadixAlertDialog.Root
export const AlertDialogTrigger = RadixAlertDialog.Trigger
export const AlertDialogCancel = RadixAlertDialog.Cancel
export const AlertDialogAction = RadixAlertDialog.Action

export const AlertDialogPortal = RadixAlertDialog.Portal

export const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof RadixAlertDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = RadixAlertDialog.Overlay.displayName

export const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof RadixAlertDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Portal>
    <AlertDialogOverlay />
    <RadixAlertDialog.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full max-w-lg translate-y-[-50%] translate-x-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg sm:rounded-lg top-1/2 left-1/2",
        className
      )}
      {...props}
    />
  </RadixAlertDialog.Portal>
))
AlertDialogContent.displayName = RadixAlertDialog.Content.displayName

export const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

export const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

export const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof RadixAlertDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-neutral-900", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = RadixAlertDialog.Title.displayName

export const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof RadixAlertDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = RadixAlertDialog.Description.displayName
