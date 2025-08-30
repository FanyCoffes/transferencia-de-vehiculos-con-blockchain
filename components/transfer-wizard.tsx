"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CostCalculator } from "@/components/cost-calculator"
import { NFTTransferAnimation } from "@/components/nft-transfer-animation"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Car,
  Bike,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  PenTool,
  ArrowRight,
  ArrowLeft,
  Shield,
  User,
  Database,
  CreditCard,
  UserCheck,
  Zap,
  Lock,
  Send,
  Home,
} from "lucide-react"
import { useRouter } from "next/navigation"

const vehicleData = {
  "car-1": {
    id: "car-1",
    type: "car",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    plate: "ABC123",
    owner: "Francisco Pérez",
    image: "/toyota-corolla-2020.png",
    marketValue: 4500000, // ARS
    documents: {
      policeVerification: {
        status: "valid",
        date: "2024-08-15",
        description: "Verificación física realizada. Funcionario cargó resultado directamente en la red.",
        nftHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        blockNumber: 18234567,
      },
      digitalTitle: {
        status: "valid",
        date: "2024-08-20",
        description: "NFT oficial emitido por el Registro. Se actualiza automáticamente tras transferencia.",
        nftHash: "0x9876543210fedcba0987654321abcdef",
        blockNumber: 18234890,
      },
      domainReport: {
        status: "valid",
        date: "2024-08-18",
        description: "Emitido por el Registro. Asociado al NFT del vehículo.",
        nftHash: "0xabcdef1234567890fedcba0987654321",
        blockNumber: 18234723,
      },
      debtFree: {
        status: "valid",
        date: "2024-08-22",
        description: "Generado automáticamente desde AFIP/provincia/municipio.",
        nftHash: "0x567890abcdef1234567890abcdef1234",
        blockNumber: 18235012,
      },
    },
  },
  "bike-1": {
    id: "bike-1",
    type: "bike",
    brand: "Honda",
    model: "CB600F",
    year: 2019,
    plate: "XYZ789",
    owner: "Constanza García",
    image: "/honda-cb600f-motorcycle.png",
    marketValue: 2800000, // ARS
    documents: {
      policeVerification: {
        status: "missing",
        date: null,
        description: "Pendiente: Se hace físicamente con el vehículo presente.",
        nftHash: null,
        blockNumber: null,
      },
      digitalTitle: {
        status: "valid",
        date: "2024-07-10",
        description: "NFT oficial emitido por el Registro. Asociado al dueño actual.",
        nftHash: "0x1111222233334444555566667777888",
        blockNumber: 18201234,
      },
      domainReport: {
        status: "valid",
        date: "2024-07-12",
        description: "Emitido por el Registro. Siempre accesible desde Garage Virtual.",
        nftHash: "0x8888777766665555444433332222111",
        blockNumber: 18201456,
      },
      debtFree: {
        status: "missing",
        date: null,
        description: "Pendiente: Validación automática desde organismos oficiales.",
        nftHash: null,
        blockNumber: null,
      },
    },
  },
}

const documentLabels = {
  policeVerification: "Verificación Policial",
  digitalTitle: "Título Digital del Automotor",
  domainReport: "Informe de Dominio",
  debtFree: "Libre Deuda de Patentes y Multas",
}

const documentIcons = {
  policeVerification: UserCheck,
  digitalTitle: FileText,
  domainReport: Database,
  debtFree: CreditCard,
}

const steps = [
  { id: 1, name: "Selección", description: "Vendedor inicia operación", icon: Car },
  { id: 2, name: "Documentos NFT", description: "Smart contract valida", icon: Shield },
  { id: 3, name: "Costos", description: "Desglose automático", icon: DollarSign },
  { id: 4, name: "Firma Vendedor", description: "Vendedor firma y envía", icon: PenTool },
  { id: 5, name: "Transferencia", description: "NFT se transfiere", icon: Zap },
]

interface TransferWizardProps {
  vehicleId: string
}

