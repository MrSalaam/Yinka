import { ContactSection } from "../../components/contact-section"
import { Footer } from "../../components/footer"

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
