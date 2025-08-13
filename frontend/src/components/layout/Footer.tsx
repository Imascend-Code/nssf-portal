import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com/nssf" },
    { icon: Twitter, url: "https://twitter.com/nssf" },
    { icon: Linkedin, url: "https://linkedin.com/company/nssf" },
    { icon: Instagram, url: "https://instagram.com/nssf" },
  ]

  const footerLinks = [
    { label: "Support", to: "/support" },
    { label: "Features", to: "/features" },
    { label: "Branches", to: "/branches" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ]

  return (
    <footer className="w-full border-t bg-muted/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">N</div>
              <span className="text-lg font-semibold">NSSF Portal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure social security management for all citizens.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link, index) => (
                <motion.li key={index} whileHover={{ x: 2 }}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link, index) => (
                <motion.li key={index} whileHover={{ x: 2 }}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            © {currentYear} National Social Security Fund. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {footerLinks.slice(0, 3).map((link, index) => (
              <div key={index} className="flex items-center gap-4">
                <Link to={link.to} className="hover:text-primary transition-colors">
                  {link.label}
                </Link>
                {index < 2 && <Separator orientation="vertical" className="h-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}