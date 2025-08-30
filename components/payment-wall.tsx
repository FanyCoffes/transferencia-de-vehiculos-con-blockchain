"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, Lock, CheckCircle, X } from "lucide-react"

interface PaymentWallProps {
  purchase: any
  onPaymentComplete: () => void
  onCancel: () => void
}

export function PaymentWall({ purchase, onPaymentComplete, onCancel }: PaymentWallProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onPaymentComplete()
    setIsProcessing(false)
  }

  const vehicle = purchase.vehicle
  const totalAmount = purchase.price

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Procesamiento de Pago</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Pago Seguro - Blockchain</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Vehículo a Transferir</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">
                  {vehicle.brand} {vehicle.model}
                </span>{" "}
                ({vehicle.year})
              </p>
              <p className="text-sm text-gray-600">Patente: {vehicle.plate}</p>
              <p className="text-sm text-gray-600">Vendedor: {purchase.seller}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Precio del vehículo:</span>
              <span className="font-medium">ARS {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Comisión plataforma:</span>
              <span className="font-medium text-green-600">ARS 0 (Sin costo)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Descuento fiscal:</span>
              <span className="font-medium text-green-600">Incluido</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total a pagar:</span>
              <span className="text-blue-600">ARS {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Método de Pago</span>
            </div>
            <p className="text-sm text-blue-600">Pago seguro dentro de la plataforma</p>
            <div className="flex items-center gap-2 mt-2">
              <Lock className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600">Protegido por blockchain</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando Pago...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Confirmar Pago - ARS {totalAmount.toLocaleString()}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Transacción registrada en blockchain</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Tu pago está protegido por smart contracts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
