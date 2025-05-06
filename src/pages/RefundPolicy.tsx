
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const RefundPolicy: React.FC = () => {
  return (
    <AppLayout title="Refund Policy">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AnonPay Refund Policy</h1>
          
          <div className="prose max-w-none mb-10">
            <p className="text-gray-600 mb-4">
              Last Updated: May 6, 2025
            </p>
            
            <p className="mb-4">
              This Refund Policy outlines the procedures and conditions for refunds on services provided by AnonPay. We strive to ensure full satisfaction with our services, but we understand that sometimes issues may arise.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-3">Key Points Summary</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Virtual products and services (gift cards, cryptocurrency, airtime, data) are generally non-refundable once delivered.</li>
                <li>Failed or incomplete transactions will be automatically refunded within 1-7 business days.</li>
                <li>For payment disputes, customers must contact support within 24 hours of the transaction.</li>
                <li>All refunds will be processed back to the original payment method when possible.</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Detailed Refund Policy</h2>
            
            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">
                  1. Failed Transactions
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    If a transaction fails to complete due to technical issues on our platform, the full amount will be automatically refunded to your wallet or original payment method within 1-7 business days, depending on your payment provider.
                  </p>
                  <p className="mt-2">
                    If you notice that a failed transaction has not been refunded within this timeframe, please contact our customer support team with your transaction reference number.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">
                  2. Gift Card Transactions
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    When selling gift cards to AnonPay:
                  </p>
                  <ul className="list-disc pl-5 mt-2 mb-2">
                    <li>If we discover that a gift card is invalid, used, or fraudulently obtained, no payment will be made and no refund will be necessary.</li>
                    <li>If a gift card's value is less than what was claimed, we will offer payment for the actual verified value.</li>
                  </ul>
                  <p className="mt-2">
                    When purchasing gift cards from AnonPay:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Gift cards delivered to customers are final sale and non-refundable once the code has been viewed or delivered.</li>
                    <li>If a purchased gift card is proven to be invalid at the time of delivery, we will replace it or provide a full refund.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium">
                  3. Cryptocurrency Transactions
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    Due to the volatile nature of cryptocurrency markets:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Completed cryptocurrency transactions are final and non-refundable.</li>
                    <li>Rate fluctuations after a transaction is completed are not grounds for a refund.</li>
                    <li>If cryptocurrency is sent to an incorrect address due to an error on our part, we will make reasonable efforts to recover the funds.</li>
                    <li>If a customer provides an incorrect wallet address, recovery may not be possible, and AnonPay cannot be held liable.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">
                  4. VTU Services (Airtime and Data)
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    For mobile airtime and data services:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Successfully delivered airtime and data purchases are non-refundable.</li>
                    <li>If a service is not delivered due to technical issues, network problems, or errors on our part, a full refund will be processed or the service will be re-delivered.</li>
                    <li>Customers must report delivery failures within 24 hours.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium">
                  5. Payment Disputes and Chargebacks
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    We take payment disputes seriously:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Before initiating a chargeback with your payment provider, please contact our customer support for assistance.</li>
                    <li>Fraudulent chargeback attempts will be investigated and may result in account termination and legal action.</li>
                    <li>If a chargeback is filed against a completed service that was delivered as described, we reserve the right to contest the chargeback and provide evidence of service delivery.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-medium">
                  6. Refund Process and Timeline
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    When a refund is approved:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Wallet refunds will be processed immediately.</li>
                    <li>Bank refunds typically take 3-5 business days.</li>
                    <li>Card refunds may take 5-10 business days, depending on your bank's policies.</li>
                    <li>All refunds will be issued in the same currency and through the same payment method as the original transaction when possible.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How to Request a Refund</h2>
            
            <p className="mb-4">
              To request a refund, please follow these steps:
            </p>
            
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>Log in to your AnonPay account.</li>
              <li>Navigate to the transaction history section.</li>
              <li>Find the transaction in question and click on "Report Issue".</li>
              <li>Fill out the refund request form with all relevant details.</li>
              <li>Our support team will review your request and respond within 24-48 hours.</li>
            </ol>
            
            <p className="mb-4">
              Alternatively, you can contact our customer support directly at <a href="mailto:support@anonpay.com" className="text-purple-600">support@anonpay.com</a> with your transaction reference number and details of your issue.
            </p>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 mt-8">
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p>
                If you have any questions about our refund policy, please contact us:
              </p>
              <ul className="mt-2">
                <li>Email: <a href="mailto:support@anonpay.com" className="text-purple-600">support@anonpay.com</a></li>
                <li>Phone: +234 (0) 123 456 7890</li>
                <li>Live Chat: Available on our website 24/7</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-500 mt-8">
              AnonPay reserves the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RefundPolicy;
