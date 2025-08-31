"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, User, LogOut } from "lucide-react"

export function Hero() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    router.push("/login")
  }

  return (
    <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              TRANSFERENCIAS BLOCKCHAIN
            </div>
            <h2 className="text-4xl font-bold mb-6 text-balance">
              ¿Cómo transferir tu vehículo de forma segura y digital?
            </h2>
            <p className="text-xl text-gray-300 mb-8 text-pretty">
              Transfiere la propiedad de tu automotor usando tecnología blockchain. Documentos verificados, proceso
              transparente y transferencia instantánea.
            </p>
            <div className="flex gap-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Right card - conditional rendering based on session */}
          <div className="flex justify-center">
            {currentUser ? (
              <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold">Sesión Activa</h3>
                </div>

                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">{currentUser.name}</p>
                    <p className="text-sm text-gray-300">CUIL: {currentUser.cuil}</p>
                  </div>

                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </Button>

                  <Button
                    onClick={() => router.push("/garage")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
                  >
                    Ir al Garage Virtual
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold">Ingresar al Sistema</h3>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
                  >
                    Iniciar sesión
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Recuperar acceso
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 text-sm bg-transparent"
                    >
                      Comenzar registro
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 text-sm bg-transparent"
                    >
                      Verificar CUIT
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
