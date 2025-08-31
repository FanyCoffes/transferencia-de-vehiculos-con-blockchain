"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const router = useRouter()

  React.useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    router.push("/login")
  }

  if (currentUser) {
    return (
      <div
        className={cn(
          "bg-card text-card-foreground flex items-center justify-between rounded-xl border px-6 py-4 shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-sm">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">CUIL: {currentUser.cuil}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
