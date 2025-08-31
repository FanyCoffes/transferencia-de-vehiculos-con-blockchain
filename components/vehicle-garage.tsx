"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Bike,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Database,
  CreditCard,
  UserCheck,
  ShoppingCart,
  Calendar,
  User,
  Home,
  AlertTriangle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { PaymentWall } from "@/components/payment-wall"

const vehicleData = {
  fran: [
    {
      id: "car-1",
      type: "car",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      plate: "ABC123",
      image: "/toyota-corolla-2020.png",
      marketValue: 4500000, // ARS - consistent with homepage
      documents: {
        policeVerification: {
          status: "valid",
          date: "2024-08-15",
          description: "Verificación física realizada. Funcionario cargó resultado en la red.",
          nftHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        },
        digitalTitle: {
          status: "valid",
          date: "2024-08-20",
          description: "NFT oficial emitido por el Registro. Asociado al dueño actual.",
          nftHash: "0x9876543210fedcba0987654321abcdef",
        },
        domainReport: {
          status: "valid",
          date: "2024-08-18",
          description: "Emitido por el Registro. Siempre accesible desde Garage Virtual.",
          nftHash: "0xabcdef1234567890fedcba0987654321",
        },
        debtFree: {
          status: "valid",
          date: "2024-08-22",
          description: "Generado automáticamente desde AFIP/provincia/municipio.",
          nftHash: "0x567890abcdef1234567890abcdef1234",
        },
      },
    },
  ],
  coty: [
    {
      id: "bike-1",
      type: "bike",
      brand: "Honda",
      model: "CB600F",
      year: 2019,
      plate: "XYZ789",
      image: "/honda-cb600f-motorcycle.png",
      marketValue: 2800000, // ARS - consistent reference value
      documents: {
        policeVerification: {
          status: "missing",
          date: null,
          description: "Pendiente: Verificación física con el vehículo presente.",
          nftHash: null,
        },
        digitalTitle: {
          status: "valid",
          date: "2024-07-10",
          description: "NFT oficial emitido por el Registro. Asociado al dueño actual.",
          nftHash: "0x1111222233334444555566667777888",
        },
        domainReport: {
          status: "valid",
          date: "2024-07-12",
          description: "Emitido por el Registro. Siempre accesible desde Garage Virtual.",
          nftHash: "0x8888777766665555444433332222111",
        },
        debtFree: {
          status: "missing",
          date: null,
          description: "Pendiente: Validación automática desde organismos oficiales.",
          nftHash: null,
        },
      },
    },
  ],
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

interface VehicleGarageProps {
  currentUser: {
    id: string
    name: string
    username: string
    cuil: string
  }
}

export function VehicleGarage({ currentUser }: VehicleGarageProps) {
  const [showPaymentWall, setShowPaymentWall] = useState(false)
  const [selectedPurchaseForPayment, setSelectedPurchaseForPayment] = useState<any>(null)

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"owned" | "purchases" | "sales">("owned")
  const [purchases, setPurchases] = useState<any[]>([])
  const [pendingPurchases, setPendingPurchases] = useState<any[]>([])
  const [pendingSales, setPendingSales] = useState<any[]>([])
  const [completedSales, setCompletedSales] = useState<any[]>([])
  const router = useRouter()

  const hardcodedVehicles = vehicleData[currentUser.id as keyof typeof vehicleData] || []
  const purchasedVehicles = JSON.parse(localStorage.getItem(`ownedVehicles_${currentUser.cuil}`) || "[]")
  const soldVehicleIds = JSON.parse(localStorage.getItem(`soldVehicles_${currentUser.cuil}`) || "[]").map(
    (v: any) => v.id,
  )

  const availableHardcodedVehicles = hardcodedVehicles.filter((v: any) => !soldVehicleIds.includes(v.id))
  const vehicles = [...availableHardcodedVehicles, ...purchasedVehicles]

  const resetAllData = () => {
    localStorage.removeItem("globalPendingPurchases")
    localStorage.removeItem("purchases")
    localStorage.removeItem("globalPendingSales")

    setPurchases([])
    setPendingPurchases([])
    setPendingSales([])

    console.log("[v0] All purchases and sales data has been reset")
    alert("Datos reiniciados. Ahora puedes simular desde el inicio.")
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userCuil = userData.cuil

    console.log("[v0] Checking purchases for user CUIL:", userCuil)

    const storedPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
    const userPurchases = storedPurchases.filter(
      (purchase: any) => purchase.buyerCuil === userCuil && purchase.status === "completed",
    )
    setPurchases(userPurchases)

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")
    const userPendingPurchases = globalPendingPurchases[userCuil] || []
    setPendingPurchases(
      userPendingPurchases.filter(
        (p: any) => p.status === "pending_buyer_signature" || p.status === "signed_waiting_payment",
      ),
    )

    const allPendingSales = []
    for (const buyerCuil in globalPendingPurchases) {
      const buyerPurchases = globalPendingPurchases[buyerCuil]
      const sellerSales = buyerPurchases.filter((p: any) => p.sellerCuil === userCuil)
      allPendingSales.push(...sellerSales)
    }

    // Get completed sales from localStorage
    const completedSales = JSON.parse(localStorage.getItem("completedSales") || "[]")
    const userCompletedSales = completedSales.filter((sale: any) => sale.sellerCuil === userCuil)

    setPendingSales(allPendingSales)
    setCompletedSales(userCompletedSales)

    console.log("[v0] Found pending purchases:", userPendingPurchases)
    console.log("[v0] Found completed purchases:", userPurchases)
    console.log("[v0] Found pending sales:", allPendingSales)
    console.log("[v0] Found completed sales:", userCompletedSales)
  }, [currentUser])

  const signPurchase = (purchaseId: string) => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userCuil = userData.cuil

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")
    const userPendingPurchases = globalPendingPurchases[userCuil] || []

    const purchaseIndex = userPendingPurchases.findIndex((p: any) => p.id === purchaseId)
    if (purchaseIndex !== -1) {
      const purchase = userPendingPurchases[purchaseIndex]
      if (purchase.paymentMethod === "external") {
        purchase.status = "buyer_signed_waiting_payment_confirmation"
      } else {
        purchase.status = "signed_waiting_payment"
      }
      purchase.buyerSigned = true
      purchase.buyerSignedDate = new Date().toISOString()

      globalPendingPurchases[userCuil] = userPendingPurchases
      localStorage.setItem("globalPendingPurchases", JSON.stringify(globalPendingPurchases))

      setPendingPurchases([...userPendingPurchases])

      console.log("[v0] Purchase signed, waiting for payment:", purchase)
    }
  }

  const confirmPaymentSent = (purchaseId: string) => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userCuil = userData.cuil

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")
    const userPendingPurchases = globalPendingPurchases[userCuil] || []

    const purchaseIndex = userPendingPurchases.findIndex((p: any) => p.id === purchaseId)
    if (purchaseIndex !== -1) {
      const purchase = userPendingPurchases[purchaseIndex]
      purchase.status = "waiting_seller_payment_confirmation"
      purchase.buyerConfirmedPayment = true
      purchase.paymentConfirmedDate = new Date().toISOString()

      globalPendingPurchases[userCuil] = userPendingPurchases
      localStorage.setItem("globalPendingPurchases", JSON.stringify(globalPendingPurchases))

      setPendingPurchases([...userPendingPurchases])

      console.log("[v0] Buyer confirmed payment sent:", purchase)
      alert(
        "Pago confirmado. El vendedor recibirá una notificación para confirmar que recibió el pago y completar la transferencia.",
      )
    }
  }

  const processPurchasePayment = (purchaseId: string) => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userCuil = userData.cuil

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")
    const userPendingPurchases = globalPendingPurchases[userCuil] || []

    const purchaseIndex = userPendingPurchases.findIndex((p: any) => p.id === purchaseId)
    if (purchaseIndex !== -1) {
      const purchase = userPendingPurchases[purchaseIndex]
      purchase.status = "completed"
      purchase.paymentProcessed = true
      purchase.completedDate = new Date().toISOString()

      userPendingPurchases.splice(purchaseIndex, 1)
      globalPendingPurchases[userCuil] = userPendingPurchases
      localStorage.setItem("globalPendingPurchases", JSON.stringify(globalPendingPurchases))

      const completedPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
      completedPurchases.push(purchase)
      localStorage.setItem("purchases", JSON.stringify(completedPurchases))

      const completedSales = JSON.parse(localStorage.getItem("completedSales") || "[]")
      const completedSale = {
        ...purchase,
        saleCompletedDate: new Date().toISOString(),
        finalStatus: "completed",
      }
      completedSales.push(completedSale)
      localStorage.setItem("completedSales", JSON.stringify(completedSales))

      const buyerVehicles = JSON.parse(localStorage.getItem(`ownedVehicles_${userCuil}`) || "[]")
      const transferredVehicle = {
        ...purchase.vehicle,
        owner: userData.name,
        previousOwner: purchase.seller,
        transferDate: new Date().toISOString(),
        purchasePrice: purchase.price,
      }
      buyerVehicles.push(transferredVehicle)
      localStorage.setItem(`ownedVehicles_${userCuil}`, JSON.stringify(buyerVehicles))

      const sellerCuil = purchase.sellerCuil
      const sellerVehicles = JSON.parse(localStorage.getItem(`ownedVehicles_${sellerCuil}`) || "[]")
      const updatedSellerVehicles = sellerVehicles.filter((v: any) => v.id !== purchase.vehicle.id)
      localStorage.setItem(`ownedVehicles_${sellerCuil}`, JSON.stringify(updatedSellerVehicles))

      const soldVehicles = JSON.parse(localStorage.getItem(`soldVehicles_${sellerCuil}`) || "[]")
      soldVehicles.push({
        ...purchase.vehicle,
        soldTo: userData.name,
        soldToCuil: userCuil,
        saleDate: new Date().toISOString(),
        salePrice: purchase.price,
        saleId: purchase.id,
      })
      localStorage.setItem(`soldVehicles_${sellerCuil}`, JSON.stringify(soldVehicles))

      const sellerNotifications = JSON.parse(localStorage.getItem(`notifications_${purchase.sellerCuil}`) || "[]")
      sellerNotifications.push({
        id: `transfer_complete_${Date.now()}`,
        type: "transfer_completed",
        message: `¡Transferencia completada! El vehículo ${purchase.vehicle.brand} ${purchase.vehicle.model} (${purchase.vehicle.plate}) ha sido transferido exitosamente a ${userData.name}.`,
        date: new Date().toISOString(),
        vehicleInfo: `${purchase.vehicle.brand} ${purchase.vehicle.model} - ${purchase.vehicle.plate}`,
        buyerName: userData.name,
        amount: purchase.price,
      })
      localStorage.setItem(`notifications_${purchase.sellerCuil}`, JSON.stringify(sellerNotifications))

      setPendingPurchases(userPendingPurchases)
      setPurchases([...purchases, purchase])

      console.log("[v0] Purchase payment processed and completed:", purchase)
      console.log("[v0] Vehicle transferred from seller to buyer")
      console.log("[v0] Seller notified of completed transfer")

      alert(
        `¡Pago confirmado! El vehículo ${purchase.vehicle.brand} ${purchase.vehicle.model} ha sido transferido a tu garage virtual. El vendedor ha sido notificado. Ve a la sección "Mis Vehículos" para ver tu nuevo vehículo.`,
      )

      setActiveTab("owned")
    }
  }

  const closeSale = (saleId: string) => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userCuil = userData.cuil

    const globalPendingPurchases = JSON.parse(localStorage.getItem("globalPendingPurchases") || "{}")

    for (const buyerCuil in globalPendingPurchases) {
      const buyerPurchases = globalPendingPurchases[buyerCuil]
      const saleIndex = buyerPurchases.findIndex((p: any) => p.id === saleId)

      if (saleIndex !== -1) {
        const sale = buyerPurchases[saleIndex]

        if (sale.seller !== userData.name && sale.sellerCuil !== userCuil) {
          console.log("[v0] User is not the seller of this vehicle")
          continue
        }

        sale.status = "completed"
        sale.paymentConfirmed = true
        sale.completedDate = new Date().toISOString()

        buyerPurchases.splice(saleIndex, 1)
        globalPendingPurchases[buyerCuil] = buyerPurchases
        localStorage.setItem("globalPendingPurchases", JSON.stringify(globalPendingPurchases))

        // Transfer vehicle to buyer
        const buyerVehicles = JSON.parse(localStorage.getItem(`ownedVehicles_${buyerCuil}`) || "[]")
        const transferredVehicle = {
          ...sale.vehicle,
          owner: sale.buyerCuil, // Use CUIL as owner identifier
          previousOwner: sale.seller,
          transferDate: new Date().toISOString(),
          purchasePrice: sale.price,
        }
        buyerVehicles.push(transferredVehicle)
        localStorage.setItem(`ownedVehicles_${buyerCuil}`, JSON.stringify(buyerVehicles))

        // Remove vehicle from seller
        const sellerVehicles = JSON.parse(localStorage.getItem(`ownedVehicles_${userCuil}`) || "[]")
        const updatedSellerVehicles = sellerVehicles.filter((v: any) => v.id !== sale.vehicle.id)
        localStorage.setItem(`ownedVehicles_${userCuil}`, JSON.stringify(updatedSellerVehicles))

        const completedPurchases = JSON.parse(localStorage.getItem("purchases") || "[]")
        completedPurchases.push(sale)
        localStorage.setItem("purchases", JSON.stringify(completedPurchases))

        const completedSales = JSON.parse(localStorage.getItem("completedSales") || "[]")
        const completedSale = {
          ...sale,
          saleCompletedDate: new Date().toISOString(),
          finalStatus: "completed",
          sellerCuil: userCuil,
          sellerName: userData.name,
        }
        completedSales.push(completedSale)
        localStorage.setItem("completedSales", JSON.stringify(completedSales))

        setPendingSales(pendingSales.filter((s) => s.id !== saleId))
        setCompletedSales((prev) => [...prev, completedSale])

        console.log("[v0] Sale closed by seller and vehicle transferred:", sale)
        console.log("[v0] Completed sale stored with seller CUIL:", userCuil)
        alert(
          `¡Venta completada! El vehículo ${sale.vehicle.brand} ${sale.vehicle.model} ha sido transferido exitosamente al comprador.`,
        )
        break
      }
    }
  }

  const getDocumentStatus = (documents: any) => {
    const total = Object.keys(documents).length
    const valid = Object.values(documents).filter((doc: any) => doc.status === "valid").length
    return { valid, total, isComplete: valid === total }
  }

  const showPaymentModal = (purchase: any) => {
    setSelectedPurchaseForPayment(purchase)
    setShowPaymentWall(true)
  }

  const handlePaymentComplete = () => {
    if (selectedPurchaseForPayment) {
      processPurchasePayment(selectedPurchaseForPayment.id)
    }
    setShowPaymentWall(false)
    setSelectedPurchaseForPayment(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white px-6 py-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Garage Virtual</h1>
        <p className="text-slate-300">Gestiona tus vehículos, compras y ventas</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="hover:scale-105 transition-transform duration-200 bg-transparent"
        >
          <Home className="w-4 h-4 mr-2" />
          Volver al Inicio
        </Button>

        <Button
          variant="destructive"
          onClick={resetAllData}
          className="hover:scale-105 transition-transform duration-200"
        >
          🔄 Reiniciar Simulación
        </Button>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("owned")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "owned" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Car className="w-4 h-4" />
          Mis Vehículos ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab("purchases")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "purchases" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Mis Compras ({purchases.length + pendingPurchases.length})
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "sales" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Mis Ventas ({pendingSales.length + completedSales.length})
        </button>
      </div>

      {activeTab === "owned" ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => {
            const docStatus = getDocumentStatus(vehicle.documents)

            return (
              <Card
                key={vehicle.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant={vehicle.type === "car" ? "default" : "secondary"} className="animate-fade-in">
                      {vehicle.type === "car" ? (
                        <>
                          <Car className="w-3 h-3 mr-1" /> Automóvil
                        </>
                      ) : (
                        <>
                          <Bike className="w-3 h-3 mr-1" /> Motocicleta
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={docStatus.isComplete ? "default" : "destructive"} className="animate-fade-in">
                      {docStatus.isComplete ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1 animate-pulse" /> Listo para Transferir
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1 animate-pulse" /> Documentos Faltantes
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-gray-600">
                      {vehicle.year} • Patente: {vehicle.plate}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      Valor de Mercado: ${vehicle.marketValue.toLocaleString("es-AR")} ARS
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Documentos Digitales como NFTs ({docStatus.valid}/{docStatus.total})
                    </h4>

                    <div className="space-y-3">
                      {Object.entries(vehicle.documents).map(([key, doc]: [string, any]) => {
                        const IconComponent = documentIcons[key as keyof typeof documentIcons]

                        return (
                          <div
                            key={key}
                            className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                              doc.status === "valid"
                                ? "border-green-200 bg-green-50 hover:bg-green-100"
                                : "border-red-200 bg-red-50 hover:bg-red-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                {doc.status === "valid" ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <IconComponent className="w-4 h-4 text-gray-600" />
                                  <p className="text-sm font-medium text-gray-900">
                                    {documentLabels[key as keyof typeof documentLabels]}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                                {doc.date && (
                                  <p className="text-xs text-gray-500">
                                    Emitido: {new Date(doc.date).toLocaleDateString("es-AR")}
                                  </p>
                                )}
                                {doc.nftHash && (
                                  <p className="text-xs text-blue-600 font-mono">
                                    NFT: {doc.nftHash.substring(0, 20)}...
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {docStatus.isComplete ? (
                    <div className="space-y-2">
                      <Link href={`/transfer/${vehicle.id}`}>
                        <Button className="w-full hover:scale-105 transition-transform duration-200 bg-blue-600 hover:bg-blue-700">
                          Iniciar Transferencia Blockchain
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <p className="text-xs text-green-600 text-center">
                        ✅ Smart contract validará automáticamente todos los documentos
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full bg-transparent" variant="outline" disabled>
                        Documentos Incompletos - Transferencia Bloqueada
                        <AlertCircle className="w-4 h-4 ml-2" />
                      </Button>
                      <p className="text-xs text-red-600 text-center animate-pulse">
                        Complete todos los documentos NFT para habilitar la transferencia
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : activeTab === "purchases" ? (
        <div className="space-y-6">
          {pendingPurchases.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Solicitudes Pendientes de Firma ({pendingPurchases.length})
              </h3>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {pendingPurchases.map((purchase) => {
                  const vehicle = purchase.vehicle
                  const docStatus = getDocumentStatus(vehicle.documents)

                  return (
                    <Card
                      key={purchase.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-orange-200 bg-orange-50"
                    >
                      <div className="relative">
                        <img
                          src={vehicle.image || "/placeholder.svg"}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="default" className="animate-fade-in bg-orange-600">
                            <AlertCircle className="w-3 h-3 mr-1" /> Pendiente Firma
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-gray-600">
                            {vehicle.year} • Patente: {vehicle.plate}
                          </p>
                          <p className="text-sm text-orange-600 font-medium">
                            Precio: ${Number.parseInt(purchase.price || "0").toLocaleString("es-AR")} ARS
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Vendedor: {purchase.seller}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Solicitud: {new Date(purchase.date).toLocaleDateString("es-AR")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>
                              Método:{" "}
                              {purchase.paymentMethod === "platform"
                                ? "Dentro de la plataforma"
                                : "Fuera de la plataforma"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Documentos NFT del Vehículo ({docStatus.valid}/{docStatus.total})
                          </h4>

                          <div className="space-y-2">
                            {Object.entries(vehicle.documents).map(([key, doc]: [string, any]) => {
                              const IconComponent = documentIcons[key as keyof typeof documentIcons]

                              return (
                                <div
                                  key={key}
                                  className={`p-3 rounded-lg border transition-all duration-300 ${
                                    doc.status === "valid" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                      {doc.status === "valid" ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <IconComponent className="w-4 h-4 text-gray-600" />
                                        <p className="text-sm font-medium text-gray-900">
                                          {documentLabels[key as keyof typeof documentLabels]}
                                        </p>
                                      </div>
                                      {doc.nftHash && (
                                        <p className="text-xs text-blue-600 font-mono mt-1">
                                          NFT: {doc.nftHash.substring(0, 20)}...
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div
                          className={`p-3 rounded-lg border ${
                            purchase.status === "pending_buyer_signature"
                              ? "border-yellow-200 bg-yellow-50"
                              : purchase.status === "buyer_signed_waiting_payment_confirmation"
                                ? "border-blue-200 bg-blue-50"
                                : purchase.status === "waiting_seller_payment_confirmation"
                                  ? "border-orange-200 bg-orange-50"
                                  : "border-green-200 bg-green-50"
                          }`}
                        >
                          <p className="text-sm font-medium">
                            Estado:{" "}
                            {purchase.status === "pending_buyer_signature"
                              ? "Esperando que el comprador firme el contrato"
                              : purchase.status === "buyer_signed_waiting_payment_confirmation"
                                ? "Comprador firmó - Esperando confirmación de pago enviado"
                                : purchase.status === "waiting_seller_payment_confirmation"
                                  ? "Comprador confirmó pago - Esperando confirmación del vendedor"
                                  : "Comprador ha firmado - Esperando pago"}
                          </p>
                        </div>

                        {purchase.status === "pending_buyer_signature" ? (
                          <>
                            <Button
                              onClick={() => signPurchase(purchase.id)}
                              className="w-full hover:scale-105 transition-transform duration-200 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Firmar y Aceptar Compra
                            </Button>
                            {purchase.paymentMethod === "platform" ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-700">
                                  💳 Después de firmar, aparecerá el botón de pago para procesar dentro de la
                                  plataforma.
                                </p>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-xs text-yellow-700">
                                  💳 Después de firmar, deberás confirmar que enviaste el pago al vendedor.
                                </p>
                              </div>
                            )}
                            {purchase.paymentMethod === "external" && (
                              <Button
                                variant="outline"
                                onClick={() => window.open("/claims", "_blank")}
                                className="w-full mt-2 border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Iniciar Reclamo Legal
                              </Button>
                            )}
                          </>
                        ) : purchase.status === "signed_waiting_payment" ? (
                          <>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-green-700 font-medium">✅ Contrato firmado exitosamente</p>
                              <p className="text-xs text-green-600 mt-1">
                                Firmado el: {new Date(purchase.buyerSignedDate).toLocaleString("es-AR")}
                              </p>
                            </div>
                            <Button
                              onClick={() => showPaymentModal(purchase)}
                              className="w-full hover:scale-105 transition-transform duration-200 bg-blue-600 hover:bg-blue-700"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pagar Ahora
                            </Button>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-xs text-blue-700">
                                💳 Se abrirá la pasarela de pago segura de la plataforma.
                              </p>
                            </div>
                          </>
                        ) : purchase.status === "buyer_signed_waiting_payment_confirmation" ? (
                          <>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-green-700 font-medium">✅ Contrato firmado exitosamente</p>
                              <p className="text-xs text-green-600 mt-1">
                                Firmado el: {new Date(purchase.buyerSignedDate).toLocaleString("es-AR")}
                              </p>
                            </div>
                            <Button
                              onClick={() => confirmPaymentSent(purchase.id)}
                              className="w-full hover:scale-105 transition-transform duration-200 bg-orange-600 hover:bg-orange-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirmar que Envié el Pago
                            </Button>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-xs text-yellow-700">
                                💳 Confirma solo después de haber enviado el pago completo al vendedor fuera de la
                                plataforma.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => window.open("/claims", "_blank")}
                              className="w-full mt-2 border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Iniciar Reclamo Legal
                            </Button>
                          </>
                        ) : purchase.status === "waiting_seller_payment_confirmation" ? (
                          <>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-blue-700 font-medium">
                                ⏳ Esperando confirmación del vendedor
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Pago confirmado el: {new Date(purchase.paymentConfirmedDate).toLocaleString("es-AR")}
                              </p>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-xs text-yellow-700">
                                ⏳ El vendedor debe confirmar que recibió el pago para completar la transferencia.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => window.open("/claims", "_blank")}
                              className="w-full mt-2 border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Iniciar Reclamo Legal
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {purchases.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Compras Completadas ({purchases.length})
              </h3>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {purchases.map((purchase, index) => {
                  const vehicle = purchase.vehicle
                  const docStatus = getDocumentStatus(vehicle.documents)

                  return (
                    <Card
                      key={`purchase-${index}`}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-green-200"
                    >
                      <div className="relative">
                        <img
                          src={vehicle.image || "/placeholder.svg"}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="default" className="animate-fade-in bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" /> Completada
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-gray-600">
                            {vehicle.year} • Patente: {vehicle.plate}
                          </p>
                          <p className="text-sm text-green-600 font-medium">
                            Precio Pagado: ${Number.parseInt(purchase.price || "0").toLocaleString("es-AR")} ARS
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Vendedor: {purchase.seller}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Completada: {new Date(purchase.completedDate).toLocaleDateString("es-AR")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>
                              Método:{" "}
                              {purchase.paymentMethod === "platform"
                                ? "Dentro de la plataforma"
                                : "Fuera de la plataforma"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-700 font-medium">✅ Compra completada exitosamente</p>
                          <p className="text-xs text-green-600 mt-1">
                            El vehículo ha sido transferido a tu garage virtual
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => window.open("/claims", "_blank")}
                          className="w-full border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Iniciar Reclamo Legal
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {pendingPurchases.length === 0 && purchases.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay compras registradas</h3>
              <p className="text-gray-600">
                Las solicitudes de compra aparecerán aquí cuando los vendedores te envíen contratos.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {pendingSales.length > 0 || completedSales.length > 0 ? (
            <div className="space-y-8">
              {/* Pending Sales Section */}
              {pendingSales.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Ventas en Proceso ({pendingSales.length})
                  </h3>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {pendingSales.map((sale) => {
                      const vehicle = sale.vehicle
                      const docStatus = getDocumentStatus(vehicle.documents)

                      return (
                        <Card
                          key={sale.id}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-blue-200"
                        >
                          <div className="relative">
                            <img
                              src={vehicle.image || "/placeholder.svg"}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="default" className="animate-fade-in bg-blue-600">
                                <AlertCircle className="w-3 h-3 mr-1" /> En Proceso
                              </Badge>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {vehicle.brand} {vehicle.model}
                              </h3>
                              <p className="text-gray-600">
                                {vehicle.year} • Patente: {vehicle.plate}
                              </p>
                              <p className="text-sm text-blue-600 font-medium">
                                Precio: ${Number.parseInt(sale.price || "0").toLocaleString("es-AR")} ARS
                              </p>
                            </div>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Comprador CUIL: {sale.buyerCuil}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Iniciada: {new Date(sale.date).toLocaleDateString("es-AR")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="w-4 h-4" />
                                <span>
                                  Método:{" "}
                                  {sale.paymentMethod === "platform"
                                    ? "Dentro de la plataforma"
                                    : "Fuera de la plataforma"}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`p-3 rounded-lg border mb-4 ${
                                sale.status === "waiting_seller_payment_confirmation"
                                  ? "border-orange-200 bg-orange-50"
                                  : sale.status === "buyer_signed_waiting_payment_confirmation"
                                    ? "border-blue-200 bg-blue-50"
                                    : "border-blue-200 bg-blue-50"
                              }`}
                            >
                              <p className="text-sm font-medium">
                                Estado:{" "}
                                {sale.status === "waiting_seller_payment_confirmation"
                                  ? "Comprador confirmó pago - Esperando tu confirmación"
                                  : sale.status === "buyer_signed_waiting_payment_confirmation"
                                    ? "Comprador firmó - Esperando confirmación de pago"
                                    : "Esperando que el comprador firme"}
                              </p>
                            </div>

                            {sale.status === "waiting_seller_payment_confirmation" &&
                            sale.paymentMethod === "external" ? (
                              <>
                                <Button
                                  onClick={() => closeSale(sale.id)}
                                  className="w-full hover:scale-105 transition-transform duration-200 bg-green-600 hover:bg-green-700 mb-2"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirmar Pago Recibido - Cerrar Venta
                                </Button>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
                                  <p className="text-xs text-yellow-700">
                                    ⚠️ Solo confirma si recibiste el pago completo del comprador.
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                                <p className="text-xs text-blue-700">
                                  ⏳ Esperando acción del comprador para continuar con la venta.
                                </p>
                              </div>
                            )}

                            {sale.paymentMethod === "external" && (
                              <Button
                                variant="outline"
                                onClick={() => window.open("/claims", "_blank")}
                                className="w-full border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Iniciar Reclamo Legal
                              </Button>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Completed Sales Section */}
              {completedSales.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Historial de Ventas Completadas ({completedSales.length})
                  </h3>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {completedSales.map((sale) => {
                      const vehicle = sale.vehicle

                      return (
                        <Card
                          key={sale.id}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-green-200"
                        >
                          <div className="relative">
                            <img
                              src={vehicle.image || "/placeholder.svg"}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="default" className="animate-fade-in bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" /> Completada
                              </Badge>
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {vehicle.brand} {vehicle.model}
                              </h3>
                              <p className="text-gray-600">
                                {vehicle.year} • Patente: {vehicle.plate}
                              </p>
                              <p className="text-sm text-green-600 font-medium">
                                Precio: ${Number.parseInt(sale.price || "0").toLocaleString("es-AR")} ARS
                              </p>
                            </div>

                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Comprador CUIL: {sale.buyerCuil}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Completada:{" "}
                                  {new Date(sale.saleCompletedDate || sale.date).toLocaleDateString("es-AR")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="w-4 h-4" />
                                <span>
                                  Método:{" "}
                                  {sale.paymentMethod === "platform"
                                    ? "Dentro de la plataforma"
                                    : "Fuera de la plataforma"}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 rounded-lg border border-green-200 bg-green-50 mb-4">
                              <p className="text-sm font-medium text-green-700">✅ Venta completada exitosamente</p>
                              <p className="text-xs text-green-600 mt-1">
                                El vehículo ha sido transferido al comprador
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              onClick={() => window.open("/claims", "_blank")}
                              className="w-full border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Iniciar Reclamo Legal
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
              <p className="text-gray-600">
                Las ventas aparecerán aquí cuando inicies transferencias desde tus vehículos.
              </p>
            </div>
          )}
        </div>
      )}

      <PaymentWall
        isOpen={showPaymentWall}
        onClose={() => setShowPaymentWall(false)}
        onPaymentComplete={handlePaymentComplete}
        purchase={selectedPurchaseForPayment}
      />
    </div>
  )
}
