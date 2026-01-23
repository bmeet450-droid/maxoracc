const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 md:py-12 px-4 md:px-8 border-t border-white/5" style={{ background: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="text-lg font-bold tracking-wider text-white/80">
            MAXORA
          </div>

          {/* Links */}
          <div className="flex gap-6 md:gap-8">
            <a href="#work" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              Work
            </a>
            <a href="#about" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              About
            </a>
            <a href="#services" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              Services
            </a>
            <a href="#contact" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-white/30 text-xs">
            © {currentYear} Maxora. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
