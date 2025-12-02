import { LoginForm } from "@/components/auth/login-form"
import { Package } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <Package className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">TJ-Track</span>
          </Link>
          <h1 className="text-2xl font-bold text-balance">Gérez votre stock et vos ventes en toute simplicité</h1>
          <p className="mt-4 text-muted-foreground">
            Connectez-vous pour accéder à votre tableau de bord, gérer vos articles et suivre vos commandes en temps
            réel.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TJ-Track</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
