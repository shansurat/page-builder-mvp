'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange(false)}
          />
        </div>
      )}
    </DialogContext.Provider>
  )
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error('DialogTrigger must be used within Dialog')

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>, {
        ...props,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          context.onOpenChange(true);
          (children.props as React.ButtonHTMLAttributes<HTMLButtonElement>).onClick?.(e)
        },
      })
    }

    return (
      <button
        ref={ref}
        onClick={() => context.onOpenChange(true)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DialogTrigger.displayName = 'DialogTrigger'

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error('DialogContent must be used within Dialog')
    
    if (!context.open) return null

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg pointer-events-auto',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, children, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogFooter = ({ className, children, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-lg font-semibold text-gray-900', className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-500', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
