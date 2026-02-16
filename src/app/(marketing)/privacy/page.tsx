import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Palmtell",
  description: "Privacy Policy for Palmtell. Learn how we collect, use, and protect your personal information when using our palm reading and astrology services.",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: January 1, 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Personal Information</h4>
              <p>
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and email address</li>
                <li>Date of birth (for horoscope features)</li>
                <li>Profile information you choose to provide</li>
                <li>Payment information (processed securely by Stripe)</li>
              </ul>

              <h4 className="font-semibold">Palm Photos</h4>
              <p>
                When you upload palm photos for analysis:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Photos are stored securely in encrypted cloud storage</li>
                <li>Photos are used solely for AI analysis and service provision</li>
                <li>You can delete your photos at any time</li>
                <li>Photos are not shared with third parties</li>
              </ul>

              <h4 className="font-semibold">Usage Data</h4>
              <p>
                We automatically collect information about how you use our service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Features used and interactions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide palm reading and horoscope services</li>
                <li>Process your payments and manage subscriptions</li>
                <li>Send important account and service notifications</li>
                <li>Improve our AI analysis and service quality</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  We do not sell your personal information to third parties.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We may share your information only in these limited circumstances:</p>
              
              <h4 className="font-semibold">Service Providers</h4>
              <p>We work with trusted third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Clerk.dev</strong> - Authentication and user management</li>
                <li><strong>Stripe</strong> - Payment processing</li>
                <li><strong>OpenAI</strong> - AI analysis (photos only, no personal data)</li>
                <li><strong>Cloudflare</strong> - Secure file storage and CDN</li>
                <li><strong>Resend</strong> - Transactional emails</li>
              </ul>

              <h4 className="font-semibold">Legal Requirements</h4>
              <p>We may disclose information when required by law or to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with legal process or government requests</li>
                <li>Protect our rights and property</li>
                <li>Ensure user safety and prevent fraud</li>
                <li>Investigate violations of our Terms of Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure cloud infrastructure with access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>Limited employee access on a need-to-know basis</li>
                <li>Secure payment processing through Stripe</li>
              </ul>
              <p>
                While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Account Management</h4>
              <p>You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update your profile information at any time</li>
                <li>Delete your uploaded palm photos</li>
                <li>Cancel your subscription</li>
                <li>Delete your account entirely</li>
              </ul>

              <h4 className="font-semibold">Data Rights (GDPR/CCPA)</h4>
              <p>If you're in the EU or California, you have additional rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Rectification</strong> - Correct inaccurate information</li>
                <li><strong>Erasure</strong> - Request deletion of your data</li>
                <li><strong>Portability</strong> - Receive your data in a portable format</li>
                <li><strong>Objection</strong> - Object to processing of your data</li>
              </ul>

              <p>To exercise these rights, contact us at privacy@palmtell.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences</li>
                <li>Analyze site usage and performance</li>
                <li>Provide personalized experiences</li>
              </ul>
              
              <h4 className="font-semibold">Cookie Types</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential</strong> - Required for basic site functionality</li>
                <li><strong>Analytics</strong> - Help us understand site usage</li>
                <li><strong>Preferences</strong> - Remember your settings</li>
              </ul>

              <p>You can control cookies through your browser settings, but disabling them may affect site functionality.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We retain your information for as long as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account is active</li>
                <li>Needed to provide services</li>
                <li>Required by law or for legal purposes</li>
                <li>Necessary for legitimate business interests</li>
              </ul>
              
              <p>When you delete your account:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information is deleted within 30 days</li>
                <li>Palm photos are immediately removed</li>
                <li>Some data may be retained for legal compliance</li>
                <li>Anonymized usage data may be kept for analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Standard contractual clauses for EU data transfers</li>
                <li>Adequacy decisions where available</li>
                <li>Other lawful transfer mechanisms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our service is not intended for children under 13 (or 16 in the EU). We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will delete it promptly.
              </p>
              <p>
                If you believe we have collected information from a child, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Posting the new policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending an email notification for significant changes</li>
              </ul>
              <p>
                Your continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have questions about this Privacy Policy or our data practices, contact us:
              </p>
              <ul className="space-y-2">
                <li>Email: privacy@palmtell.com</li>
                <li>Website: <Link href="/" className="text-primary hover:underline">palmtell.com</Link></li>
              </ul>
              
              <p>For data protection inquiries from EU residents:</p>
              <ul className="space-y-2">
                <li>Email: dpo@palmtell.com</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            This Privacy Policy is part of our Terms of Service and governs your use of Palmtell.
          </p>
        </div>
      </div>
    </div>
  );
}
