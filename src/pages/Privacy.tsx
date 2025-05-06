
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Privacy: React.FC = () => {
  return (
    <AppLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-600 mb-4">
              Last Updated: May 6, 2025
            </p>
            
            <p className="text-gray-700">
              At AnonPay, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect several types of information from and about users of our platform, including:
            </p>
            <h3 className="text-xl font-medium mb-2">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Contact information (name, email address, phone number)</li>
              <li>Account information (username, password)</li>
              <li>Identification information for KYC purposes (government-issued ID, photograph)</li>
              <li>Financial information (bank account details, cryptocurrency wallet addresses)</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2">Usage Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Transaction history and details</li>
              <li>Log data (IP address, browser type, operating system)</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Providing, maintaining, and improving our Services</li>
              <li>Processing transactions and sending transaction notifications</li>
              <li>Verifying your identity and preventing fraud</li>
              <li>Complying with legal and regulatory requirements</li>
              <li>Communicating with you about updates, security alerts, and support</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Marketing and promotional purposes (with your consent)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Third-party service providers who help us operate our platform</li>
              <li>Financial institutions and payment processors to facilitate transactions</li>
              <li>Regulatory authorities, law enforcement agencies, or government bodies when required by law</li>
              <li>Professional advisors such as lawyers, auditors, and accountants</li>
              <li>Business partners with your consent</li>
            </ul>
            <p className="text-gray-700">
              We do not sell your personal information to third parties for their marketing purposes without your explicit consent.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, regular security assessments, and staff training.
            </p>
            <p className="text-gray-700 mb-4">
              However, no internet or electronic storage system is 100% secure, and we cannot guarantee the absolute security of your data. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <p className="text-gray-700">
              When your data is no longer needed for these purposes, we will securely delete or anonymize it.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Similar Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to collect information about your browsing activities on our platform. These technologies help us analyze traffic patterns, remember your preferences, and improve your experience.
            </p>
            <p className="text-gray-700">
              You can manage your cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our platform.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700">
              Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated Privacy Policy on our platform or by sending you an email. Your continued use of our Services after any such changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at privacy@anonpay.com or through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Privacy;
