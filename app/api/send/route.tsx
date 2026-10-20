import { NextResponse } from "next/server";
import { Resend } from "resend";
import i18nConfig from "@/i18nConfig";
import initTranslations from "@/app/i18n";
import { render } from "@react-email/components";
import ContactEmail from "@/emails/ContactEmail";

const ns = ["common", "email"];

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_build";
  const resend = new Resend(apiKey);

  try {
    const { to, subjectKey, bodyKey, dynamicData, preferredLocale } =
      await request.json();

    if (apiKey === "re_dummy_key_for_build") {
      console.error("API Error: RESEND_API_KEY is not set.");
      return NextResponse.json(
        { error: "Resend API key is not configured on the server." },
        { status: 500 }
      );
    }

    const locale =
      preferredLocale ||
      request.headers.get("Accept-Language")?.split(",")[0].split("-")[0] ||
      i18nConfig.defaultLocale;

    console.log(`API: Sending email for locale: ${locale}`);

    const t = await initTranslations(locale, ns);

    const translatedSubject = t(subjectKey, { ns: "email", ...dynamicData });
    const translatedBody = t(bodyKey, { ns: "email", ...dynamicData });
    const emailSignature = t("email_signature", { ns: "email" });

    const html = await render(
      <ContactEmail
        userName={dynamicData.userName}
        userEmail={dynamicData.userEmail}
        userMessage={dynamicData.userMessage}
        translatedSubject={String(translatedSubject)}
        translatedBody={String(translatedBody)}
        emailSignature={String(emailSignature)}
        locale={locale}
      />
    );

    const { data, error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: [to],
      subject: translatedSubject,
      html: html,
    });

    if (error) {
      console.error("API: Error sending email:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("API: Email sent successfully:", data);
    return NextResponse.json({
      message: "Email sent successfully",
      data,
    });
  } catch (error) {
    console.error("API: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email API is running. Use POST to send emails.",
  });
}
