"use client"

import * as React from "react"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"

const PanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
PanelGroup.displayName = "PanelGroup"

const Panel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.Panel
    ref={ref}
    className={cn("relative h-full", className)}
    {...props}
  />
))
Panel.displayName = "Panel"

const PanelResizeHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelResizeHandle> & {
    isDragging?: boolean
    onDragging?: (isDragging: boolean) => void
  }
>(({ className, isDragging, onDragging, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    {...props}
    onDragging={onDragging}
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-4 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
  >
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-4 w-4 items-center justify-center rounded-sm border bg-border",
        isDragging && "bg-accent"
      )}
    >
      <DragHandleDots2Icon className="h-2.5 w-2.5" />
    </div>
  </ResizablePrimitive.PanelResizeHandle>
))
PanelResizeHandle.displayName = "PanelResizeHandle"

export { Panel, PanelGroup, PanelResizeHandle } 