import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ComeInBooked Privacy Policy - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <h2>1. Introduction</h2>
            <p>
              ComeInBooked, Inc. (&quot;ComeInBooked,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects
              your privacy and is committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our website and mobile application
              (collectively, the &quot;Service&quot;).
            </p>
            <p>
              Please read this Privacy Policy carefully. By using the Service, you
              agree to the collection and use of information in accordance with
              this policy.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <p>We collect information you voluntarily provide, including:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email address, phone
                number, and password when you create an account.
              </li>
              <li>
                <strong>Profile Information:</strong> Profile photo, preferences,
                and any other information you choose to add to your profile.
              </li>
              <li>
                <strong>Booking Information:</strong> Service preferences,
                appointment history, and notes related to your bookings.
              </li>
              <li>
                <strong>Payment Information:</strong> Credit card details and
                billing address (processed securely by Stripe).
              </li>
              <li>
                <strong>Communications:</strong> Messages you send to Merchants
                or our support team.
              </li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>
              When you use the Service, we automatically collect certain
              information, including:
            </p>
            <ul>
              <li>
                <strong>Device Information:</strong> IP address, browser type,
                operating system, and device identifiers.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on the Service, and search queries.
              </li>
              <li>
                <strong>Location Data:</strong> General location based on IP
                address; precise location only with your consent.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> Information collected
                through cookies and similar technologies.
              </li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>We may receive information from:</p>
            <ul>
              <li>Social login providers (e.g., Google) if you choose to sign up using their services</li>
              <li>Payment processors regarding transaction status</li>
              <li>Marketing partners for advertising purposes</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service</li>
              <li>Process bookings and payments</li>
              <li>Send booking confirmations and reminders</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Personalize your experience and show relevant content</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Detect, prevent, and address fraud and security issues</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve our Service</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We may share your information with:</p>
            <h3>4.1 Service Providers (Merchants)</h3>
            <p>
              When you book an appointment, we share necessary information with
              the Merchant to fulfill your booking (name, contact information,
              booking details).
            </p>
            <h3>4.2 Third-Party Service Providers</h3>
            <p>
              We use third-party services to help operate our Service, including:
            </p>
            <ul>
              <li>Stripe for payment processing</li>
              <li>AWS for cloud hosting</li>
              <li>Resend for email communications</li>
              <li>Twilio for SMS notifications</li>
              <li>Analytics providers to understand usage</li>
            </ul>
            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose information if required by law, court order, or
              governmental regulation, or to protect our rights, privacy, safety,
              or property.
            </p>
            <h3>4.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your
              information may be transferred to the acquiring entity.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to provide
              the Service and fulfill the purposes described in this Privacy
              Policy. When you delete your account, we will delete or anonymize
              your data within 30 days, except where we are required to retain
              it for legal or business purposes.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data, including:
            </p>
            <ul>
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>
              However, no method of transmission or storage is 100% secure. We
              cannot guarantee absolute security.
            </p>

            <h2>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal data
              </li>
              <li>
                <strong>Portability:</strong> Receive your data in a portable format
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing communications
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Where processing is based on consent
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@comeinbooked.com.
            </p>

            <h2>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use the Service</li>
              <li>Provide personalized content and ads</li>
            </ul>
            <p>
              You can control cookies through your browser settings. See our
              Cookie Policy for more details.
            </p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for children under 16 years of age. We
              do not knowingly collect personal information from children. If we
              learn that we have collected data from a child under 16, we will
              delete it promptly.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for such transfers, including Standard Contractual Clauses where
              required.
            </p>

            <h2>11. California Privacy Rights (CCPA)</h2>
            <p>If you are a California resident, you have additional rights:</p>
            <ul>
              <li>Right to know what personal information we collect and how it&apos;s used</li>
              <li>Right to delete your personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of material changes by email or through the Service. Your
              continued use after such notice constitutes acceptance of the
              changes.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <p>
              ComeInBooked<br />
              Attn: Privacy Team<br />
              29 The Causeway<br />
              DL1 1EN, Darlington<br />
              United Kingdom<br />
              Email: privacy@comeinbooked.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
