import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials are not configured");
    }

    const { name, email, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, and message are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }

    // Create Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Store submission in database
    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save submission");
    }

    console.log("Submission saved:", submission.id);

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
        subject: `New Contact Form Submission from ${name}`,
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
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="value message-value">${message}</div>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        reply_to: email,
      }),
    });

    let emailSent = false;
    if (notificationRes.ok) {
      emailSent = true;
      console.log("Notification email sent successfully");
    } else {
      console.error("Failed to send notification email:", await notificationRes.text());
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
        to: [email],
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
                  <p class="greeting">Hi ${name},</p>
                  <p class="message">
                    Thank you for reaching out to Maxora! We've received your message and are excited to learn more about your project. Our team will review your inquiry and get back to you within 24-48 hours.
                  </p>
                  <div class="summary">
                    <div class="summary-title">Your Message</div>
                    <div class="summary-content">${message}</div>
                  </div>
                  <p class="message">
                    In the meantime, feel free to explore our portfolio and learn more about what we do. We look forward to the possibility of working together!
                  </p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Maxora. All rights reserved.</p>
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
      console.log("Confirmation email sent successfully");
    } else {
      console.error("Failed to send confirmation email:", await confirmationRes.text());
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
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
