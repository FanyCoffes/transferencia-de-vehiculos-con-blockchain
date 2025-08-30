"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, FileText, Clock, Plus, Shield, User } from "lucide-react"

// Mock claims data
const mockClaims = [
  {
    id: "CLM-001",
    vehicleId: "car-1",
    vehicle: "Toyota Corolla 2020 - ABC123",
    claimant: "Juan Pérez",
    claimantType: "buyer",
    respondent: "Francisco Pérez",
    type: "hidden_defects",
    title: "Problemas en la transmisión",
    description:
      "El vehículo presenta fallas en la transmisión automática que no fueron declaradas al momento de la venta. Se requiere reparación estimada en ARS 150.000.",
    status: "open",
    priority: "high",
    createdAt: "2024-08-25T10:30:00Z",
    evidence: ["transmission-report.pdf", "mechanic-inspection.pdf"],
    blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
  },
  {
    id: "CLM-002",
    vehicleId: "bike-1",
    vehicle: "Honda CB600F 2019 - XYZ789",
    claimant: "Constanza García",
    claimantType: "seller",
    respondent: "María López",
    type: "payment_issues",
    title: "Pago incompleto",
    description:
      "El comprador realizó un pago parcial de ARS 800.000 de los ARS 1.200.000 acordados. No se ha completado el pago restante según lo pactado.",
    status: "in_review",
    priority: "medium",
    createdAt: "2024-08-20T14:15:00Z",
    evidence: ["payment-receipt.pdf", "transfer-agreement.pdf"],
    blockchainHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
  },
]

const claimTypes = {
  hidden_defects: "Vicios Ocultos",
  payment_issues: "Problemas de Pago",
  documentation: "Documentación Incorrecta",
  fraud: "Fraude",
}

const statusLabels = {
  open: "Abierto",
  in_review: "En Revisión",
  resolved: "Resuelto",
  rejected: "Rechazado",
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

export function ClaimsManagement() {
  const [activeTab, setActiveTab] = useState("list")
  const [claims, setClaims] = useState(mockClaims)
  const [newClaim, setNewClaim] = useState({
    vehicleId: "",
    vehiclePlate: "",
    claimantType: "buyer",
    type: "hidden_defects",
    title: "",
    description: "",
    respondentEmail: "",
  })

  const handleSubmitClaim = () => {
    const claim = {
      id: `CLM-${String(claims.length + 1).padStart(3, "0")}`,
      vehicleId: newClaim.vehicleId,
      vehicle: `Vehículo - ${newClaim.vehiclePlate}`,
      claimant: newClaim.claimantType === "buyer" ? "Usuario Comprador" : "Usuario Vendedor",
      claimantType: newClaim.claimantType,
      respondent: newClaim.respondentEmail,
      type: newClaim.type,
      title: newClaim.title,
      description: newClaim.description,
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
      evidence: [],
      blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    }

    setClaims([claim, ...claims])
    setNewClaim({
      vehicleId: "",
      vehiclePlate: "",
      claimantType: "buyer",
      type: "hidden_defects",
      title: "",
      description: "",
      respondentEmail: "",
    })
    setActiveTab("list")
  }

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <Card className="p-6">
        <div className="flex gap-4">
          <Button variant={activeTab === "list" ? "default" : "outline"} onClick={() => setActiveTab("list")}>
            <FileText className="w-4 h-4 mr-2" />
            Lista de Reclamos
          </Button>
          <Button variant={activeTab === "new" ? "default" : "outline"} onClick={() => setActiveTab("new")}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reclamo
          </Button>
        </div>
      </Card>

      {/* Claims list */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                    <p className="text-sm text-gray-600">
                      Reclamo #{claim.id} • {claim.vehicle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColors[claim.priority as keyof typeof priorityColors]}>
                    {claim.priority.toUpperCase()}
                  </Badge>
                  <Badge
                    variant={
                      claim.status === "open" ? "destructive" : claim.status === "resolved" ? "default" : "secondary"
                    }
                  >
                    {statusLabels[claim.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detalles del Reclamo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span>{claimTypes[claim.type as keyof typeof claimTypes]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reclamante:</span>
                      <span>
                        {claim.claimant} ({claim.claimantType === "buyer" ? "Comprador" : "Vendedor"})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Demandado:</span>
                      <span>{claim.respondent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span>{new Date(claim.createdAt).toLocaleDateString("es-AR")}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Registro Blockchain</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Registrado en Blockchain</span>
                    </div>
                    <p className="text-xs font-mono text-gray-600 break-all">{claim.blockchainHash}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                <p className="text-gray-700 text-sm">{claim.description}</p>
              </div>

              {claim.evidence.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Evidencia</h4>
                  <div className="flex gap-2">
                    {claim.evidence.map((file, index) => (
                      <Badge key={index} variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Última actualización: {new Date(claim.createdAt).toLocaleDateString("es-AR")}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  {claim.status === "open" && <Button size="sm">Responder</Button>}
                </div>
              </div>
            </Card>
          ))}

          {claims.length === 0 && (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reclamos registrados</h3>
              <p className="text-gray-600">Cuando se presenten disputas, aparecerán aquí.</p>
            </Card>
          )}
        </div>
      )}

      {/* New claim form */}
      {activeTab === "new" && (
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Presentar Nuevo Reclamo</h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="vehicle-plate">Patente del Vehículo</Label>
                <Input
                  id="vehicle-plate"
                  placeholder="ABC123"
                  value={newClaim.vehiclePlate}
                  onChange={(e) => setNewClaim({ ...newClaim, vehiclePlate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="respondent-email">Email de la Contraparte</Label>
                <Input
                  id="respondent-email"
                  type="email"
                  placeholder="contraparte@email.com"
                  value={newClaim.respondentEmail}
                  onChange={(e) => setNewClaim({ ...newClaim, respondentEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Tipo de Reclamante</Label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="claimantType"
                      value="buyer"
                      checked={newClaim.claimantType === "buyer"}
                      onChange={(e) => setNewClaim({ ...newClaim, claimantType: e.target.value })}
                    />
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Comprador</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="claimantType"
                      value="seller"
                      checked={newClaim.claimantType === "seller"}
                      onChange={(e) => setNewClaim({ ...newClaim, claimantType: e.target.value })}
                    />
                    <User className="w-4 h-4 text-green-600" />
                    <span>Vendedor</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="claim-type">Tipo de Reclamo</Label>
                <select
                  id="claim-type"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={newClaim.type}
                  onChange={(e) => setNewClaim({ ...newClaim, type: e.target.value })}
                >
                  {Object.entries(claimTypes).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="claim-title">Título del Reclamo</Label>
              <Input
                id="claim-title"
                placeholder="Resumen breve del problema"
                value={newClaim.title}
                onChange={(e) => setNewClaim({ ...newClaim, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="claim-description">Descripción Detallada</Label>
              <Textarea
                id="claim-description"
                placeholder="Describa detalladamente el problema, incluyendo fechas, montos y cualquier información relevante..."
                rows={6}
                value={newClaim.description}
                onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Registro Inmutable</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Su reclamo será registrado de forma inmutable en la blockchain de Argentina. Una vez enviado, no podrá
                ser modificado, pero podrá agregar evidencia adicional.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("list")}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmitClaim}
                disabled={!newClaim.vehiclePlate || !newClaim.title || !newClaim.description}
              >
                Presentar Reclamo
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
