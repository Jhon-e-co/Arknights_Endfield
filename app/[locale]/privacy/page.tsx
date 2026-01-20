import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Endfield Lab",
  description: "Learn how Endfield Lab collects, uses, and protects your data. Read our comprehensive privacy policy.",
  openGraph: {
    title: "Privacy Policy - Endfield Lab",
    description: "Learn how Endfield Lab collects, uses, and protects your data.",
  },
};

export default function PrivacyPage() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-zinc-50"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase text-zinc-900 mb-2">
              Privacy <span className="bg-[#FCEE21] px-1">Policy</span>
            </h1>
            <p className="text-zinc-600">
              Last Updated: January 17, 2026
            </p>
          </div>
          
          <div className="prose prose-zinc max-w-none bg-white rounded-lg p-8 shadow-sm">
            <h2>1. Disclaimer</h2>
            <p>
              ENDFIELD LAB is an <strong>unofficial fan project</strong> and is 
              <strong>not affiliated with, endorsed by, sponsored by, or specifically approved by GRYPHLINE or Hypergryph</strong>. 
              All game-related content, including characters, images, and game mechanics, are the property of their respective owners.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Authentication Data</h3>
            <ul>
              <li><strong>Email Address</strong>: Collected when you create an account or sign in via Supabase Auth</li>
              <li><strong>Authentication Tokens</strong>: Used to maintain your secure session</li>
            </ul>

            <h3>2.2 Gacha Records</h3>
            <ul>
              <li><strong>Pull History</strong>: Your gacha pull results are stored to generate statistics</li>
              <li><strong>Leaderboard Data</strong>: Aggregated gacha statistics may be displayed on public leaderboards</li>
            </ul>

            <h3>2.3 Cookies and Local Storage</h3>
            <ul>
              <li><strong>Session Cookies</strong>: Used for authentication and session management</li>
              <li><strong>Preferences</strong>: Your UI preferences and settings are stored locally</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <ul>
              <li><strong>Account Management</strong>: To provide and maintain your user account</li>
              <li><strong>Gacha Analytics</strong>: To calculate pull statistics and generate insights</li>
              <li><strong>Leaderboards</strong>: To display aggregated gacha performance data</li>
              <li><strong>Security</strong>: To protect against unauthorized access and abuse</li>
            </ul>

            <h2>4. Data Storage and Security</h2>
            <ul>
              <li>All user data is stored securely using Supabase&apos;s infrastructure</li>
              <li>Authentication is handled via Supabase Auth with industry-standard security practices</li>
              <li>We do not share your personal data with third parties</li>
            </ul>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of data collection (note: this will limit core functionality such as saving your gacha pull history and accessing leaderboard features)</li>
            </ul>

            <h2>6. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Supabase</strong>: Authentication and database services</li>
              <li><strong>Vercel</strong>: Hosting and deployment</li>
            </ul>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of any material changes.
            </p>

            <h2>8. Contact</h2>
            <p>
              For questions about this privacy policy or your personal data, please contact us through our Discord community.
            </p>

            <hr className="my-8 border-zinc-200" />
            
            <p className="text-sm text-zinc-500">
              <em>This policy is effective as of January 17, 2026.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
