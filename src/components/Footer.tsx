import { Sparkles, Mail, Shield, Building2, Facebook, Twitter, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-200 bg-white/70 backdrop-blur-md pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        
        {/* Main Content Rows */}
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
          
          {/* Brand Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-sm text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">AIBASS</span>
            </div>
            <p className="max-w-sm text-xs font-semibold leading-relaxed text-slate-500">
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-250 bg-slate-50/50 text-slate-500 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950 transition-colors"
                >
                  <soc.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">Product</h4>
            <ul className="space-y-3 text-xs font-semibold text-slate-500">
              <li><a href="#features" className="hover:text-slate-950 transition-colors">Features</a></li>
              <li><a href="#solutions" className="hover:text-slate-950 transition-colors">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing Options</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">AI Command Centre</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">Support</h4>
            <ul className="space-y-3 text-xs font-semibold text-slate-500">
              <li><a href="#" className="hover:text-slate-950 transition-colors">Help Documentation</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">GST Guide India</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">API References</a></li>
              <li><a href="#" className="hover:text-slate-950 transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Newsletter</h4>
            <p className="text-xs font-semibold leading-relaxed text-slate-500">
              Subscribe to get latest Indian tax updates and AI finance guides directly in your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="email@company.com"
                className="flex-1 h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition-colors"
                required
              />
              <Button type="submit" className="h-10 rounded-xl bg-slate-950 px-3 text-white hover:bg-slate-800">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Divider / Bottom metadata */}
        <div className="flex flex-col gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-slate-400">
            <Building2 className="h-4 w-4" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">
              SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED
            </p>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 sm:text-right">
            © 2026 AIBASS. All rights reserved. Registered under Indian Companies Act.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
