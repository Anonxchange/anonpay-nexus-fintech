
import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Terms: React.FC = () => {
  return (
    <AppLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
          <p className="text-gray-700 mb-6">
            Last updated: May 6, 2025
          </p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
              <p>
                By accessing and using the services provided by AnonPay ("we," "us," or "our"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">2. Description of Services</h3>
              <p>
                AnonPay provides a platform for cryptocurrency and gift card transactions, including but not limited to buying, selling, and exchanging digital assets and gift cards. Our services are subject to change at our discretion.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">3. User Registration and Accounts</h3>
              <p>
                To access certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p className="mt-2">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">4. KYC and AML Compliance</h3>
              <p>
                We are committed to complying with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. You may be required to provide additional information and documentation to verify your identity before using our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">5. Transaction Policies</h3>
              <p>
                All transactions are subject to our rates and fees, which may change without notice. Once confirmed, transactions cannot be reversed. You are responsible for providing accurate wallet addresses and transaction details.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">6. Prohibited Activities</h3>
              <p>
                You agree not to use our services for any illegal purposes, including but not limited to money laundering, terrorist financing, fraud, or any other illegal activities. We reserve the right to report suspicious activities to the relevant authorities.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">7. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, AnonPay shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">8. Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective upon posting to the site. Your continued use of our services after any changes indicates your acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">9. Governing Law</h3>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">10. Contact Information</h3>
              <p>
                If you have any questions about these terms, please contact us at legal@anonpay.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Terms;
