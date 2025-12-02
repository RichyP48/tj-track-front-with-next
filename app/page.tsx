import Link from "next/link"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, BarChart3, Truck, ArrowRight, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Gestion de Stock",
    description: "Suivez vos stocks en temps réel avec des alertes automatiques pour les seuils bas.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce intégré",
    description: "Vendez vos produits en ligne avec un catalogue optimisé et un panier sécurisé.",
  },
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    description: "Visualisez vos performances avec des tableaux de bord et rapports complets.",
  },
  {
    icon: Truck,
    title: "Gestion Fournisseurs",
    description: "Gérez vos fournisseurs et commandes d'approvisionnement efficacement.",
  },
]

const benefits = [
  "Réduction des ruptures de stock de 80%",
  "Automatisation des commandes fournisseurs",
  "Suivi des mouvements de stock en temps réel",
  "Intégration multi-entreprises",
]

export default function HomePage() {
  return (
    <MainLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              La solution complète pour votre <span className="text-primary">gestion de stock</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-pretty">
              TJ-Track combine la puissance d'un système de gestion de stock avec une plateforme e-commerce intégrée.
              Gérez vos articles, suivez vos commandes et développez votre activité.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/catalogue">Voir le catalogue</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Fonctionnalités principales</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement votre activité
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-none shadow-sm">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">Pourquoi choisir TJ-Track ?</h2>
              <p className="mt-4 text-muted-foreground">
                Notre plateforme a été conçue pour simplifier la gestion de votre activité commerciale, de la réception
                des marchandises à la livraison client.
              </p>
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link href="/register">
                  Créer un compte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Package className="h-24 w-24 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
