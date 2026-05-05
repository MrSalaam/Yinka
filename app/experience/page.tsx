import { ExperienceSection } from "../../components/experience-section"
import { Footer } from "../../components/footer"

export default function ExperiencePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <ExperienceSection />
      </div>
      <Footer />
    </main>
  )
}
