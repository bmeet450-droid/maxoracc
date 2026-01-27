import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Mail, MapPin, ArrowRight, Instagram, Linkedin, Twitter, Youtube, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useScrollAnimation from "@/hooks/useScrollAnimation";
import cornerBlob from "@/assets/corner-blob.png";
import ContactParticles from "@/components/ContactParticles";

// Custom TikTok icon
const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom Substack icon
const SubstackIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/yourprofile", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/in/yourprofile", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/yourprofile", label: "Twitter" },
  { icon: TikTokIcon, href: "https://tiktok.com/@yourprofile", label: "TikTok", isCustom: true },
  { icon: Youtube, href: "https://youtube.com/@yourprofile", label: "YouTube" },
  { icon: SubstackIcon, href: "https://yourprofile.substack.com", label: "Substack", isCustom: true },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [headingParallax, setHeadingParallax] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [inputsVisible, setInputsVisible] = useState(false);
  const [blobsVisible, setBlobsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { ref: headerRef } = useScrollAnimation({ threshold: 0.2 });
  const { ref: contentRef } = useScrollAnimation({ threshold: 0.2 });

  const scrollToSection = (location.state as { from?: string })?.from;

  useEffect(() => {
    const timer1 = setTimeout(() => setIsPageVisible(true), 100);
    const timer2 = setTimeout(() => setInputsVisible(true), 600);
    const timer3 = setTimeout(() => setBlobsVisible(true), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      const offset = (clampedProgress - 0.5) * 80;
      setHeadingParallax(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (scrollToSection) {
      navigate('/', { state: { scrollTo: scrollToSection } });
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactForm] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const getInputStyle = (fieldName: string, hasError: boolean) => ({
    background: 'rgba(255,255,255,0.03)',
    border: hasError 
      ? '1px solid rgba(239,68,68,0.5)' 
      : focusedField === fieldName 
        ? '1px solid rgba(255,255,255,0.3)' 
        : '1px solid rgba(255,255,255,0.05)',
    boxShadow: focusedField === fieldName 
      ? '0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05), inset 0 0 20px rgba(255,255,255,0.02)' 
      : 'none',
  });

  const inputClassName = `
    w-full px-4 py-3 rounded-xl text-white/90 text-sm
    transition-all duration-500
    placeholder:text-white/30
    focus:outline-none
  `;

  // Calculate mouse-based parallax offsets for blobs
  const topRightParallax = {
    x: (mousePosition.x - 0.5) * -30,
    y: (mousePosition.y - 0.5) * -30,
  };
  const bottomLeftParallax = {
    x: (mousePosition.x - 0.5) * 30,
    y: (mousePosition.y - 0.5) * 30,
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
      <ContactParticles />

      <style>{`
        @keyframes blobShiftTopRight {
          0%, 100% {
            transform: translate(calc(25% + var(--mouse-x, 0px)), calc(-25% + var(--mouse-y, 0px))) rotate(195deg) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(calc(20% + var(--mouse-x, 0px)), calc(-30% + var(--mouse-y, 0px))) rotate(200deg) scale(1.03);
            opacity: 0.55;
          }
          50% {
            transform: translate(calc(30% + var(--mouse-x, 0px)), calc(-20% + var(--mouse-y, 0px))) rotate(190deg) scale(0.97);
            opacity: 0.65;
          }
          75% {
            transform: translate(calc(22% + var(--mouse-x, 0px)), calc(-28% + var(--mouse-y, 0px))) rotate(197deg) scale(1.01);
            opacity: 0.58;
          }
        }
        
        @keyframes blobShiftBottomLeft {
          0%, 100% {
            transform: translate(calc(-25% + var(--mouse-x, 0px)), calc(25% + var(--mouse-y, 0px))) rotate(15deg) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(calc(-30% + var(--mouse-x, 0px)), calc(20% + var(--mouse-y, 0px))) rotate(10deg) scale(1.02);
            opacity: 0.55;
          }
          50% {
            transform: translate(calc(-20% + var(--mouse-x, 0px)), calc(30% + var(--mouse-y, 0px))) rotate(20deg) scale(0.98);
            opacity: 0.65;
          }
          75% {
            transform: translate(calc(-28% + var(--mouse-x, 0px)), calc(22% + var(--mouse-y, 0px))) rotate(12deg) scale(1.01);
            opacity: 0.58;
          }
        }
        
        @keyframes blobEnterTopRight {
          0% {
            transform: translate(100%, -100%) rotate(195deg) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: translate(25%, -25%) rotate(195deg) scale(1);
            opacity: 0.6;
          }
        }
        
        @keyframes blobEnterBottomLeft {
          0% {
            transform: translate(-100%, 100%) rotate(15deg) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: translate(-25%, 25%) rotate(15deg) scale(1);
            opacity: 0.6;
          }
        }
      `}</style>

      {/* Top Right Corner Blob with mouse parallax */}
      <img 
        src={cornerBlob}
        alt=""
        className="fixed top-0 right-0 w-[500px] md:w-[700px] lg:w-[900px] h-auto pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: blobsVisible 
            ? `translate(calc(25% + ${topRightParallax.x}px), calc(-25% + ${topRightParallax.y}px)) rotate(195deg)` 
            : 'translate(100%, -100%) rotate(195deg) scale(0.5)',
          opacity: blobsVisible ? 0.6 : 0,
          animation: blobsVisible ? 'blobEnterTopRight 1.2s ease-out forwards' : 'none',
        }}
      />
      
      {/* Bottom Left Corner Blob with mouse parallax */}
      <img 
        src={cornerBlob}
        alt=""
        className="fixed bottom-0 left-0 w-[500px] md:w-[700px] lg:w-[900px] h-auto pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: blobsVisible 
            ? `translate(calc(-25% + ${bottomLeftParallax.x}px), calc(25% + ${bottomLeftParallax.y}px)) rotate(15deg)` 
            : 'translate(-100%, 100%) rotate(15deg) scale(0.5)',
          opacity: blobsVisible ? 0.6 : 0,
          animation: blobsVisible ? 'blobEnterBottomLeft 1.2s ease-out forwards' : 'none',
        }}
      />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: isPageVisible ? 1 : 0,
          transform: isPageVisible ? 'translateX(0)' : 'translateX(-20px)',
        }}
      >
        <ArrowLeft size={16} className="text-white/60 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-white/70">Back</span>
      </button>

      <section className="relative z-10 py-32 md:py-48 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          {/* Section Header - Liquid Glass Container with enhanced glow */}
          <div 
            ref={headerRef}
            className="mb-16 transition-all duration-1000 flex justify-center"
            style={{
              opacity: isPageVisible ? 1 : 0,
              filter: isPageVisible ? 'blur(0px)' : 'blur(20px)',
              transform: isPageVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            {/* Liquid Glass Container with stronger border glow */}
            <div 
              className="relative px-8 sm:px-12 md:px-20 py-8 md:py-12 rounded-[40px] md:rounded-[60px] max-w-4xl w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.5) 100%)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: `
                  0 0 60px rgba(255,255,255,0.08),
                  0 0 100px rgba(255,255,255,0.05),
                  0 8px 32px rgba(0,0,0,0.4),
                  inset 0 1px 0 rgba(255,255,255,0.15),
                  inset 0 -1px 0 rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Enhanced glass highlight */}
              <div 
                className="absolute top-0 left-[5%] right-[5%] h-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                }}
              />
              
              <h2 
                ref={headingRef}
                className="text-white text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-center"
                style={{
                  transform: `translateY(${headingParallax}px)`,
                  transition: 'transform 0.1s ease-out',
                  textShadow: '0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(255,255,255,0.1)',
                }}
              >
                Let's Create
              </h2>
              
              <div 
                className="mt-6 md:mt-8 w-full bg-white/90 py-1 sm:py-2 flex justify-between px-4 sm:px-8 md:px-12 rounded-full transition-all duration-1000"
                style={{
                  opacity: isPageVisible ? 1 : 0,
                  filter: isPageVisible ? 'blur(0px)' : 'blur(10px)',
                  transform: isPageVisible ? 'translateY(0) scaleY(1)' : 'translateY(10px) scaleY(0.8)',
                  transitionDelay: '0.3s',
                }}
              >
                <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Vision</span>
                <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Collaboration</span>
                <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Excellence</span>
                <span className="text-black text-[10px] sm:text-xs font-bold tracking-wide">Together</span>
              </div>
            </div>
          </div>

          {/* Reduced gap between columns */}
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Left Column - Info */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: isPageVisible ? 1 : 0,
                filter: isPageVisible ? 'blur(0px)' : 'blur(15px)',
                transform: isPageVisible ? 'translateX(0)' : 'translateX(-40px)',
                transitionDelay: '0.2s',
              }}
            >
              <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                Ready to bring your vision to life? We'd love to hear about your project and explore how we can help.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Mail size={18} className="text-white/60" />
                  </div>
                  <span className="text-white/70 text-sm">bmeet450@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <MapPin size={18} className="text-white/60" />
                  </div>
                  <span className="text-white/70 text-sm">New York</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                          filter: 'blur(8px)',
                        }}
                      />
                      {social.isCustom ? (
                        <social.icon 
                          size={20} 
                          className="relative z-10 text-white/50 transition-all duration-300 group-hover:text-white group-hover:scale-110"
                        />
                      ) : (
                        <Icon 
                          size={20} 
                          className="relative z-10 text-white/50 transition-all duration-300 group-hover:text-white group-hover:scale-110"
                        />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Form */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: isPageVisible ? 1 : 0,
                filter: isPageVisible ? 'blur(0px)' : 'blur(15px)',
                transform: isPageVisible ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '0.4s',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div 
                  className="relative transition-all duration-700"
                  style={{
                    opacity: inputsVisible ? 1 : 0,
                    transform: inputsVisible ? 'scale(1)' : 'scale(0.8)',
                    transitionDelay: '0ms',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClassName}
                    style={getInputStyle('name', !!errors.name)}
                  />
                  {errors.name && <p className="text-red-400/80 text-xs mt-1">{errors.name}</p>}
                </div>

                <div 
                  className="relative transition-all duration-700"
                  style={{
                    opacity: inputsVisible ? 1 : 0,
                    transform: inputsVisible ? 'scale(1)' : 'scale(0.8)',
                    transitionDelay: '100ms',
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={inputClassName}
                    style={getInputStyle('email', !!errors.email)}
                  />
                  {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email}</p>}
                </div>

                <div 
                  className="relative transition-all duration-700"
                  style={{
                    opacity: inputsVisible ? 1 : 0,
                    transform: inputsVisible ? 'scale(1)' : 'scale(0.8)',
                    transitionDelay: '200ms',
                  }}
                >
                  <textarea
                    placeholder="Tell us about your project..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClassName} resize-none`}
                    style={getInputStyle('message', !!errors.message)}
                  />
                  {errors.message && <p className="text-red-400/80 text-xs mt-1">{errors.message}</p>}
                </div>

                <div
                  className="transition-all duration-700"
                  style={{
                    opacity: inputsVisible ? 1 : 0,
                    transform: inputsVisible ? 'scale(1)' : 'scale(0.8)',
                    transitionDelay: '300ms',
                  }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-white/90">
                      {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
                    </span>
                    <ArrowRight 
                      size={16} 
                      className="text-white/60 transition-transform duration-300 group-hover:translate-x-1" 
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
