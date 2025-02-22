import { Button } from "@/components/ui/button";
import {
  Building2,
  Menu,
  ArrowRight,
  Users2,
  Briefcase,
  BotIcon as Robot,
  BarChart3,
  Clock,
  Shield,
  Check,
} from "lucide-react";
import Link from "next/link";
import { NavLink } from "@/components/ui/nav-links";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between z-50">
      <Link
        href="/"
        className="flex items-center space-x-2 group px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
      >
        <Building2 className="w-8 h-8 text-teal-500 group-hover:text-teal-400 transition-colors" />
        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
          HUBBER
        </span>
      </Link>

      <nav className="hidden md:flex items-center space-x-8">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#about">Why Hubber</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
      </nav>

      <div className="flex items-center space-x-4">
        <Link href="/sign-in">
          <Button
            variant="ghost"
            className="text-zinc-400 hover:text-primary hover:bg-zinc-800/50"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Get Started
          </Button>
        </Link>
      </div>

      
    </header>
  );
};

const features = [
  {
    icon: Users2,
    title: "Team Management",
    description:
      "Streamline communication and task delegation across your entire organization.",
  },
  {
    icon: Robot,
    title: "AI Automation",
    description:
      "Automate repetitive tasks and workflows with intelligent AI assistance.",
  },
  {
    icon: Briefcase,
    title: "Client Portal",
    description:
      "Give clients their own secure portal for seamless collaboration.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track performance and make data-driven decisions with real-time insights.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Monitor project hours and automate billing processes effortlessly.",
  },
  {
    icon: Shield,
    title: "Security",
    description:
      "Enterprise-grade security to protect your sensitive business data.",
  },
];

const pricingTiers = [
  {
    name: "Basic",
    price: "150",
    description: "Perfect for small businesses managing multiple companies",
    features: [
      "Up to 3 companies",
      "5 employees per company",
      "Basic analytics",
      "Standard support",
      "Client portal access",
      "Team management",
      "Basic automation tools",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "240",
    description: "For businesses that need unlimited scalability",
    features: [
      "Unlimited companies",
      "Unlimited employees per company",
      "Detailed analytics dashboard",
      "Priority 24/7 support",
      "Advanced client portal features",
      "Advanced team management",
      "Advanced automation tools",
      "AI assistant (coming soon)",
    ],
    highlighted: true,
  },
];

const whyHubberFeatures = [
  {
    title: "Simplified Management",
    description:
      "Manage multiple companies and teams from a single dashboard. No more switching between different tools.",
    stat: "85%",
    statText: "reduction in management overhead",
  },
  {
    title: "Increased Productivity",
    description:
      "Automate repetitive tasks and streamline workflows to help your team focus on what matters most.",
    stat: "3x",
    statText: "faster task completion",
  },
  {
    title: "Better Collaboration",
    description:
      "Connect teams, clients, and stakeholders in one place for seamless communication and project delivery.",
    stat: "60%",
    statText: "improvement in team collaboration",
  },
  {
    title: "Data-Driven Decisions",
    description:
      "Get real-time insights and analytics to make informed decisions about your business operations.",
    stat: "40%",
    statText: "better decision-making accuracy",
  },
];

const testimonials = [
  {
    quote:
      "HUBBER has transformed how we manage our multi-company operations. It's like having a digital command center for all our businesses.",
    author: "Sarah Chen",
    role: "Operations Director",
    company: "TechFlow Solutions",
  },
  {
    quote:
      "The automation features alone have saved us countless hours. Our team can now focus on strategic initiatives instead of repetitive tasks.",
    author: "Marcus Rodriguez",
    role: "CEO",
    company: "InnovateX",
  },
];

const Home = () => {
  return (
    <div
      className="relative min-h-screen bg-zinc-950 text-zinc-100 scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[url(/grid.svg)] opacity-[0.02] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Header />

      <main className="relative">
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
                Organize Your Business <br />
                All in One Place
              </h1>

              <p className="max-w-2xl mx-auto text-lg text-zinc-400">
                Simplify your business operations with an all-in-one platform
                for managing teams, clients, and workflows. Automate the tedious
                tasks and focus on what matters most.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="text-sm text-zinc-500">
                  Get 3 months free with code{" "}
                  <span className="font-mono font-bold text-zinc-300 px-2 py-0.5 bg-zinc-800 rounded">
                    BIZFREE3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-zinc-900/30 scroll-mt-24" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-100">
                Everything You Need to Scale
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                One platform to manage it all. From team collaboration to client
                management, automate your workflow and boost productivity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="relative group rounded-lg border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-black/40 scroll-mt-24" id="about">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
                Why Choose HUBBER?
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Built for modern businesses managing multiple companies and
                teams. Experience the power of unified business management.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {whyHubberFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-zinc-100">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
                          {feature.stat}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {feature.statText}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-xl border border-zinc-800/50 bg-black/50 p-8 mb-20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <div className="relative grid md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, i) => (
                  <figure key={i} className="relative space-y-4">
                    <blockquote className="text-lg text-zinc-300 italic">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <figcaption className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold text-zinc-100">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {testimonial.company}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-2" />
                Trusted by 1000+ companies worldwide
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-50">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-zinc-400/10 rounded" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-zinc-950 scroll-mt-24" id="pricing">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 text-center">
                Choose Your Plan
              </h2>
              <p className="text-zinc-400 text-center max-w-2xl mx-auto">
                Select the perfect plan for your team. All plans include a
                30-day free trial.
              </p>
              <div className="grid md:grid-cols-2 gap-8 pt-8 max-w-4xl mx-auto">
                {pricingTiers.map((tier, i) => (
                  <div
                    key={i}
                    className={`relative rounded-xl border ${
                      tier.highlighted ? "border-primary" : "border-zinc-800/50"
                    } bg-zinc-900/50 backdrop-blur-sm p-8 flex flex-col ${
                      tier.highlighted ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-zinc-100">
                        {tier.name}
                      </h3>
                      <p className="text-zinc-400 mt-2 min-h-[40px]">
                        {tier.description}
                      </p>
                    </div>
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-zinc-100">
                          ${tier.price}
                        </span>
                        <span className="text-zinc-400 ml-2">/month</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8 flex-grow">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center text-zinc-300">
                          <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="mt-auto">
                      <Button
                        className={`w-full ${
                          tier.highlighted
                            ? "bg-primary hover:bg-primary/90 text-white"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                        }`}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

