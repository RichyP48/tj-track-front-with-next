import { Suspense } from "react"
import { OtpForm } from "@/components/auth/otp-form"
import { Package } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">TJ-Track</span>
        </Link>
        <Suspense fallback={<div>Chargement...</div>}>
          <OtpForm type="reset-password" />
        </Suspense>
      </div>
    </div>
  )
}
