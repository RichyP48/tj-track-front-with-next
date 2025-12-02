"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Truck,
  Building2,
  Users,
  ShoppingCart,
  BarChart3,
  ArrowLeftRight,
  UserCheck,
  ChevronDown,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Stock",
    icon: Package,
    children: [
      { title: "Articles", href: "/admin/articles" },
      { title: "Catégories", href: "/admin/categories" },
      { title: "Mouvements", href: "/admin/mouvements" },
      { title: "Alertes", href: "/admin/alertes" },
    ],
  },
  {
    title: "Fournisseurs",
    href: "/admin/fournisseurs",
    icon: Truck,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Entreprises",
    href: "/admin/entreprises",
    icon: Building2,
  },
  {
    title: "Commandes",
    icon: ShoppingCart,
    children: [
      { title: "Clients", href: "/admin/commandes-client" },
      { title: "Fournisseurs", href: "/admin/commandes-fournisseur" },
    ],
  },
  {
    title: "Ventes",
    href: "/admin/ventes",
    icon: BarChart3,
  },
  {
    title: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: UserCheck,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>(["Stock", "Commandes"])

  const toggleItem = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title]))
  }

  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r bg-background md:block">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon

              if (item.children) {
                const isOpen = openItems.includes(item.title)
                const isActive = item.children.some((child) => pathname.startsWith(child.href))

                return (
                  <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent text-accent-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </div>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 pt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === child.href &&
                              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              }

              const isActive = pathname === item.href

              return (
                <Link
                  key={item.title}
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </div>
    </aside>
  )
}
