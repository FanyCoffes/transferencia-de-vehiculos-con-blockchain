import { Card } from "@/components/ui/card"
import { FileText, Shield, User, Wrench, Calculator } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">MÁS CONSULTADOS</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            <Link href="/garage">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Garage Virtual</span>
                </div>
              </Card>
            </Link>

            <Link href="/calculator">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Calculadora</span>
                </div>
              </Card>
            </Link>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Transferencias</span>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Verificaciones</span>
              </div>
            </Card>

            <Link href="/claims">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Reclamos</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
