import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy - Flippress",
  description:
    "Learn how Flippress handles and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 16, 2024</p>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide when you create an account,
            publish content, or interact with Flippress. This includes your
            profile details, uploaded content, and usage activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Information</h2>
          <p className="text-muted-foreground">
            We use collected data to provide and improve our services,
            personalize your experience, communicate updates, and maintain
            security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Information Sharing</h2>
          <p className="text-muted-foreground">
            We don’t sell your information. It may be shared with trusted
            service providers, when legally required, or during business
            transitions such as mergers or acquisitions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p className="text-muted-foreground">
            We use appropriate measures to safeguard your data, though no online
            system is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy periodically. Updates will be
            posted here with a revised "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            For questions, reach us at{" "}
            <a
              href="mailto:privacy@flippress.com"
              className="text-blue-500 hover:underline"
            >
              privacy@flippress.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
