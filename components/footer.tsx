
import { NewTwitterIcon, GithubIcon, InstagramIcon, Linkedin02Icon } from "hugeicons-react"

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/MrSalaam", label: "GitHub" },
  { icon: InstagramIcon, href: "https://instagram.com/", label: "Instagram" },
  { icon: NewTwitterIcon, href: "https://x.com/OlayinkaSZN", label: "Twitter" },
  { icon: Linkedin02Icon, href: "https://linkedin.com/in/olayinka-salaam", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="py-8 mt-16">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
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
          className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <span>Olayinka Salaam</span>
          <span className="w-px h-3 bg-border" />
          <span>© {new Date().getFullYear()}</span>
        </a>
      </div>
    </footer>
  )
}
