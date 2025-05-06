
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Privacy: React.FC = () => {
  return (
    <AppLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            Last updated: May 6, 2025
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
              <p>
                At AnonPay, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Information We Collect</h3>
              <p className="font-medium mb-2">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and identification documents for KYC verification.
                </li>
                <li>
                  <strong>Transaction Information:</strong> Details about the transactions you conduct through our platform, including wallet addresses, transaction amounts, and dates.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, operating system, and device information.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our website and services.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. How We Use Your Information</h3>
              <p className="mb-2">We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To verify your identity and prevent fraud</li>
                <li>To process your transactions</li>
                <li>To comply with legal obligations, including KYC and AML regulations</li>
                <li>To communicate with you about service-related issues</li>
                <li>To improve our platform and services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Data Retention</h3>
              <p>
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, and to comply with our legal obligations.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Your Rights</h3>
              <p className="mb-2">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Third-Party Disclosure</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to outside parties unless we provide you with advance notice. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Changes to This Privacy Policy</h3>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Contact Us</h3>
              <p>
                If you have any questions about this privacy policy, please contact us at privacy@anonpay.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Privacy;
