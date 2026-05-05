import { AboutSection } from "../../components/about-section"
import { Footer } from "../../components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <AboutSection />
      </div>
      <Footer />
    </main>
  )
}
