"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Car, Bike, ArrowRight, User, Sparkles } from "lucide-react"

interface NFTTransferAnimationProps {
  vehicle: {
    brand: string
    model: string
    plate: string
    type: string
    image: string
    owner: string
  }
  buyerEmail: string
  onAnimationComplete?: () => void
}

export function NFTTransferAnimation({ vehicle, buyerEmail, onAnimationComplete }: NFTTransferAnimationProps) {
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    const stages = [
      { delay: 0, stage: 0 }, // Initial state
      { delay: 1000, stage: 1 }, // Start moving
      { delay: 2000, stage: 2 }, // Mid transfer
      { delay: 3000, stage: 3 }, // Complete transfer
      { delay: 4000, stage: 4 }, // Final celebration
    ]

    stages.forEach(({ delay, stage }) => {
      setTimeout(() => setAnimationStage(stage), delay)
    })

    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 4500)
    }
  }, [onAnimationComplete])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-6">
      <div className="flex justify-between items-center relative">
        {/* Seller side */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900">Vendedor</h4>
          <p className="text-sm text-gray-600">{vehicle.owner}</p>
        </div>

        {/* NFT Vehicle Card */}
        <div className="relative">
          <div
            className={`transition-all duration-1000 ease-in-out transform ${
              animationStage === 0
                ? "translate-x-0 scale-100"
                : animationStage === 1
                  ? "translate-x-8 scale-105"
                  : animationStage === 2
                    ? "translate-x-16 scale-110"
                    : animationStage === 3
                      ? "translate-x-24 scale-105"
                      : "translate-x-32 scale-100"
            }`}
          >
            <Card
              className={`p-4 w-48 border-2 ${
                animationStage >= 3 ? "border-green-300 bg-green-50" : "border-blue-300 bg-blue-50"
              } shadow-lg`}
            >
              <div className="relative">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-24 object-cover rounded mb-3"
                />
                {animationStage >= 1 && (
                  <div className="absolute -top-2 -right-2">
                    <Sparkles
                      className={`w-6 h-6 ${animationStage >= 3 ? "text-green-500" : "text-blue-500"} animate-pulse`}
                    />
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {vehicle.type === "car" ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                  <span className="font-semibold text-sm">
                    {vehicle.brand} {vehicle.model}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{vehicle.plate}</p>
                <div className="mt-2 px-2 py-1 bg-purple-100 rounded text-xs font-medium text-purple-800">
                  NFT #{vehicle.plate}
                </div>
              </div>
            </Card>
          </div>

          {/* Transfer arrow */}
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-4">
            <ArrowRight
              className={`w-8 h-8 transition-all duration-500 ${
                animationStage >= 1 ? "text-green-500 animate-pulse" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Buyer side */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${
              animationStage >= 3 ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <User
              className={`w-8 h-8 transition-colors duration-500 ${
                animationStage >= 3 ? "text-green-600" : "text-gray-600"
              }`}
            />
          </div>
          <h4 className="font-semibold text-gray-900">Comprador</h4>
          <p className="text-sm text-gray-600">{buyerEmail}</p>
        </div>
      </div>

      {/* Status text */}
      <div className="text-center mt-6">
        <p
          className={`text-sm font-medium transition-colors duration-500 ${
            animationStage === 0
              ? "text-gray-600"
              : animationStage === 1
                ? "text-blue-600"
                : animationStage === 2
                  ? "text-purple-600"
                  : animationStage === 3
                    ? "text-green-600"
                    : "text-green-700"
          }`}
        >
          {animationStage === 0 && "Iniciando transferencia NFT..."}
          {animationStage === 1 && "Verificando en blockchain..."}
          {animationStage === 2 && "Transfiriendo propiedad..."}
          {animationStage === 3 && "¡Transferencia completada!"}
          {animationStage === 4 && "¡NFT transferido exitosamente!"}
        </p>
      </div>

      {/* Blockchain particles effect */}
      {animationStage >= 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-blue-400 rounded-full animate-ping`}
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
