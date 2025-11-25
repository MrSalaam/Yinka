export function displayConsoleMessage() {
    const styles = {
        title: "color: #ec5a00; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0px rgba(0,0,0,0.2);",
        subtitle: "color: #666; font-size: 14px; font-style: italic;",
        message: "color: #333; font-size: 12px; line-height: 1.5;",
        link: "color: #ec5a00; font-size: 12px; font-weight: bold;",
        ascii: "color: #ec5a00; font-family: monospace; font-size: 10px; line-height: 1.2;",
    }

    console.log("%c Hey there, curious developer!", styles.title)
    console.log("%cWelcome to my portfolio", styles.subtitle)
    console.log("")

    const asciiArt = `
   _____ _____ _____ _____ _____ _____ _____ _____ 
  |     |   __|     |     |   __|  _  |     |   __|
  |  |  |   __|   --|  |  |   __|     | | | |   __|
  |_____|_____|_____|_____|_____|__|__|_|_|_|_____|
  `
    console.log("%c" + asciiArt, styles.ascii)
    console.log("")

    console.log(
        "%cI see you're checking out the console! ",
        styles.message
    )
    console.log(
        "%cThis site is built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.",
        styles.message
    )
    console.log("")
    console.log(
        "%c Pro tip: Try the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) for a surprise!",
        styles.message
    )
    console.log("")
    console.log("%cLike what you see? Let's work together!", styles.link)
    console.log("%c Contact me: olayinkasalaam.dev@gmail.com", styles.link)
    console.log("")
    console.log("%c Built with love and lots of coffee ", styles.message)
}