export function TransferWizard({ vehicleId }: TransferWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [buyerCuil, setBuyerCuil] = useState("")
  const [declaredPrice, setDeclaredPrice] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("platform")
  const [transferComplete, setTransferComplete] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [smartContractValidated, setSmartContractValidated] = useState(false)
  const [sellerSigned, setSellerSigned] = useState(false)
  const router = useRouter()

  const vehicle = vehicleData[vehicleId as keyof typeof vehicleData]

  if (!vehicle) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vehículo no encontrado</h2>
        <p className="text-gray-600">El vehículo solicitado no existe en el sistema blockchain.</p>
        <Button onClick={() => router.push("/")} className="mt-4 hover:scale-105 transition-transform duration-200">
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </Card>
    )
  }

  const getDocumentStatus = (documents: any) => {
    const total = Object.keys(documents).length
    const valid = Object.values(documents).filter((doc: any) => doc.status === "valid").length
    return { valid, total, isComplete: valid === total }
  }

  const docStatus = getDocumentStatus(vehicle.documents)
  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      if (currentStep === 1 && docStatus.isComplete) {
        setTimeout(() => setSmartContractValidated(true), 1000)
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const signAndSendToBuyer = () => {
    if (!buyerCuil.trim()) {
      alert("Debe ingresar el CUIL del comprador")
      return
    }

    setIsProcessing(true)

    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const sellerCuil = userData.cuil

    const pendingPurchase = {
      id: `transfer-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicle: vehicle,
      buyerCuil: buyerCuil,
      sellerCuil: sellerCuil, // Added seller CUIL for cross-referencing in sales section
      seller: vehicle.owner,
      price: declaredPrice,
      paymentMethod: paymentMethod,
      date: new Date().toISOString(),
      status: "pending_buyer_signature",
      sellerSigned: true,
    }

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")
    if (!globalPendingPurchases[buyerCuil]) {
      globalPendingPurchases[buyerCuil] = []
    }
    globalPendingPurchases[buyerCuil].push(pendingPurchase)
    localStorage.setItem("globalPendingPurchases", JSON.stringify(globalPendingPurchases))

    console.log("[v0] Pending purchase stored for buyer CUIL:", buyerCuil, pendingPurchase)

    setTimeout(() => {
      setIsProcessing(false)
      setSellerSigned(true)
    }, 2000)
  }

  const completeTransfer = () => {
    setIsProcessing(true)
    const purchaseData = {
      vehicleId: vehicle.id,
      vehicle: vehicle,
      buyerCuil: buyerCuil,
      seller: vehicle.owner,
      price: declaredPrice,
      paymentMethod: paymentMethod,
      date: new Date().toISOString(),
      status: "completed",
    }

    const existingPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    existingPurchases.push(purchaseData)
    localStorage.setItem("purchases", JSON.stringify(existingPurchases))

    setTimeout(() => {
      setIsProcessing(false)
      setShowAnimation(true)
    }, 2000)
  }

  const onAnimationComplete = () => {
    setTransferComplete(true)
    setCurrentStep(5)
    setShowAnimation(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 text-white px-6 py-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Transferencia de Vehículo</h1>
        <p className="text-slate-300">Sistema blockchain con smart contracts</p>
      </div>

      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="hover:scale-105 transition-transform duration-200 bg-transparent"
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          Transferencia Blockchain de Vehículo
        </h1>
        <p className="text-gray-600">Sistema automatizado con smart contracts y documentos NFT</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso del Flujo</span>
            <span className="text-sm text-gray-500">
              {currentStep} de {steps.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4 transition-all duration-500 ease-out" />
        </div>

        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const isDisabled = currentStep < step.id

            return (
              <div key={step.id} className="flex flex-col items-center text-center max-w-[120px]">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 text-white shadow-lg scale-110"
                      : isActive
                        ? "bg-blue-500 text-white shadow-md scale-105 animate-pulse"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 mb-1 ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
                <span className="text-xs text-gray-400">{step.description}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-600" />
              Vendedor Inicia la Operación desde su Garage Virtual
            </h2>
            <div className="flex gap-6">
              <img
                src={vehicle.image || "/placeholder.svg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-48 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {vehicle.type === "car" ? <Car className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                  <h3 className="text-xl font-semibold">
                    {vehicle.brand} {vehicle.model} {vehicle.year}
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">Patente: {vehicle.plate}</p>
                <p className="text-gray-600 mb-2">Propietario actual: {vehicle.owner}</p>
                <p className="text-sm text-blue-600 font-medium mb-4">
                  Valor de Mercado: ${vehicle.marketValue.toLocaleString("es-AR")} ARS
                </p>

                <div className="mb-4">
                  <Label htmlFor="buyer-cuil">CUIL del comprador *</Label>
                  <Input
                    id="buyer-cuil"
                    type="text"
                    placeholder="20-12345678-9"
                    value={buyerCuil}
                    onChange={(e) => setBuyerCuil(e.target.value)}
                    className="mt-1"
                    maxLength={13}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Obligatorio: El comprador recibirá la solicitud de compra-venta en su sección "Mis Compras" para
                    revisar documentos y firmar
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Sistema Recupera Automáticamente Todos los Documentos NFT
            </h2>

            <div
              className={`border rounded-lg p-4 mb-6 transition-all duration-500 ${
                smartContractValidated ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock className={`w-5 h-5 ${smartContractValidated ? "text-green-600" : "text-blue-600"}`} />
                <h3 className={`font-semibold ${smartContractValidated ? "text-green-800" : "text-blue-800"}`}>
                  {smartContractValidated ? "Smart Contract Validado ✅" : "Validando Smart Contract..."}
                </h3>
              </div>
              <p className={`text-sm ${smartContractValidated ? "text-green-700" : "text-blue-700"}`}>
                {smartContractValidated
                  ? "Todos los documentos NFT han sido verificados automáticamente en la blockchain."
                  : "Verificando automáticamente la validez de todos los documentos NFT..."}
              </p>
            </div>

            {!docStatus.isComplete && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">Documentación Incompleta - Transferencia Bloqueada</h3>
                </div>
                <p className="text-red-700 mb-3">
                  El smart contract ha detectado documentos faltantes. No es posible continuar hasta regularizar la
                  situación.
                </p>
                <p className="text-sm text-red-600">
                  ⚠️ No hay forma de ocultar deudas o inhibiciones - todo está registrado en blockchain.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {Object.entries(vehicle.documents).map(([key, doc]: [string, any]) => {
                const IconComponent = documentIcons[key as keyof typeof documentIcons]

                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                      doc.status === "valid" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {doc.status === "valid" ? (
                          <CheckCircle className="w-6 h-6 text-green-600 animate-pulse" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          <h4 className="font-medium text-gray-900">
                            {documentLabels[key as keyof typeof documentLabels]}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        {doc.status === "valid" ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                              Emitido: {new Date(doc.date).toLocaleDateString("es-AR")}
                            </p>
                            <p className="text-xs text-blue-600 font-mono">NFT: {doc.nftHash.substring(0, 20)}...</p>
                            <p className="text-xs text-gray-500">Bloque: #{doc.blockNumber.toLocaleString()}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-red-600 font-medium">❌ Documento requerido para continuar</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {docStatus.isComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Comprador Puede Revisar Documentos en Línea</h3>
                </div>
                <p className="text-green-700 text-sm">
                  ✅ Todos los documentos NFT están verificados y disponibles para revisión transparente.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && docStatus.isComplete && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Desglose Automático de Costos
            </h2>

            <CostCalculator
              vehicle={vehicle}
              onPriceChange={(price, method) => {
                setDeclaredPrice(price)
                setPaymentMethod(method)
              }}
              hideDeclarePriceForExternal={paymentMethod === "external"}
            />
          </div>
        )}

        {currentStep === 4 && docStatus.isComplete && !showAnimation && !sellerSigned && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <PenTool className="w-6 h-6 text-blue-600" />
              Vendedor Firma y Envía Solicitud al Comprador
            </h2>

            <div className="mb-6">
              <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Firma del Vendedor</h3>
                </div>
                <p className="text-gray-600 mb-4">{vehicle.owner}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Resumen de la Operación</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>
                      Vehículo: {vehicle.brand} {vehicle.model} - {vehicle.plate}
                    </p>
                    <p>Comprador CUIL: {buyerCuil}</p>
                    <p>Precio declarado: ${Number.parseInt(declaredPrice || "0").toLocaleString("es-AR")} ARS</p>
                    <p>
                      Método de pago:{" "}
                      {paymentMethod === "platform" ? "Dentro de la plataforma" : "Fuera de la plataforma"}
                    </p>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="text-center py-4">
                    <LoadingSpinner size="md" text="Enviando solicitud al comprador..." />
                  </div>
                ) : (
                  <Button
                    onClick={signAndSendToBuyer}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Firmar y Enviar Solicitud de Compra-Venta
                  </Button>
                )}
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Próximo Paso</h3>
              </div>
              <p className="text-yellow-700 text-sm">
                Una vez que firmes, el comprador recibirá la solicitud en su sección "Mis Compras" donde podrá revisar
                todos los documentos NFT y firmar el contrato.
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && sellerSigned && !showAnimation && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Solicitud Enviada al Comprador
            </h2>

            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">¡Solicitud Enviada Exitosamente!</h3>
              <p className="text-gray-600">El comprador ha recibido la solicitud de compra-venta</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-green-800 mb-3">¿Qué sucede ahora?</h4>
              <div className="space-y-2 text-sm text-green-700">
                <p>✅ Tu firma ha sido registrada en la blockchain</p>
                <p>📧 El comprador (CUIL: {buyerCuil}) recibió la notificación</p>
                <p>📋 Puede revisar todos los documentos NFT desde su garage virtual</p>
                <p>✍️ Una vez que firme, se iniciará el proceso de pago</p>
                <p>🔄 La transferencia se completará automáticamente tras confirmar el pago</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Proceso Seguro</h4>
              </div>
              <p className="text-blue-700 text-sm">
                {paymentMethod === "platform"
                  ? "El pago se procesará automáticamente dentro de la plataforma una vez que ambos firmen."
                  : "Recibirás una notificación para confirmar el pago externo y completar la transferencia."}
              </p>
            </div>
          </div>
        )}

        {showAnimation && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Transfiriendo NFT del Vehículo
            </h2>
            <NFTTransferAnimation vehicle={vehicle} buyerCuil={buyerCuil} onAnimationComplete={onAnimationComplete} />
          </div>
        )}

        {currentStep === 5 && transferComplete && (
          <div className="text-center">
            <div className="mb-6">
              <div className="relative">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-green-200 rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-green-800 mb-2">¡Transferencia Blockchain Completada!</h2>
              <p className="text-gray-600">El NFT del vehículo ha sido transferido automáticamente al comprador</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-green-800 mb-3">Resumen de la Transferencia</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vehículo:</span>
                  <span>
                    {vehicle.brand} {vehicle.model} - {vehicle.plate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Vendedor:</span>
                  <span>{vehicle.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comprador:</span>
                  <span>CUIL: {buyerCuil}</span>
                </div>
                <div className="flex justify-between">
                  <span>Método de Pago:</span>
                  <span>{paymentMethod === "platform" ? "Dentro de la plataforma" : "Fuera del sistema"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hash de transacción:</span>
                  <span className="font-mono text-xs">
                    0x7f9a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bloque:</span>
                  <span>#{(18235000 + Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Button className="hover:scale-105 transition-transform duration-200">
                <FileText className="w-4 h-4 mr-2" />
                Descargar Certificado Digital
              </Button>
              <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
                <Shield className="w-4 h-4 mr-2" />
                Ver en Blockchain Explorer
              </Button>
            </div>

            <Button
              onClick={() => router.push("/")}
              className="w-full mt-4 hover:scale-105 transition-transform duration-200"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        )}

        {!showAnimation && !sellerSigned && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="hover:scale-105 transition-transform duration-200 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 4 && (
              <Button
                onClick={nextStep}
                disabled={(currentStep === 2 && !docStatus.isComplete) || (currentStep === 1 && !buyerCuil.trim())}
                className="hover:scale-105 transition-transform duration-200"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
