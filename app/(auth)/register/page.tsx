import { RegisterForm } from "@/components/auth/register-form"
import { Package } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Package className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">TJ-Track</span>
          </Link>
          <h1 className="text-2xl font-bold text-balance">Rejoignez TJ-Track dès aujourd'hui</h1>
          <p className="mt-4 text-muted-foreground">
            Créez votre compte pour commencer à gérer votre inventaire, vendre vos produits et développer votre
            activité.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TJ-Track</span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
