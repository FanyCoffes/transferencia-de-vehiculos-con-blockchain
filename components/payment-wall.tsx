"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, CreditCard, Shield, CheckCircle, Loader2 } from "lucide-react"

interface PaymentWallProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: () => void
  purchase: any
}

export function PaymentWall({ isOpen, onClose, onPaymentComplete, purchase }: PaymentWallProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"details" | "processing" | "completed">("details")

  if (!isOpen) return null

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep("processing")

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep("completed")
      setTimeout(() => {
        onPaymentComplete()
        onClose()
      }, 1500)
    }, 2000)
  }

  const totalAmount = Number.parseInt(purchase.price || "0")
  const platformFee = Math.round(totalAmount * 0.025) // 2.5% platform fee
  const taxes = Math.round(totalAmount * 0.08) // 8% taxes
  const fiscalDiscount = Math.round(taxes * 0.02) // 2% discount on taxes
  const finalAmount = totalAmount + platformFee + taxes - fiscalDiscount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {paymentStep === "details" && "Procesar Pago"}
            {paymentStep === "processing" && "Procesando Pago..."}
            {paymentStep === "completed" && "Pago Completado"}
          </CardTitle>
          {paymentStep === "details" && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentStep === "details" && (
            <>
              {/* Vehicle Details */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={purchase.vehicle.image || "/placeholder.svg"}
                    alt={`${purchase.vehicle.brand} ${purchase.vehicle.model}`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {purchase.vehicle.brand} {purchase.vehicle.model} {purchase.vehicle.year}
                    </p>
                    <p className="text-sm text-gray-600">Patente: {purchase.vehicle.plate}</p>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Desglose de Pago</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Precio del vehículo:</span>
                    <span>ARS {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisión plataforma (2.5%):</span>
                    <span>ARS {platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos (8%):</span>
                    <span>ARS {taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Descuento fiscal (2% sobre impuestos):</span>
                    <span>-ARS {fiscalDiscount.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total a pagar:</span>
                    <span>ARS {finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Pago Seguro</span>
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Transacción protegida por blockchain</li>
                  <li>• Documentos NFT verificados automáticamente</li>
                  <li>• Transferencia inmediata tras confirmación</li>
                </ul>
              </div>

              <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isProcessing}>
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar ARS {finalAmount.toLocaleString()}
              </Button>
            </>
          )}

          {paymentStep === "processing" && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium text-gray-900 mb-2">Procesando pago...</p>
              <p className="text-sm text-gray-600">Verificando transacción en blockchain</p>
            </div>
          )}

          {paymentStep === "completed" && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <p className="text-lg font-medium text-gray-900 mb-2">¡Pago Completado!</p>
              <p className="text-sm text-gray-600">Transfiriendo vehículo...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
