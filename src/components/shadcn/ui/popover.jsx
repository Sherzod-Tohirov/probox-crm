import * as React from "react"
import { createPortal } from "react-dom"
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react"

import { cn } from "@/lib/utils"

const PopoverContext = React.createContext(null)

function Popover({ children, open: controlledOpen, defaultOpen = false, onOpenChange }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    placement: "bottom-start",
  })

  const click = useClick(floating.context)
  const dismiss = useDismiss(floating.context)
  const interactions = useInteractions([click, dismiss])

  return (
    <PopoverContext.Provider value={{ open, setOpen, floating, interactions }}>
      {children}
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ children, asChild = false, ...props }, ref) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) return null

  const { refs } = ctx.floating
  const triggerProps = ctx.interactions.getReferenceProps(props)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...triggerProps,
      ref: (node) => {
        refs.setReference(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
    })
  }

  return (
    <button
      ref={(node) => {
        refs.setReference(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      {...triggerProps}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, sideOffset = 4, style, ...props }, ref) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx || !ctx.open) return null

  const { refs, floatingStyles } = ctx.floating
  const content = (
    <div
      ref={(node) => {
        refs.setFloating(node)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={cn(
        "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
        className
      )}
      style={{
        ...floatingStyles,
        marginTop: sideOffset,
        ...style,
      }}
      {...ctx.interactions.getFloatingProps(props)}
    />
  )

  return createPortal(content, document.body)
})
PopoverContent.displayName = "PopoverContent"

const PopoverAnchor = React.forwardRef(function PopoverAnchor(_, ref) {
  return <span ref={ref} />
})

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
