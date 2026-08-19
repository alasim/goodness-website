import { BookOpen, Cpu, Users, Globe, Lightbulb, type LucideIcon } from "lucide-react";

export interface Program {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  color: string;
  bg: string;
  desc: string;
  longDesc: string;
  goals: string[];
  metrics: { participants: string; placements: string; partners: number };
  status: string;
  volunteerRoles: string[];
  activities: { title: string; desc: string }[];
}

export const programs: Program[] = [
  {
    slug: "education-career-readiness",
    icon: BookOpen,
    title: "Education & Career Readiness",
    tagline: "Preparing for modern careers",
    color: "#1B7A34",
    bg: "#f0faf3",
    desc: "We prepare students and young professionals for modern careers through practical training, industry mentorship, and real-world project exposure.",
    longDesc:
      "Our Education & Career Readiness program bridges the gap between classroom learning and real-world employment. Working in close collaboration with industry leaders, we design curriculum that reflects current employer needs — covering technical skills, professional communication, and career navigation. Every participant receives personalised mentorship, portfolio review, and direct introductions to hiring partners.",
    goals: [
      "Train 500+ students annually in career-ready skills",
      "Partner with 15+ companies for internship placements",
      "Achieve 80%+ employment rate within 6 months of graduation",
      "Deliver CV writing, interview prep, and portfolio building",
    ],
    metrics: { participants: "320+", placements: "68%", partners: 7 },
    status: "Active",
    volunteerRoles: ["Career Mentor", "CV Review Volunteer", "Mock Interview Coach", "Industry Speaker"],
    activities: [
      { title: "Career Bootcamp", desc: "Intensive 4-week program covering job search strategy, networking, and interview skills." },
      { title: "Mentorship Circles", desc: "Monthly small-group sessions pairing participants with mid-career professionals." },
      { title: "Industry Exposure Days", desc: "Curated visits and Q&A sessions with partner organisations across sectors." },
      { title: "Portfolio Lab", desc: "Hands-on workshops to build professional portfolios and LinkedIn profiles." },
    ],
  },
  {
    slug: "ai-digital-skills",
    icon: Cpu,
    title: "AI & Digital Skills Development",
    tagline: "Future-proofing the workforce",
    color: "#1565C0",
    bg: "#e8f0fc",
    desc: "Helping individuals adapt to the future of work through AI literacy, automation training, and technology-focused learning programs.",
    longDesc:
      "From prompt engineering to no-code automation, our AI & Digital Skills program meets learners exactly where they are. We run both beginner and advanced tracks, covering practical AI tools, automation workflows, and data literacy. Graduates leave with tangible skills they can apply immediately — whether in formal employment or freelance work.",
    goals: [
      "Deliver AI literacy to 1,000 individuals annually",
      "Train 200 professionals in automation and no-code tools",
      "Build a community of AI-enabled graduates in the region",
      "Partner with tech companies for live tooling access",
    ],
    metrics: { participants: "410+", placements: "72%", partners: 5 },
    status: "Active",
    volunteerRoles: ["AI/ML Trainer", "No-Code Tools Facilitator", "Technical Curriculum Reviewer", "Lab Assistant"],
    activities: [
      { title: "AI Literacy Workshops", desc: "Beginner-friendly sessions demystifying AI and its practical everyday applications." },
      { title: "Automation Bootcamp", desc: "Hands-on training in tools like Zapier, Make, and Notion AI for workflow automation." },
      { title: "Prompt Engineering Lab", desc: "Deep-dive into effective prompt design for productivity and creative work." },
      { title: "Digital Skills Certification", desc: "Structured 8-week program culminating in a verifiable digital skills certificate." },
    ],
  },
  {
    slug: "youth-empowerment",
    icon: Users,
    title: "Youth Empowerment",
    tagline: "Unlocking the next generation",
    color: "#1B7A34",
    bg: "#f0faf3",
    desc: "Supporting young people aged 16–30 with skills, resources, mentorship networks, and opportunities that unlock their potential.",
    longDesc:
      "The Youth Empowerment program is designed to meet young people where they are — regardless of background or socioeconomic status. We run skills bootcamps, community mentorship circles, and micro-grant competitions that fund youth-led ideas. Our alumni network connects graduates across cities, creating lasting peer support and opportunity networks.",
    goals: [
      "Reach 800 young people through skills bootcamps",
      "Establish mentorship circles in 5 cities",
      "Award 50 micro-grants to youth-led initiatives annually",
      "Build a youth alumni network of 2,000+ members",
    ],
    metrics: { participants: "280+", placements: "65%", partners: 4 },
    status: "Active",
    volunteerRoles: ["Youth Mentor", "Bootcamp Facilitator", "Micro-Grant Evaluator", "Community Coordinator"],
    activities: [
      { title: "Skills Bootcamp", desc: "Weekend-format intensive training in entrepreneurship, financial literacy, and communication." },
      { title: "Micro-Grant Competition", desc: "Youth-led ideas compete for seed funding up to ₦500,000 with mentorship support." },
      { title: "City Mentorship Circles", desc: "Structured monthly meetups pairing young people with experienced community leaders." },
      { title: "Alumni Network Events", desc: "Quarterly gatherings for graduates to share opportunities and support one another." },
    ],
  },
  {
    slug: "community-development",
    icon: Globe,
    title: "Community Development",
    tagline: "Grassroots change at scale",
    color: "#1565C0",
    bg: "#e8f0fc",
    desc: "Launching initiatives that address local challenges and improve quality of life through collaborative, community-led action.",
    longDesc:
      "Real change is built by the communities experiencing the challenges. Our Community Development program co-designs solutions with community leaders, residents, and local organisations — ensuring every initiative is rooted in genuine need and sustainable beyond our involvement. We focus on infrastructure access, civic engagement, and collective resource mobilisation.",
    goals: [
      "Launch 3 community development projects per year",
      "Engage 50+ community leaders and stakeholders",
      "Deliver infrastructure and resource support to underserved areas",
      "Track and publish community well-being metrics annually",
    ],
    metrics: { participants: "180+", placements: "N/A", partners: 6 },
    status: "Active",
    volunteerRoles: ["Community Liaison", "Project Coordinator", "Data Collector", "Event Organiser"],
    activities: [
      { title: "Community Needs Assessments", desc: "Structured research to identify and prioritise challenges within target communities." },
      { title: "Resource Mobilisation Drives", desc: "Coordinated campaigns to gather materials, funds, and skilled volunteer support." },
      { title: "Civic Engagement Workshops", desc: "Sessions helping community members understand and exercise their civic rights." },
      { title: "Well-being Reporting", desc: "Annual community scorecards tracking health, education, and economic indicators." },
    ],
  },
  {
    slug: "innovation-social-good",
    icon: Lightbulb,
    title: "Innovation for Social Good",
    tagline: "Technology as a change agent",
    color: "#1B7A34",
    bg: "#f0faf3",
    desc: "Exploring and deploying technology-driven solutions that create scalable and lasting social impact.",
    longDesc:
      "From digital public health tools to civic technology platforms, our Innovation for Social Good program invests in building what matters. We partner with universities, tech companies, and social entrepreneurs to prototype, test, and scale technology solutions that address systemic challenges. All non-proprietary tools and methodologies are open-sourced for broader community benefit.",
    goals: [
      "Launch 2 social-good tech products per cycle",
      "Open-source all non-proprietary tools and methodologies",
      "Partner with universities for research and co-development",
      "Create an innovation grant fund for social entrepreneurs",
    ],
    metrics: { participants: "90+", placements: "N/A", partners: 3 },
    status: "Launching 2025",
    volunteerRoles: ["Software Developer", "UX/Product Designer", "Research Partner", "Social Innovation Advisor"],
    activities: [
      { title: "Innovation Sprint", desc: "3-day hackathon-style event building prototypes for real social challenges." },
      { title: "Tech for Good Lab", desc: "Ongoing co-working space for social entrepreneurs building impact-driven products." },
      { title: "Open Source Initiative", desc: "Publishing tools, datasets, and playbooks freely for the wider social sector." },
      { title: "Research Partnerships", desc: "Collaborative studies with academic institutions to validate and scale interventions." },
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
