import { Sparkles, Building2, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-transparent via-white/70 to-white pt-16 pb-8">
      {/* Visual top subtle glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 opacity-30" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        
        {/* Main Content Rows */}
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr]">
          
          {/* Brand Info */}
          <div className="space-y-5">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-90">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-sm">
                <img src="/brand-logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">AIBASS</span>
            </a>
            <p className="max-w-sm text-xs font-bold leading-relaxed text-slate-500">
              Simplify bookkeeping, invoicing, GST, inventory and financial reporting with AIBASS AI accounting software. Use voice or text commands to manage your business operations.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow"
                >
                  <soc.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b-2 border-sky-500 pb-1.5 w-fit">
              Product
            </h4>
            <ul className="space-y-3 text-xs font-bold text-slate-500">
              <li><a href="/#features" className="hover:text-slate-900 transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a></li>
              <li><a href="/#business" className="hover:text-slate-900 transition-colors">Businesses</a></li>
              <li><a href="/#why-choose" className="hover:text-slate-900 transition-colors">Why Choose AIBASS</a></li>
              <li><a href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing Options</a></li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b-2 border-indigo-500 pb-1.5 w-fit">
              Contact & Address
            </h4>
            <div className="space-y-3 text-xs font-bold text-slate-500 leading-relaxed">
              <p className="text-slate-900">
                Phone: <a href="tel:+919487393318" className="hover:text-indigo-650 transition-colors font-extrabold text-indigo-600">+91 94873 93318</a>
              </p>
              <div className="space-y-1 pt-1 text-[11px] font-semibold text-slate-500">
                <p className="font-bold text-slate-800">Principal Place of Business:</p>
                <p>2nd Floor, No.119/1,</p>
                <p>Mariamman Kovil East Street,</p>
                <p>Near Jodhiram Super Market,</p>
                <p>Srivilliputhur, Virudhunagar District,</p>
                <p>Tamil Nadu - 626125</p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider / Bottom metadata */}
        <div className="flex flex-col gap-6 border-t border-slate-200/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-slate-400">
            <Building2 className="h-4 w-4 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
              SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED
            </p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 sm:text-right">
            © 2026 AIBASS. All rights reserved. Registered under Indian Companies Act.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
