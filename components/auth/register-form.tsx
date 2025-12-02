"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authApi } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import type { UserRole } from "@/lib/types"

const registerSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "COMMERCANT", "FOURNISSEUR", "LIVREUR"]),
    phoneNumber: z
      .string()
      .regex(/^[+]?[0-9]{8,15}$/, "Numéro de téléphone invalide")
      .optional()
      .or(z.literal("")),
    shopName: z.string().optional(),
    town: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const roleLabels: Record<string, string> = {
  CLIENT: "Client",
  COMMERCANT: "Commerçant",
  FOURNISSEUR: "Fournisseur",
  LIVREUR: "Livreur",
}

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CLIENT",
    },
  })

  const selectedRole = watch("role")
  const needsBusinessInfo = ["COMMERCANT", "FOURNISSEUR", "LIVREUR"].includes(selectedRole)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const { confirmPassword, shopName, town, address, phoneNumber, ...baseData } = data

      const requestData: any = { ...baseData }

      if (data.role === "CLIENT" && (town || address || phoneNumber)) {
        requestData.clientInfo = {
          town: town || "",
          address: address || "",
          phoneNumber: phoneNumber || "",
        }
      } else if (data.role === "COMMERCANT" && shopName) {
        requestData.merchantInfo = {
          shopName,
          town: town || "",
          address: address || "",
          phoneNumber: phoneNumber || "",
        }
      } else if (data.role === "FOURNISSEUR" && shopName) {
        requestData.supplierInfo = {
          shopName,
          town: town || "",
          address: address || "",
          phoneNumber: phoneNumber || "",
        }
      } else if (data.role === "LIVREUR") {
        requestData.deliveryInfo = {
          town: town || "",
          address: address || "",
          phoneNumber: phoneNumber || "",
        }
      }

      await authApi.register(requestData)
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Une erreur est survenue lors de l'inscription")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        <CardDescription>Remplissez le formulaire pour créer votre compte TJ-Track</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Jean Dupont" {...register("name")} disabled={isLoading} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setValue("role", value as UserRole)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nom@exemple.com" {...register("email")} disabled={isLoading} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {needsBusinessInfo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="shopName">
                  {selectedRole === "LIVREUR" ? "Nom de l'entreprise" : "Nom de la boutique"}
                </Label>
                <Input id="shopName" placeholder="Ma Boutique" {...register("shopName")} disabled={isLoading} />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="town">Ville</Label>
              <Input id="town" placeholder="Paris" {...register("town")} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Téléphone</Label>
              <Input id="phoneNumber" placeholder="+33612345678" {...register("phoneNumber")} disabled={isLoading} />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" placeholder="123 Rue Example" {...register("address")} disabled={isLoading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
            Créer mon compte
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
