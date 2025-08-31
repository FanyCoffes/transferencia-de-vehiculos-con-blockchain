"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, AlertCircle } from "lucide-react"

const credentials = {
  "fran.perez": { password: "fran123", name: "Francisco Pérez", userId: "fran", cuil: "20-35678901-2" },
  "coty.garcia": { password: "coty123", name: "Constanza García", userId: "coty", cuil: "27-28456789-3" },
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("[v0] Login attempt:", { username, password })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = credentials[username as keyof typeof credentials]
    if (user && user.password === password) {
      console.log("[v0] Login successful for user:", user)
      const userData = {
        id: user.userId,
        name: user.name,
        username: username,
        cuil: user.cuil,
      }
      console.log("[v0] Storing user data in localStorage:", userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))

      console.log("[v0] Attempting to redirect to /garage")
      try {
        await router.push("/garage")
        console.log("[v0] Redirect to /garage completed")
      } catch (error) {
        console.error("[v0] Error during redirect:", error)
        setError("Error al redirigir. Intente nuevamente.")
      }
    } else {
      console.log("[v0] Login failed for username:", username)
      setError("Usuario o contraseña incorrectos")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Transferencia Blockchain</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">Credenciales de Demo:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Francisco (Documentos Completos):</strong>
                <br />
                Usuario: <code className="bg-white px-1 rounded">fran.perez</code>
                <br />
                Contraseña: <code className="bg-white px-1 rounded">fran123</code>
                <br />
                CUIL: <code className="bg-white px-1 rounded">20-35678901-2</code>
              </div>
              <div>
                <strong>Constanza (Documentos Incompletos):</strong>
                <br />
                Usuario: <code className="bg-white px-1 rounded">coty.garcia</code>
                <br />
                Contraseña: <code className="bg-white px-1 rounded">coty123</code>
                <br />
                CUIL: <code className="bg-white px-1 rounded">27-28456789-3</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
