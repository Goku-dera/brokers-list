import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-widest text-slate-500 uppercase">
        <span className="text-white font-bold text-sm normal-case tracking-wide">
          Woxa
        </span>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="hover:text-slate-300 cursor-pointer transition">
            Privacy Policy
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition">
            Terms of Service
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition">
            Risk Disclosure
          </span>
          <Link href="/brokers" className="hover:text-slate-300 transition">
            Contact
          </Link>
        </div>
        <span className="text-slate-600">
          © {new Date().getFullYear()} Woxa. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
