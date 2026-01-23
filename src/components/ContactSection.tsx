import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import useScrollAnimation from "@/hooks/useScrollAnimation";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation({ threshold: 0.2 });

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
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setForm({ name: "", email: "", message: "" });
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const inputStyles = `
    w-full px-4 py-3 rounded-xl text-white/90 text-sm
    transition-all duration-300
    placeholder:text-white/30
    focus:outline-none focus:ring-1 focus:ring-white/20
  `;

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-8" style={{ background: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          {/* Left Column - Info */}
          <div
            ref={leftRef}
            className="transition-all duration-700"
            style={{
              opacity: leftVisible ? 1 : 0,
              transform: leftVisible ? 'translateX(0)' : 'translateX(-40px)',
            }}
          >
            <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase mb-2">Get in Touch</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight mb-6">
              Let's Create<br />Something Great
            </h2>
            <p className="text-white/50 text-sm md:text-base leading-relaxed mb-10 max-w-md">
              Ready to bring your vision to life? We'd love to hear about your project and explore how we can help.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Mail size={18} className="text-white/60" />
                </div>
                <span className="text-white/70 text-sm">hello@maxora.studio</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <MapPin size={18} className="text-white/60" />
                </div>
                <span className="text-white/70 text-sm">Los Angeles, California</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            ref={rightRef}
            className="transition-all duration-700 delay-150"
            style={{
              opacity: rightVisible ? 1 : 0,
              transform: rightVisible ? 'translateX(0)' : 'translateX(40px)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputStyles}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: errors.name ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                />
                {errors.name && <p className="text-red-400/80 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputStyles}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: errors.email ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                />
                {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Tell us about your project..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputStyles} resize-none`}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: errors.message ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.05)',
                  }}
                />
                {errors.message && <p className="text-red-400/80 text-xs mt-1">{errors.message}</p>}
              </div>

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
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
