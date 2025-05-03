"use client";

import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="bg-[#FFF5E1] text-[#2F2F2F] py-20 px-4 sm:px-10 flex justify-center">
      <div className="bg-white rounded-[30px] max-w-6xl w-full px-8 sm:px-16 py-16 shadow-2xl border-4 border-[#2959BF]/20">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-[#2959BF] mb-12">
          Terms and Conditions
        </h1>

        <p className="text-lg leading-relaxed mb-8">
          Welcome to <span className="font-bold text-[#2959BF]">Samga</span>! These Terms and Conditions govern your use of our website, applications, and related services.
          By accessing or using any part of our platform, you accept and agree to be bound by these terms. If you disagree with any part, you must not use our services.
        </p>

        {[
          {
            title: "1. Acceptance of Terms",
            text: "By using Samga, you agree that you have read and understood these terms. If you’re accessing on behalf of a minor or organization, you are responsible for their compliance as well.",
          },
          {
            title: "2. Modifications",
            text: "We may revise these Terms occasionally. You will be notified of any significant changes. Continued use after updates signifies your acceptance of the modified Terms.",
          },
          {
            title: "3. User Accounts",
            text: "You are responsible for your account credentials. You must notify us of unauthorized use. Samga is not responsible for any loss due to your failure to protect credentials.",
          },
          {
            title: "4. Subscription Plans",
            text: "We offer both free and premium plans. Features vary between them. By subscribing, you agree to the plan’s pricing, billing cycles, and cancellation terms.",
          },
          {
            title: "5. Intellectual Property",
            text: "All site content, trademarks, visuals, and AR elements belong to Samga and may not be copied, reused, or distributed without written permission.",
          },
          {
            title: "6. User Conduct",
            text: "You agree not to misuse the platform in any way, including spamming, hacking, distributing malware, or infringing on others’ rights. Violations may result in suspension or legal action.",
          },
          {
            title: "7. Privacy Policy",
            text: "Please refer to our Privacy Policy to understand how your data is collected and used. Use of the platform implies your consent to those practices.",
          },
          {
            title: "8. Limitation of Liability",
            text: "We are not liable for indirect, incidental, or consequential damages. Our services are provided 'as is' without warranties of any kind.",
          },
          {
            title: "9. Governing Law",
            text: "These Terms are governed by the laws of the Republic of Kazakhstan. All disputes shall be handled in local competent courts.",
          },
          {
            title: "10. Contact Us",
            text: (
              <>
                For questions, please contact us at{" "}
                <a
                  href="mailto:support@samga.com"
                  className="text-[#2959BF] underline font-semibold"
                >
                  support@samga.com
                </a>
                .
              </>
            ),
          },
        ].map((section, idx) => (
          <section key={idx} className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2959BF] mb-3">
              {section.title}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[#333]">
              {section.text}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
