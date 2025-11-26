import { Github, Linkedin, Twitter, Instagram, CodepenIcon } from "lucide-react"

const socialLinks = [
  { icon: Github, href: "https://github.com/MrSalaam", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
  { icon: Twitter, href: "https://x.com/OlayinkaSZN", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/in/olayinka-salaam", label: "LinkedIn" },
  { icon: CodepenIcon, href: "https://codepen.io", label: "CodePen" },
]

export function Footer() {
  return (
    <footer className="py-8 mt-16">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 md:hidden">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <a
          href="https://github.com/MrSalaam"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <div>Designed & Built by Olayinka Salaam</div>
          <div className="text-center mt-1">© 2025</div>
        </a>
      </div>
    </footer>
  )
}
