"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"

const users = [
  { id: "fran", name: "Francisco Pérez", initials: "FP" },
  { id: "coty", name: "Constanza García", initials: "CG" },
]

export function UserSelector() {
  const [selectedUser, setSelectedUser] = useState("fran")

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <User className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Seleccionar Usuario</h2>
      </div>
      <div className="flex gap-4">
        {users.map((user) => (
          <Button
            key={user.id}
            variant={selectedUser === user.id ? "default" : "outline"}
            onClick={() => setSelectedUser(user.id)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
              {user.initials}
            </div>
            {user.name}
          </Button>
        ))}
      </div>
    </Card>
  )
}
