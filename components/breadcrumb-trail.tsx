"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

const sections = [
    { id: "", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
]

export function BreadcrumbTrail() {
    const [currentSection, setCurrentSection] = useState("Home")
    const [showBreadcrumb, setShowBreadcrumb] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200
            const aboutSection = document.getElementById("about")

            // Only show breadcrumb when scrolled to About section or beyond
            if (aboutSection && scrollPosition >= aboutSection.offsetTop) {
                setShowBreadcrumb(true)
            } else {
                setShowBreadcrumb(false)
                setCurrentSection("Home")
                return
            }

            // Find current section
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section.id) {
                    const element = document.getElementById(section.id)
                    if (element && element.offsetTop <= scrollPosition) {
                        setCurrentSection(section.label)
                        break
                    }
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll() // Initial check
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Don't render if not scrolled to About section yet
    if (!showBreadcrumb) {
        return null
    }

    return (
        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-default">Home</span>
            {currentSection !== "Home" && (
                <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary font-medium">{currentSection}</span>
                </>
            )}
        </div>
    )
}
