"use client"

import { Header } from "@/components/header"
import { CostCalculator } from "@/components/cost-calculator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, Shield, Home } from "lucide-react"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold">Calculadora de Costos</h1>
            <p className="text-slate-300">Simula costos de transferencia blockchain</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Costos</h1>
            <p className="text-gray-600">Simula los costos de transferencia antes de iniciar el proceso</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Cálculo Preciso</h3>
              <p className="text-sm text-gray-600">Todos los impuestos y aranceles incluidos según normativa vigente</p>
            </Card>

            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Precios de Mercado</h3>
              <p className="text-sm text-gray-600">Comparación automática con valores oficiales actualizados</p>
            </Card>

            <Card className="p-6 text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Auditoría Automática</h3>
              <p className="text-sm text-gray-600">Detección de precios sospechosos para prevenir evasión</p>
            </Card>
          </div>

          <CostCalculator />
        </div>
      </div>
    </div>
  )
}
