import { ProjectsSection } from "../../components/projects-section"
import { Footer } from "../../components/footer"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <ProjectsSection />
      </div>
      <Footer />
    </main>
  )
}
