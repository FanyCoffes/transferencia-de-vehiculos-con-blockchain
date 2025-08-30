import { Header } from "@/components/header"
import { TransferWizard } from "@/components/transfer-wizard"

interface TransferPageProps {
  params: {
    vehicleId: string
  }
}

export default function TransferPage({ params }: TransferPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <TransferWizard vehicleId={params.vehicleId} />
      </div>
    </div>
  )
}
