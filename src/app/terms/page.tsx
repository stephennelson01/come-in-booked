import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ComeInBooked Terms of Service - Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: January 1, 2025
          </p>

          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using ComeInBooked (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
              these Terms, please do not use our Service.
            </p>
            <p>
              These Terms apply to all users of the Service, including customers
              who book appointments and service providers (&quot;Merchants&quot;) who offer
              services through our platform.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              ComeInBooked provides an online platform that connects customers with
              local service providers in beauty, wellness, fashion, and creative
              services. Our Service allows:
            </p>
            <ul>
              <li>Customers to discover, book, and pay for services</li>
              <li>Merchants to manage appointments, accept payments, and grow their business</li>
              <li>Both parties to communicate regarding bookings</li>
            </ul>

            <h2>3. User Accounts</h2>
            <h3>3.1 Registration</h3>
            <p>
              To use certain features of the Service, you must create an account.
              You agree to provide accurate, current, and complete information
              during registration and to update such information to keep it
              accurate, current, and complete.
            </p>
            <h3>3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use
              of your account.
            </p>
            <h3>3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at any
              time for any reason, including violation of these Terms. You may
              also delete your account at any time through your account settings.
            </p>

            <h2>4. Booking and Cancellation</h2>
            <h3>4.1 Booking Appointments</h3>
            <p>
              When you book an appointment through the Service, you are entering
              into an agreement with the Merchant to receive services at the
              specified time. You agree to arrive on time and to pay for services
              as agreed.
            </p>
            <h3>4.2 Cancellation Policy</h3>
            <p>
              Each Merchant may set their own cancellation policy, which will be
              displayed before you confirm your booking. By booking an appointment,
              you agree to the Merchant&apos;s cancellation policy.
            </p>
            <h3>4.3 No-Shows</h3>
            <p>
              Failure to appear for a scheduled appointment may result in charges
              according to the Merchant&apos;s policy. Repeated no-shows may result in
              account suspension.
            </p>

            <h2>5. Payments</h2>
            <h3>5.1 Payment Processing</h3>
            <p>
              Payment processing is handled by our third-party payment processor,
              Stripe. By making a payment, you agree to Stripe&apos;s terms of service.
            </p>
            <h3>5.2 Pricing</h3>
            <p>
              Merchants set their own prices for services. All prices are displayed
              before you confirm your booking. We are not responsible for pricing
              errors made by Merchants.
            </p>
            <h3>5.3 Refunds</h3>
            <p>
              Refund policies are set by individual Merchants and displayed on their
              profiles. ComeInBooked may facilitate refunds but is not responsible
              for a Merchant&apos;s refund decisions.
            </p>

            <h2>6. Merchant Terms</h2>
            <h3>6.1 Service Quality</h3>
            <p>
              Merchants agree to provide services as described and to maintain
              professional standards. Merchants are responsible for their own
              licensing, insurance, and compliance with applicable laws.
            </p>
            <h3>6.2 Fees</h3>
            <p>
              Merchants agree to pay ComeInBooked a commission of 2.9% plus ₦100
              per successful booking. Fees are deducted from payments before
              disbursement.
            </p>
            <h3>6.3 Accurate Information</h3>
            <p>
              Merchants agree to provide accurate information about their services,
              pricing, and availability. Misleading information may result in
              account termination.
            </p>

            <h2>7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use automated means to access the Service without permission</li>
              <li>Interfere with the proper working of the Service</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by ComeInBooked and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
              WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE
              THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
            <p>
              WE ARE NOT RESPONSIBLE FOR THE QUALITY, SAFETY, OR LEGALITY OF
              SERVICES PROVIDED BY MERCHANTS. YOU USE THE SERVICE AT YOUR OWN
              RISK.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMEINBOOKED SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ComeInBooked and its
              officers, directors, employees, and agents from any claims, damages,
              losses, or expenses arising from your use of the Service or
              violation of these Terms.
            </p>

            <h2>12. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or use of the Service shall
              be resolved through the courts of the Federal Republic of Nigeria,
              in accordance with applicable Nigerian arbitration and dispute
              resolution laws.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify users of
              material changes via email or through the Service. Your continued
              use of the Service after changes constitutes acceptance of the
              modified Terms.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              ComeInBooked<br />
              Lagos, Nigeria<br />
              Email: legal@comeinbooked.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
