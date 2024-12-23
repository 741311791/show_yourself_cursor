import { cn } from "@/lib/utils"

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({ className, children, ...props }: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-20 w-20 items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 
      className={cn(
        "mt-4 text-lg font-semibold",
        className
      )}
      {...props}
    />
  )
}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mb-4 mt-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
} 