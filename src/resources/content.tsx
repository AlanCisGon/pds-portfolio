import type { About, Home, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Alan",
  lastName: "Cisneros",
  name: "Alan Cisneros",
  role: "Senior Product Designer",
  avatar: "/images/avatar.jpg",
  email: "alancisgon@gmail.com",
  city: "Culiacán, Mexico",
  location: "America/Mazatlan", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Spanish", "English"], // optional: Leave the array empty if you don't want to display languages
};

const social: Social = [
  // Links are automatically displayed. Icons: src/resources/socialIcons.tsx.
  // Set essential: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/AlanCisGon",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/alancisgon/",
    essential: true,
  },

  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.webp",
  label: "Home",
  title: `${person.name} | ${person.role}`,
  description: `${person.role} in ${person.city}. Case studies in e-commerce, financial services and telecom: cart and checkout at Coppel, app redesign at Movistar MX.`,
  headline: <>I design products that balance business, technology, product and design.</>,
  featured: {
    display: true,
    label: "Featured work",
    title: "Cart and Checkout Optimization",
    href: "/work/project-helix",
  },
  subline: (
    <>
      I’m {person.firstName}, a product designer with 8 years across{" "}
      <strong>e-commerce, financial services and telecom</strong>. At <strong>Coppel</strong> I lead
      UX for Purchase &amp; Payments. I start every project by understanding the real problem before
      designing the solution.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} in ${person.city}: 8 years designing for e-commerce, financial services and telecom.`,
  tableOfContent: {
    display: true,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/alan-cisneros-phqijd/15min",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I’m a product designer based in Culiacán, Mexico. At Coppel I lead UX for Purchase &amp;
        Payments; before that I was a UX researcher there, and I led the UX team at Onikom Systems
        for clients like Movistar MX. My work sits between business, technology, product and design:
        I research early, prototype fast, test small and keep the customer at the center. Lately I
        treat AI as a co-creation partner, prototyping with Claude Code to get to ideas and to the
        shape of a problem faster.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Experience",
    experiences: [
      {
        company: "Coppel",
        timeframe: "2022 - Present",
        role: "Design Lead — Purchase & Payments",
        achievements: [
          "Led a team of 6 (3 UI, 2 UX, 1 UX writer) through the cart and checkout redesign during the Salesforce Commerce Cloud migration: web conversion +2 pp (digital analytics, Jan 2026, 4 months after launch).",
          "With the team, designed and launched Motorcycle Insurance, Extended Warranties and Recurring Shipping (web and app): average ticket +25% (BI, Jan 2026).",
          "Removed the Order Review step and rewrote card BIN messaging, which let us move card payments to a secure iFrame: Dynamic CVV2 rejections −60% (Operations, Jan 2026).",
          "Brought Design System standards to the “Coppel Soluciones” landing pages and in-store systems: +80% adoption across operations teams (Jan 2026).",
          "Set up UX metrics tracking for the Purchase team: usability (SUM), accessibility (Lighthouse, axe), NPS (Medallia), CSAT, task completion and drop-off.",
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/helix/inner-cover.webp",
            alt: "Coppel, Checkout Flow Redesign",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Coppel",
        timeframe: "2019 - 2022",
        role: "UX Researcher — E-commerce New Customers",
        achievements: [
          "Piloted two practices for a UX team without design governance: the Validation Onion, to find and validate user problems layer by layer, and a Contribution Process, a shared way to add new research. Both were absorbed by Coppel's Experience Design Center of Excellence.",
          "Set up heuristic evaluation as a shared practice across the UX team.",
          "Conducted UX Research for the Digital Credit Application (100% online acquisition).",
        ],
        images: [],
      },
      {
        company: "Onikom Systems",
        timeframe: "2018 - 2019",
        role: "UX Lead",
        achievements: [
          "Built a UX team that could serve several clients and products at once.",
          "Joined client discovery and brought users' needs and problems back to the team to shape the product.",
          "Introduced Lean UX and designed and taught an internal Lean UX course.",
          "Delivered UX design for Movistar MX, CFE Contigo and Nadro.",
        ],
        images: [
          {
            src: "/images/onikom-website.webp",
            alt: "Onikom Systems website",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Universidad Nacional Autónoma de México (UNAM)",
        description: "B.A. in Design & Visual Communication, 2014 – 2017.",
      },
      {
        name: "Sperientia",
        description: "Diploma in Service Design & Jobs-to-be-Done, 2021.",
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Skills",
    skills: [
      {
        title: "Design Leadership & Operations",
        description: "Team management, UX governance, design process scaling",
        tags: [
          {
            name: "Team Leadership",
            icon: "lead",
          },
          {
            name: "Jira",
            icon: "jira",
          },
          {
            name: "Confluence",
            icon: "confluence",
          },
          {
            name: "Notion",
            icon: "notion",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Design & Prototyping",
        description: "User interface design, tokens, UI component libraries, design documentation",
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
          {
            name: "Adobe Photoshop",
            icon: "photoshop",
          },
          {
            name: "Adobe Illustrator",
            icon: "illustrator",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Research & Analytics",
        description:
          "Heuristic analysis, A/B testing, accessibility, usability, quantitative UX metrics",
        tags: [
          {
            name: "Google Analytics",
            icon: "analytics",
          },
          {
            name: "Maze",
            icon: "maze",
          },
          {
            name: "Hotjar",
            icon: "hotjar",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Web Development",
        description:
          "Creation and maintenance of websites and web applications using front-end and back-end technologies",
        tags: [
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "React",
            icon: "react",
          },
          {
            name: "TypeScript",
            icon: "typescript",
          },
          {
            name: "GitHub",
            icon: "github",
          },
          {
            name: "Tailwind CSS",
            icon: "tailwind",
          },
          {
            name: "Vercel",
            icon: "vercel",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "AI-Powered Design",
        description: (
          <>
            I work with AI as a <strong>co-creation partner</strong>: rapid prototyping and
            co-creation with Claude Code to explore more ideas and understand problems faster. This
            portfolio and its design system were built that way.
          </>
        ),
        tags: [
          {
            name: "Claude",
            icon: "claude",
          },
          {
            name: "Gemini",
            icon: "gemini",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
    ],
  },
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Work – ${person.name}`,
  description: `Case studies by ${person.name}: cart and checkout at Coppel and an app redesign at Movistar MX.`,
  // Create new project pages by adding a new .mdx file to app/work/projects
  // All projects will be listed on the /home and /work routes
};

export { person, social, home, about, work };
