"use client"

import { Header } from "@/components/header"
import { ClaimsManagement } from "@/components/claims-management"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function ClaimsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold">Gestión de Reclamos</h1>
            <p className="text-slate-300">Sistema de disputas blockchain inmutable</p>
          </div>

          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="hover:scale-105 transition-transform duration-200 bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Reclamos</h1>
            <p className="text-gray-600">Sistema de resolución de disputas registrado en blockchain</p>
          </div>
          <ClaimsManagement />
        </div>
      </div>
    </div>
  )
}
