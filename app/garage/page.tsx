"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { VehicleGarage } from "@/components/vehicle-garage"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, LogOut } from "lucide-react"

export default function GaragePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Garage Virtual</h1>
          <p className="text-gray-600">Gestiona tus vehículos y documentos digitales</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold">Usuario Actual</h2>
                <p className="text-gray-600">{currentUser.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </Card>

        <VehicleGarage currentUser={currentUser} />
      </div>
    </div>
  )
}
