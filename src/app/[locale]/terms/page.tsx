"use client";

import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="bg-[#FFF5E1] text-[#2F2F2F] py-16 px-6 sm:px-20 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-[#2959BF]">
          Terms and Conditions
        </h1>

        <p className="text-lg">
          Welcome to <span className="font-bold text-[#2959BF]">Samga</span>! These Terms and Conditions govern your use of our website and services.
          By accessing or using our platform, you agree to comply with and be bound by these terms.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Samga’s services, you confirm that you have read, understood, and accepted these terms.
            If you do not agree, please do not use the services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">2. Modifications</h2>
          <p>
            Samga reserves the right to modify these terms at any time. We will notify users through our website or email.
            Continued use of the service constitutes acceptance of the changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
            Please notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">4. Subscription Plans</h2>
          <p>
            Samga provides various subscription plans with differing features and pricing. By subscribing, you agree to the respective plan’s terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">5. Intellectual Property</h2>
          <p>
            All content, trademarks, logos, and designs on this platform are owned by Samga. Unauthorized reproduction or use is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">6. User Conduct</h2>
          <p>
            You agree not to misuse the platform, including introducing viruses, hacking, or violating intellectual property rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">7. Privacy Policy</h2>
          <p>
            Our Privacy Policy explains how we collect, use, and protect your personal information. By using Samga, you consent to these practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">8. Limitation of Liability</h2>
          <p>
            Samga is not liable for any indirect, incidental, or consequential damages resulting from your use of the services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">9. Governing Law</h2>
          <p>
            These terms are governed by the laws of your jurisdiction. Any disputes will be resolved in the courts of your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2959BF] mb-2">10. Contact Us</h2>
          <p>
            For any inquiries or clarifications, please contact us at{" "}
            <a
              href="mailto:support@samga.com"
              className="text-[#2959BF] underline font-medium"
            >
              support@samga.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
