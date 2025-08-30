import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

export function Header() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="container mx-auto px-4">
        {/* Top bar with government branding */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
                <div className="w-3 h-2 bg-white rounded-sm"></div>
              </div>
              <span className="text-blue-300">República Argentina</span>
            </div>
          </div>
          <div className="text-blue-300">2025 - Año de la Modernización Digital del Estado</div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">BLOCKCHAIN AUTO</h1>
                <p className="text-sm text-gray-300">TRANSFERENCIAS DIGITALES DE AUTOMOTORES</p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-white hover:text-blue-300">
              INSTITUCIONAL
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-300">
              TRANSFERENCIAS
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-300">
              DOCUMENTOS
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-300">
              AYUDA
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
