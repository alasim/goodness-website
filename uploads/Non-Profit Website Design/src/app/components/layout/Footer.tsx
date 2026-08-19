import { Link } from "react-router";
import { GSwash } from "../brand/GSwash";
import logo from "../../../imports/gs-logo.png";

export function Footer() {
  return (
    <footer className="relative bg-[#0D0D0D] text-white overflow-hidden">
      {/* G-swash ornament */}
      <div className="absolute top-0 right-0 pointer-events-none select-none">
        <GSwash width={400} height={280} color="#ffffff" opacity={0.04} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand col */}
          <div className="md:col-span-2">
            <img src={logo} alt="Goodness Society" className="h-10 w-auto mb-4 brightness-200 saturate-0 invert opacity-90" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Society for Initiatives of Goodness — a government-registered non-profit creating sustainable social impact through education, skills, and community empowerment.
            </p>
            <p className="mt-4 text-white/30 text-xs uppercase tracking-widest">Together for a Better Tomorrow</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Organisation</p>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/programs", label: "Programs" },
                { href: "/transparency", label: "Transparency" },
                { href: "/volunteers", label: "Our Volunteers" },
                { href: "/volunteer", label: "Volunteer With Us" },
                { href: "/partner", label: "Partner with Us" },
                { href: "/printables", label: "Printable Assets" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li className="text-white/60 text-sm">hello@goodnesssociety.org</li>
              <li className="text-white/60 text-sm">Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Goodness Society. All rights reserved.</p>
          <p className="text-white/20 text-xs">Registered Non-Profit Organisation</p>
        </div>
      </div>
    </footer>
  );
}
