import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "ComeInBooked Cookie Policy - Learn about how we use cookies and similar technologies.",
};

const cookieTypes = [
  {
    title: "Essential Cookies",
    description: "Required for the website to function properly",
    examples: [
      "Session cookies to keep you logged in",
      "Security cookies to prevent fraud",
      "Load balancing cookies for performance",
    ],
    canDisable: false,
  },
  {
    title: "Functional Cookies",
    description: "Remember your preferences and settings",
    examples: [
      "Language preferences",
      "Theme settings (dark/light mode)",
      "Recently viewed businesses",
    ],
    canDisable: true,
  },
  {
    title: "Analytics Cookies",
    description: "Help us understand how visitors use our site",
    examples: [
      "Pages visited and time spent",
      "Click patterns and navigation paths",
      "Error tracking and performance monitoring",
    ],
    canDisable: true,
  },
  {
    title: "Marketing Cookies",
    description: "Used to deliver relevant advertisements",
    examples: [
      "Ad targeting and retargeting",
      "Measuring ad effectiveness",
      "Social media integration",
    ],
    canDisable: true,
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when
              you visit a website. They are widely used to make websites work
              more efficiently, provide a better user experience, and give
              website owners information about how their site is being used.
            </p>
            <p>
              We also use similar technologies such as pixels, beacons, and
              local storage to collect information and provide certain features.
            </p>

            <h2>How We Use Cookies</h2>
            <p>
              ComeInBooked uses cookies and similar technologies for several
              purposes:
            </p>
            <ul>
              <li>To keep you signed in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To understand how you use our Service</li>
              <li>To improve our Service based on usage patterns</li>
              <li>To show you relevant content and advertisements</li>
              <li>To measure the effectiveness of our marketing campaigns</li>
            </ul>
          </div>

          {/* Cookie Types Cards */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Types of Cookies We Use</h2>
            {cookieTypes.map((type) => (
              <Card key={type.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    {type.canDisable ? (
                      <span className="rounded-full bg-muted px-3 py-1 text-sm">
                        Optional
                      </span>
                    ) : (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        Required
                      </span>
                    )}
                  </div>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="prose prose-gray mt-12 max-w-none dark:prose-invert">
            <h2>Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use cookies from
              trusted third-party services:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> Helps us understand how
                visitors interact with our website.
              </li>
              <li>
                <strong>Stripe:</strong> Processes payments securely.
              </li>
              <li>
                <strong>Mapbox:</strong> Provides mapping functionality.
              </li>
              <li>
                <strong>Social Media Platforms:</strong> Enable sharing and
                social login features.
              </li>
            </ul>
            <p>
              These third parties have their own privacy policies governing how
              they use your information.
            </p>

            <h2>Managing Cookies</h2>
            <p>
              You have several options for managing cookies:
            </p>
            <h3>Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their
              settings. You can typically:
            </p>
            <ul>
              <li>See what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Block all cookies entirely</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p>
              Please note that blocking or deleting cookies may impact your
              experience on our Service. Some features may not work properly
              without certain cookies.
            </p>

            <h3>Cookie Preferences</h3>
            <p>
              You can adjust your cookie preferences on our website at any time
              by clicking the button below:
            </p>
          </div>

          <div className="mt-6">
            <Button variant="outline">Manage Cookie Preferences</Button>
          </div>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <h3>Opt-Out Links</h3>
            <p>
              You can also opt out of certain third-party cookies through these
              services:
            </p>
            <ul>
              <li>
                <strong>Google Analytics:</strong>{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <strong>Network Advertising Initiative:</strong>{" "}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NAI Consumer Opt-out
                </a>
              </li>
              <li>
                <strong>Digital Advertising Alliance:</strong>{" "}
                <a
                  href="https://optout.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DAA Opt-out
                </a>
              </li>
            </ul>

            <h2>Do Not Track</h2>
            <p>
              Some browsers have a &quot;Do Not Track&quot; feature that signals to
              websites that you do not want to be tracked. Our Service does not
              currently respond to Do Not Track signals, but we support your
              right to privacy and provide the cookie management options
              described above.
            </p>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will notify you of any material changes by
              posting the updated policy on our website with a new &quot;Last
              updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>
            <p>
              ComeInBooked<br />
              29 The Causeway<br />
              DL1 1EN, Darlington<br />
              United Kingdom<br />
              Email: privacy@comeinbooked.com
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terms">Terms of Service</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
