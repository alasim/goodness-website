import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import logo from "../../../imports/gs-logo.png";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/transparency", label: "Transparency" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/printables", label: "Printables" },
];

export function Nav() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-black/5"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div
        className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8"
        style={{ height: 72 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Goodness Society"
            className="h-18 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors relative ${
                  active
                    ? "text-[#1B7A34]"
                    : "text-[#0D0D0D] hover:text-[#1B7A34]"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/partner"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
            }}
          >
            Partner with Us
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors">
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <img
                  src={logo}
                  alt="Goodness Society"
                  className="h-9 w-auto"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-black/5"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-1">
                {links.map((link) => {
                  const active =
                    location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#f0faf3] text-[#1B7A34]"
                          : "text-[#0D0D0D] hover:bg-black/4"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto p-6 border-t border-black/5">
                <Link
                  to="/partner"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full px-5 py-3 rounded-full text-sm font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)",
                  }}
                >
                  Partner with Us
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}