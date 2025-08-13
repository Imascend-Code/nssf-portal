// src/components/layout/Footer.tsx
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NSSF Portal. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/support" className="hover:text-primary transition-colors">
            Support
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/branches" className="hover:text-primary transition-colors">
            Branches
          </Link>
        </div>
      </div>
    </footer>
  )
}
