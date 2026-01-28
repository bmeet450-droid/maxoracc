import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Allowed origins for CORS - restrict to production and development domains
const ALLOWED_ORIGINS = [
  "https://maxoracc.lovable.app",
  "https://id-preview--ad622568-224d-4720-a5d7-65a7c80db699.lovable.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const getCorsHeaders = (origin: string | null) => {
  // Check if the origin is in our allowed list
  const allowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovable.app')
  ) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// HTML escape function to prevent XSS in email templates
const escapeHtml = (text: string): string => {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per IP per hour

// Simple in-memory rate limiting (resets on function cold start, but provides basic protection)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
};

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check rate limit based on client IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { 
          status: 429, 
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": "3600",
            ...corsHeaders 
          } 
        }
      );
    }

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing required environment configuration");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Please fill in all required fields." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Input length validation
    if (name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be less than 100 characters." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Email must be less than 255 characters." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message must be less than 5000 characters." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store submission in database
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Unable to process your request. Please try again later." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Escape user input for safe HTML embedding
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    // Send notification email to the business
    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Maxora Contact <onboarding@resend.dev>",
        to: ["bmeet450@gmail.com"],
        subject: `New Contact Form Submission from ${safeName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
              .value { margin-top: 5px; padding: 15px; background: white; border-radius: 8px; border-left: 3px solid #333; }
              .message-value { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0; opacity: 0.8;">Someone wants to work with you!</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${safeName}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value message-value">${safeMessage}</div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        reply_to: email.trim(),
      }),
    });

    let emailSent = false;
    if (notificationRes.ok) {
      emailSent = true;
    } else {
      console.error("Failed to send notification email");
    }

    // Send confirmation email to the sender
    const confirmationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Maxora <onboarding@resend.dev>",
        to: [email.trim()],
        subject: "Thank you for contacting Maxora!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
              .header p { margin: 10px 0 0; opacity: 0.8; font-size: 16px; }
              .content { padding: 40px 30px; }
              .greeting { font-size: 18px; margin-bottom: 20px; }
              .message { color: #666; margin-bottom: 30px; }
              .summary { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
              .summary-title { font-weight: 600; color: #333; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
              .summary-content { color: #666; font-size: 14px; white-space: pre-wrap; }
              .footer { text-align: center; padding: 30px; background: #fafafa; border-top: 1px solid #eee; }
              .footer p { margin: 0; color: #999; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <h1>Thank You!</h1>
                  <p>We've received your message</p>
                </div>
                <div class="content">
                  <p class="greeting">Hi ${safeName},</p>
                  <p class="message">
                    Thank you for reaching out to Maxora! We've received your message and are excited to learn more about your project. Our team will review your inquiry and get back to you within 24-48 hours.
                  </p>
                  <div class="summary">
                    <div class="summary-title">Your Message</div>
                    <div class="summary-content">${safeMessage}</div>
                  </div>
                  <p class="message">
                    In the meantime, feel free to explore our portfolio and learn more about what we do. We look forward to the possibility of working together!
                  </p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Maxora. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    let confirmationSent = false;
    if (confirmationRes.ok) {
      confirmationSent = true;
    } else {
      console.error("Failed to send confirmation email");
    }

    // Update database with email status
    await supabase
      .from("contact_submissions")
      .update({
        email_sent: emailSent,
        confirmation_sent: confirmationSent,
      })
      .eq("id", submission.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: submission.id,
        emailSent,
        confirmationSent,
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders(req.headers.get("origin")) },
      }
    );
  }
};

serve(handler);