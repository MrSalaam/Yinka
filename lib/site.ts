
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yinkacodes.cv").replace(/\/$/, "")

export const site = {
  name: "Olayinka Salaam",
  jobTitle: "Website Developer",
  // The page title Google shows. Name first (so a search for the name wins), then what people search for
  // when they want to hire someone. About 55 characters, so none of it is cut off.
  title: "Olayinka Salaam | Website Developer in Lagos, Nigeria",
  // About 155 characters, which fits a search snippet. Says who, what, where and for whom.
  description:
    "Olayinka Salaam is a website developer in Lagos, Nigeria. I build fast, modern websites and web apps with Next.js, React and TypeScript, for clients worldwide.",
  email: "olayinkasalaam.dev@gmail.com",
  twitterHandle: "@yinka_tsx",
  location: { city: "Lagos", country: "NG", countryName: "Nigeria" },
  // Your CV is public/Olayinka_Salaam CV.pdf, or replace this with a full link such as a Google Drive URL
  cvUrl: "/Olayinka_Salaam%20CV.pdf",
  sameAs: ["https://github.com/MrSalaam", "https://linkedin.com/in/olayinka-salaam", "https://x.com/yinka_tsx"],
  keywords: [
    "website developer",
    "website developer in Lagos",
    "website developer in Nigeria",
    "web developer Lagos",
    "freelance web developer Nigeria",
    "hire a website developer",
    "Next.js developer",
    "React developer",
    "full-stack developer Nigeria",
    "Olayinka Salaam",
    "Yinka Codes",
  ],
  knowsAbout: ["Website development", "Web applications", "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "UI engineering"],
  services: ["Website development", "Web app development", "Landing pages", "Dashboards and admin panels", "SaaS products"],
}
