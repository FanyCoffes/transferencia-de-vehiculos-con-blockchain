"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { QuickActions } from "@/components/quick-actions"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <QuickActions />
    </div>
  )
}
