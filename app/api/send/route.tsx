import { NextResponse } from "next/server";
import { Resend } from "resend";
import i18nConfig from "@/i18nConfig";
import { createI18nInstance } from "@/lib/i18n";
import { render } from "@react-email/components";
import { ContactFormEmail } from "@/emails/ContactFormEmail";
import fs from "fs/promises";
import path from "path";

const ns = ["common", "email"];

async function loadTranslations(locale: string, namespaces: string[]) {
  const i18nInstance = createI18nInstance();
  const resources: Record<string, Record<string, string>> = {};

  for (const namespace of namespaces) {
    try {
      const filePath = path.join(process.cwd(), "public", "locales", locale, `${namespace}.json`);
      const fileContent = await fs.readFile(filePath, "utf8");
      resources[namespace] = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Failed to load translation for ${locale}/${namespace}, falling back to ${i18nConfig.defaultLocale}`);
      try {
        const fallbackPath = path.join(process.cwd(), "public", "locales", i18nConfig.defaultLocale, `${namespace}.json`);
        const fallbackContent = await fs.readFile(fallbackPath, "utf8");
        resources[namespace] = JSON.parse(fallbackContent);
      } catch (fallbackError) {
        console.error(`Critical: Could not load fallback translation for namespace ${namespace}`);
        resources[namespace] = {};
      }
    }
  }

  await i18nInstance.init({
    lng: locale,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    ns: namespaces,
    defaultNS: namespaces[0],
    resources: {
      [locale]: resources,
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18nInstance;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_build";
  const resend = new Resend(apiKey);

  try {
    const { to, subjectKey, bodyKey, dynamicData, preferredLocale } = await request.json();

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

    const i18nInstance = await loadTranslations(locale, ns);

    const translatedSubject = i18nInstance.t(subjectKey, { ns: "email", ...dynamicData });
    const translatedBody = i18nInstance.t(bodyKey, { ns: "email", ...dynamicData });
    const emailSignature = i18nInstance.t("email_signature", { ns: "email" });

    const html = await render(
      <ContactFormEmail
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
