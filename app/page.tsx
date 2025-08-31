"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { QuickActions } from "@/components/quick-actions"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <QuickActions />
    </div>
  )
}
