
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Terms: React.FC = () => {
  return (
    <AppLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <p className="text-gray-600 mb-4">
              Last Updated: May 6, 2025
            </p>
            
            <p className="text-gray-700">
              Welcome to AnonPay. Please read these Terms of Service ("Terms") carefully before using our platform. By accessing or using AnonPay, you agree to be bound by these Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using the AnonPay platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms. If you do not agree to these Terms, you should not access or use our Services.
            </p>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting the updated Terms on our platform. Your continued use of our Services after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <p className="text-gray-700 mb-4">
              To access certain features of our Services, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself as prompted by our registration form.
            </p>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
            </p>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of our Services or third parties, or for any other reason.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Services and Transactions</h2>
            <p className="text-gray-700 mb-4">
              AnonPay provides a platform for various financial services, including cryptocurrency trading, gift card trading, and virtual top-up services. All transactions conducted through our platform are subject to these Terms.
            </p>
            <p className="text-gray-700 mb-4">
              By initiating a transaction on our platform, you represent and warrant that you have the legal right and authority to complete the transaction. You also acknowledge that cryptocurrency and gift card transactions may be subject to fluctuations in value and market conditions beyond our control.
            </p>
            <p className="text-gray-700">
              We reserve the right to refuse, cancel, or reverse any transaction at our sole discretion, particularly if we suspect fraudulent activity or violations of our Terms.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Fees and Payments</h2>
            <p className="text-gray-700 mb-4">
              We charge fees for certain services provided through our platform. All applicable fees will be disclosed to you prior to completing any transaction. By proceeding with a transaction, you agree to pay all applicable fees.
            </p>
            <p className="text-gray-700 mb-4">
              Fees may be subject to change at any time. Any changes to our fee structure will be communicated to you through our platform or by email.
            </p>
            <p className="text-gray-700">
              All payments and transactions are final and non-refundable unless otherwise required by law or specified in our Refund Policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Know Your Customer (KYC) and Anti-Money Laundering</h2>
            <p className="text-gray-700 mb-4">
              You acknowledge and agree that we may require you to provide certain personal information to comply with applicable laws and regulations, including Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements.
            </p>
            <p className="text-gray-700 mb-4">
              You agree to provide accurate, current, and complete information as requested during the KYC process. You also authorize us to verify your identity by checking information against third-party databases or through other sources.
            </p>
            <p className="text-gray-700">
              We reserve the right to limit, suspend, or terminate your access to our Services if we are unable to verify your identity or if you fail to comply with our KYC and AML procedures.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Using our Services for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Attempting to bypass or circumvent any security measures implemented on our platform</li>
              <li>Using our Services to transmit any material that contains viruses, trojan horses, or other harmful computer code</li>
              <li>Attempting to access accounts or data not belonging to you</li>
              <li>Using our Services to engage in money laundering, fraud, or any other financial crime</li>
              <li>Impersonating another person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity</li>
              <li>Interfering with or disrupting the operation of our Services</li>
            </ul>
            <p className="text-gray-700">
              Violation of these prohibitions may result in the termination of your access to our Services and may also subject you to civil and/or criminal liability.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by applicable law, AnonPay and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Your access to or use of or inability to access or use the Services</li>
              <li>Any conduct or content of any third party on the Services</li>
              <li>Any content obtained from the Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Fluctuations in cryptocurrency or gift card values</li>
            </ul>
            <p className="text-gray-700">
              In no event shall our total liability to you exceed the amount you have paid us in the twelve (12) months preceding the event giving rise to the liability.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law principles.
            </p>
            <p className="text-gray-700">
              Any dispute arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the courts of Nigeria, and you consent to the personal jurisdiction of such courts.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at legal@anonpay.com or through our Contact page.
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Terms;
