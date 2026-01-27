import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Mail, MapPin, ArrowRight, Instagram, Linkedin, Twitter, Youtube, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "@/hooks/useScrollAnimation";

// Custom TikTok icon (not available in lucide-react)
const TikTokIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom Substack icon (not available in lucide-react)
const SubstackIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
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
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [headingParallax, setHeadingParallax] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [inputsVisible, setInputsVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    // Trigger page entrance animation
    const timer1 = setTimeout(() => setIsPageVisible(true), 100);
    const timer2 = setTimeout(() => setInputsVisible(true), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
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
    w-full px-3 py-2 rounded-lg text-white/90 text-xs
    transition-all duration-500
    placeholder:text-white/30
    focus:outline-none
  `;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#000000' }}>
      {/* Corner Gradients with animations */}
      {/* Top Right Corner Gradient - Primary */}
      <div 
        className="fixed top-0 right-0 w-[800px] h-[800px] pointer-events-none animate-pulse-slow"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)',
          transform: 'translate(30%, -30%)',
          animation: 'gradientPulse 8s ease-in-out infinite, gradientShift 12s ease-in-out infinite',
        }}
      />
      {/* Top Right Corner Gradient - Secondary */}
      <div 
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.05) 0%, transparent 60%)',
          transform: 'translate(20%, -20%)',
          animation: 'gradientPulse 6s ease-in-out infinite reverse, gradientShiftAlt 10s ease-in-out infinite',
        }}
      />
      
      {/* Bottom Left Corner Gradient - Primary */}
      <div 
        className="fixed bottom-0 left-0 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
          animation: 'gradientPulse 9s ease-in-out infinite 2s, gradientShiftBottom 14s ease-in-out infinite',
        }}
      />
      {/* Bottom Left Corner Gradient - Secondary */}
      <div 
        className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)',
          transform: 'translate(-20%, 20%)',
          animation: 'gradientPulse 7s ease-in-out infinite 1s reverse, gradientShiftBottomAlt 11s ease-in-out infinite',
        }}
      />

      {/* Keyframes for animations */}
      <style>{`
        @keyframes gradientPulse {
          0%, 100% {
            opacity: 1;
            transform: translate(30%, -30%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(30%, -30%) scale(1.1);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            transform: translate(30%, -30%) rotate(0deg);
          }
          50% {
            transform: translate(25%, -35%) rotate(5deg);
          }
        }
        
        @keyframes gradientShiftAlt {
          0%, 100% {
            transform: translate(20%, -20%) rotate(0deg);
          }
          50% {
            transform: translate(15%, -25%) rotate(-3deg);
          }
        }
        
        @keyframes gradientShiftBottom {
          0%, 100% {
            transform: translate(-30%, 30%) rotate(0deg);
          }
          50% {
            transform: translate(-35%, 25%) rotate(-5deg);
          }
        }
        
        @keyframes gradientShiftBottomAlt {
          0%, 100% {
            transform: translate(-20%, 20%) rotate(0deg);
          }
          50% {
            transform: translate(-25%, 15%) rotate(3deg);
          }
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: isPageVisible ? 1 : 0,
          transform: isPageVisible ? 'translateX(0)' : 'translateX(-20px)',
        }}
      >
        <ArrowLeft size={14} className="text-white/60 transition-transform duration-300 group-hover:-translate-x-1" />
        <span className="text-white/70">Back</span>
      </button>

      <section className="relative z-10 py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          {/* Section Header */}
          <div 
            ref={headerRef}
            className="mb-12 transition-all duration-1000"
            style={{
              opacity: isPageVisible ? 1 : 0,
              filter: isPageVisible ? 'blur(0px)' : 'blur(20px)',
              transform: isPageVisible ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <h2 
              ref={headingRef}
              className="text-white text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 whitespace-nowrap"
              style={{
                transform: `translateY(${headingParallax}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              Let's Create
            </h2>
            <div 
              className="w-full bg-white py-1 flex justify-between px-4 sm:px-6 md:px-12 transition-all duration-1000"
              style={{
                opacity: isPageVisible ? 1 : 0,
                filter: isPageVisible ? 'blur(0px)' : 'blur(10px)',
                transform: isPageVisible ? 'translateY(0) scaleY(1)' : 'translateY(10px) scaleY(0.8)',
                transitionDelay: '0.3s',
              }}
            >
              <span className="text-black text-[8px] sm:text-[10px] font-bold tracking-wide">Vision</span>
              <span className="text-black text-[8px] sm:text-[10px] font-bold tracking-wide">Collaboration</span>
              <span className="text-black text-[8px] sm:text-[10px] font-bold tracking-wide">Excellence</span>
              <span className="text-black text-[8px] sm:text-[10px] font-bold tracking-wide">Together</span>
            </div>
          </div>

          <div 
            ref={contentRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16"
          >
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
              <p className="text-white/50 text-xs leading-relaxed mb-8 max-w-sm">
                Ready to bring your vision to life? We'd love to hear about your project and explore how we can help.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Mail size={14} className="text-white/60" />
                  </div>
                  <span className="text-white/70 text-xs">bmeet450@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <MapPin size={14} className="text-white/60" />
                  </div>
                  <span className="text-white/70 text-xs">New York</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110"
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
                          size={16} 
                          className="relative z-10 text-white/50 transition-all duration-300 group-hover:text-white group-hover:scale-110"
                        />
                      ) : (
                        <Icon 
                          size={16} 
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
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name Input */}
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
                  {errors.name && <p className="text-red-400/80 text-[10px] mt-1">{errors.name}</p>}
                </div>

                {/* Email Input */}
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
                  {errors.email && <p className="text-red-400/80 text-[10px] mt-1">{errors.email}</p>}
                </div>

                {/* Message Input */}
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
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClassName} resize-none`}
                    style={getInputStyle('message', !!errors.message)}
                  />
                  {errors.message && <p className="text-red-400/80 text-[10px] mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
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
                    className="group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-white/90">
                      {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
                    </span>
                    <ArrowRight 
                      size={14} 
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
