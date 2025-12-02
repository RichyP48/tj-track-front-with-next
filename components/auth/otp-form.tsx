"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"

interface OtpFormProps {
  type: "verify-email" | "reset-password"
}

export function OtpForm({ type }: OtpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async () => {
    if (otp.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      if (type === "verify-email") {
        await authApi.verifyRegistration({ email, otp })
        setSuccess(true)
        setTimeout(() => router.push("/login"), 2000)
      } else {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Code invalide. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError(null)

    try {
      if (type === "verify-email") {
        await authApi.sendOtp(email)
      } else {
        await authApi.sendResetOtp(email)
      }
      setCountdown(60)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du code")
    } finally {
      setIsResending(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email vérifié !</h3>
              <p className="text-muted-foreground mt-1">Votre compte a été vérifié. Redirection vers la connexion...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Vérification</CardTitle>
        <CardDescription>
          Entrez le code à 6 chiffres envoyé à <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full" onClick={handleVerify} disabled={otp.length !== 6 || isLoading}>
          {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Vérifier
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas reçu le code ?{" "}
            {countdown > 0 ? (
              <span>Renvoyer dans {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {isResending ? "Envoi..." : "Renvoyer"}
              </button>
            )}
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
