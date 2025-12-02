import type React from "react"
import { MainHeader } from "./main-header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 TJ-Track. Tous droits réservés.</p>
            <nav className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Confidentialité
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
