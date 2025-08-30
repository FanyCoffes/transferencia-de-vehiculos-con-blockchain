"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DollarSign, AlertCircle, TrendingUp, Calculator, Info } from "lucide-react"

// Mock market prices database
const marketPrices = {
  "Toyota Corolla 2020": 4500000,
  "Honda CB600F 2019": 4500000,
}

interface CostCalculatorProps {
  vehicle?: {
    brand: string
    model: string
    year: number
    type: string
  }
  onPriceChange?: (price: string, method: string) => void
  hideDeclarePriceForExternal?: boolean
}

export function CostCalculator({ vehicle, onPriceChange, hideDeclarePriceForExternal }: CostCalculatorProps) {
  const [declaredPrice, setDeclaredPrice] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("platform")
  const [showComparison, setShowComparison] = useState(false)

  const vehicleKey = vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : ""
  const marketPrice = marketPrices[vehicleKey as keyof typeof marketPrices] || 0
  const declaredPriceNum = Number.parseInt(declaredPrice) || 0

  useEffect(() => {
    if (paymentMethod === "external" && marketPrice > 0) {
      setDeclaredPrice(marketPrice.toString())
    }
  }, [paymentMethod, marketPrice])

  // Calculate costs based on payment method
  const calculateCosts = () => {
    if (!declaredPriceNum) return null

    const basePrice = paymentMethod === "platform" ? declaredPriceNum : marketPrice
    const transferTax = basePrice * 0.015
    const registrationFee = 2500
    const blockchainFee = 1000

    const platformFee = 0 // No commission for platform payments
    const totalTaxes = transferTax + registrationFee + blockchainFee
    const fiscalDiscount = paymentMethod === "platform" ? totalTaxes * 0.02 : 0

    const subtotal = basePrice + transferTax + registrationFee + blockchainFee + platformFee
    const total = subtotal - fiscalDiscount

    return {
      basePrice,
      transferTax,
      registrationFee,
      blockchainFee,
      platformFee,
      fiscalDiscount,
      totalTaxes,
      subtotal,
      total,
    }
  }

  const costs = calculateCosts()
  const priceDifference = marketPrice && declaredPriceNum ? ((declaredPriceNum - marketPrice) / marketPrice) * 100 : 0
  const isSuspiciouslyLow = priceDifference < -30
  const isSuspiciouslyHigh = priceDifference > 50

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(declaredPrice, paymentMethod)
    }
  }, [declaredPrice, paymentMethod, onPriceChange])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      setDeclaredPrice(value)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Calculadora de Costos</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {!(paymentMethod === "external" && hideDeclarePriceForExternal) && (
            <div>
              <Label htmlFor="declared-price">Precio Declarado (ARS)</Label>
              <Input
                id="declared-price"
                type="text"
                inputMode="numeric"
                placeholder="Ingrese el precio"
                value={declaredPrice}
                onChange={handlePriceChange}
                className="mt-1"
                autoComplete="off"
                disabled={paymentMethod === "external"}
              />
              {marketPrice > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Ver precio de mercado
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className={paymentMethod === "external" && hideDeclarePriceForExternal ? "md:col-span-2" : ""}>
            <Label>Método de Pago</Label>
            <div className="mt-2 space-y-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="platform"
                  checked={paymentMethod === "platform"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Dentro de la plataforma</span>
                  <p className="text-sm text-gray-600">Sin comisión + descuento fiscal del 2%</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="external"
                  checked={paymentMethod === "external"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium">Fuera de la plataforma</span>
                  <p className="text-sm text-gray-600">Usa precio de mercado oficial para impuestos</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {paymentMethod === "external" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Pago Fuera de la Plataforma</h4>
            </div>
            <p className="text-blue-700 text-sm mb-2">
              Al seleccionar pago externo, los impuestos se calculan automáticamente sobre el precio de mercado oficial.
            </p>
            <p className="text-blue-700 text-sm">
              <strong>Precio de mercado oficial:</strong> ARS {marketPrice.toLocaleString()}
            </p>
          </div>
        )}

        {/* Market price comparison */}
        {showComparison && marketPrice > 0 && paymentMethod === "platform" && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Comparación con Mercado</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Precio de mercado:</span>
                <p className="font-semibold">ARS {marketPrice.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Precio declarado:</span>
                <p className="font-semibold">ARS {declaredPriceNum.toLocaleString()}</p>
              </div>
            </div>
            {Math.abs(priceDifference) > 5 && (
              <div className="mt-3">
                <Badge variant={priceDifference > 0 ? "destructive" : "secondary"}>
                  {priceDifference > 0 ? "+" : ""}
                  {priceDifference.toFixed(1)}% vs mercado
                </Badge>
              </div>
            )}
          </Card>
        )}

        {/* Price alerts - only for platform payments */}
        {paymentMethod === "platform" && isSuspiciouslyLow && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">Auditoría Automática Iniciada</h4>
            </div>
            <p className="text-yellow-700 text-sm">
              El precio declarado es {Math.abs(priceDifference).toFixed(1)}% menor al valor de mercado. Se ha iniciado
              una auditoría automática que puede demorar la transferencia.
            </p>
          </div>
        )}

        {paymentMethod === "platform" && isSuspiciouslyHigh && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Precio Elevado Detectado</h4>
            </div>
            <p className="text-orange-700 text-sm">
              El precio declarado es {priceDifference.toFixed(1)}% mayor al valor de mercado. Verifique que el precio
              sea correcto antes de continuar.
            </p>
          </div>
        )}

        {/* Cost breakdown */}
        {costs && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Desglose de Costos
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Precio base ({paymentMethod === "platform" ? "declarado" : "mercado"}):</span>
                <span>ARS {costs.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto a la transferencia (1.5%):</span>
                <span>ARS {costs.transferTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Arancel registral:</span>
                <span>ARS {costs.registrationFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Verificación blockchain:</span>
                <span>ARS {costs.blockchainFee.toLocaleString()}</span>
              </div>
              {costs.fiscalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento fiscal sobre impuestos (2%):</span>
                  <span>-ARS {costs.fiscalDiscount.toLocaleString()}</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total a pagar:</span>
                <span>ARS {costs.total.toLocaleString()}</span>
              </div>
            </div>

            {paymentMethod === "platform" && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  <strong>Beneficio:</strong> Al pagar dentro de la plataforma no hay comisiones y obtienes un descuento
                  fiscal del 2% sobre los impuestos y aranceles.
                </p>
              </div>
            )}

            {paymentMethod === "external" && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Al pagar fuera de la plataforma, los impuestos se calculan sobre el precio de
                  mercado oficial (ARS {marketPrice.toLocaleString()}). Las partes pueden acordar cualquier precio para
                  la transacción externa.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
