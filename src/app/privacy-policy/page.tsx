import type { Metadata } from "next";
import { NavBar } from "@/components/landing/NavBar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | PrepInMinutes",
  description: "Learn how PrepInMinutes collects, uses, and protects your information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          We collect information you provide when you create an account or use PrepInMinutes,
          including your name, email address, profile details, target role, resume, job descriptions,
          practice responses, interview feedback, and preparation progress.
        </p>
        <p>
          We also receive basic technical information when you use the service, such as device and
          browser information, approximate location, IP address, and interactions with the product.
          Authentication is provided by Clerk, which may collect and process account and sign-in
          information on our behalf.
        </p>
      </>
    ),
  },
  {
    title: "2. How We Use Information",
    content: (
      <>
        <p>We use information to:</p>
        <ul>
          <li>provide, personalize, and improve your interview preparation journey;</li>
          <li>analyze your resume, target role, and job description;</li>
          <li>generate preparation plans, practice questions, recommendations, and evaluations;</li>
          <li>maintain your account, authenticate you, and provide support;</li>
          <li>protect the service, prevent misuse, and troubleshoot technical issues; and</li>
          <li>understand product usage and improve reliability and performance.</li>
        </ul>
        <p>
          We do not use your resume or practice responses to make employment decisions about you.
          You are responsible for reviewing AI-generated content before relying on it.
        </p>
      </>
    ),
  },
  {
    title: "3. AI Processing",
    content: (
      <p>
        PrepInMinutes uses AI systems to turn the information you provide into personalized
        preparation content. Information sent to an AI provider is used to provide the requested
        feature and handled under our agreements with that provider. We do not sell your personal
        information or use your private preparation content to train a general-purpose AI model
        without your permission.
      </p>
    ),
  },
  {
    title: "4. When We Share Information",
    content: (
      <>
        <p>We may share information with:</p>
        <ul>
          <li>service providers that host, secure, authenticate, analyze, or operate the service;</li>
          <li>AI providers when needed to deliver requested product features;</li>
          <li>professional advisers, where reasonably necessary; and</li>
          <li>authorities or other parties when required by law or to protect rights and safety.</li>
        </ul>
        <p>
          We may also transfer information as part of a merger, acquisition, financing, or sale of
          business assets. We do not sell personal information.
        </p>
      </>
    ),
  },
  {
    title: "5. Data Retention and Security",
    content: (
      <p>
        We retain information for as long as needed to provide the service, maintain your account,
        meet legal obligations, resolve disputes, and enforce agreements. We use reasonable
        administrative, technical, and organizational safeguards to protect information, but no
        internet transmission or storage system can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "6. Your Choices and Rights",
    content: (
      <p>
        Depending on where you live, you may have rights to access, correct, delete, export, or
        restrict the processing of your personal information. You can also stop using the service
        at any time. To make a privacy request, contact us at
        {" "}
        <a href="mailto:privacy@prepinminutes.com">privacy@prepinminutes.com</a>. We may need to
        verify your identity before completing a request.
      </p>
    ),
  },
  {
    title: "7. Cookies and Similar Technologies",
    content: (
      <p>
        We and our service providers may use cookies or similar technologies that are necessary for
        authentication, security, preferences, and basic product functionality. Your browser may
        allow you to control cookies, though disabling necessary cookies can affect the service.
      </p>
    ),
  },
  {
    title: "8. Children’s Privacy",
    content: (
      <p>
        PrepInMinutes is not intended for children under 13, and we do not knowingly collect
        personal information from children under 13. If you believe a child has provided us with
        personal information, please contact us so we can take appropriate action.
      </p>
    ),
  },
  {
    title: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy as the service changes. We will post the updated version
        on this page and revise the date below. Your continued use of PrepInMinutes after an update
        means the updated policy applies to your use of the service.
      </p>
    ),
  },
  {
    title: "10. Contact Us",
    content: (
      <p>
        Questions about this Privacy Policy or our privacy practices can be sent to
        {" "}
        <a href="mailto:privacy@prepinminutes.com">privacy@prepinminutes.com</a>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#fbf9f4]">
      <NavBar />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20 lg:px-[120px]">
        <article className="mx-auto max-w-3xl rounded-2xl border border-line bg-white px-6 py-8 shadow-[0_18px_50px_rgba(30,28,26,0.05)] sm:px-10 sm:py-12 lg:px-14">
          <div className="mb-10 border-b border-line pb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Legal
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm text-ink-muted">Last updated: September 8, 2026</p>
          </div>

          <div className="space-y-9 text-[15px] leading-7 text-ink-muted [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-2 [&_p+p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2">
            <p>
              PrepInMinutes (&quot;PrepInMinutes,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This
              Privacy Policy explains what information we collect, how we use it, and the choices
              available to you when you use our website and interview preparation platform.
            </p>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 font-display text-xl font-bold text-ink">{section.title}</h2>
                {section.content}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
