import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useCms } from '@/utils/cms';

type LegalDocument = 'privacy' | 'terms' | 'cookies';

type Section = { title: string; paragraphs?: string[]; bullets?: string[] };

const documents: Record<LegalDocument, { eyebrow: string; title: string; intro: string; updated: string; sections: Section[] }> = {
    privacy: {
        eyebrow: 'Legal & Privacy',
        title: 'Privacy Policy',
        intro: 'This policy explains how the American Chamber of Commerce in Tanzania (“AmCham Tanzania”, “we”, “us”) collects, uses, stores and protects personal information.',
        updated: '23 July 2026',
        sections: [
            { title: 'Information we collect', bullets: ['Contact and professional details you submit, such as your name, email, telephone number, job title and organisation.', 'Membership, event registration, enquiry, newsletter and account information.', 'Technical information such as browser type, device information, IP address and website activity where permitted by your cookie choices.'] },
            { title: 'How we use information', bullets: ['To administer memberships, accounts, applications, events and requested services.', 'To respond to enquiries and send chamber news or event communications you request.', 'To operate, secure, measure and improve this website.', 'To meet legal, regulatory, governance and record-keeping obligations.'] },
            { title: 'Sharing and international processing', paragraphs: ['We may share information with trusted service providers that support hosting, communications, event delivery and administration, subject to appropriate safeguards. We do not sell personal information. Information may be processed outside Tanzania when a service provider operates internationally.'] },
            { title: 'Retention and security', paragraphs: ['We retain information only for as long as reasonably necessary for the purpose collected, our legitimate organisational needs and applicable legal obligations. We use reasonable administrative and technical safeguards, but no online system can be guaranteed completely secure.'] },
            { title: 'Your choices and rights', paragraphs: ['You may ask to access, correct or delete personal information, object to or restrict certain processing, or withdraw consent where processing relies on consent. You can unsubscribe from marketing messages using the link in the message.'] },
            { title: 'Contact us', paragraphs: ['For privacy questions or requests, contact info@amcham-tz.com or write to AmCham Tanzania, P.O. Box 1220, Dar es Salaam, Tanzania.'] },
        ],
    },
    terms: {
        eyebrow: 'Legal & Governance',
        title: 'Terms & Conditions',
        intro: 'These terms govern your use of the AmCham Tanzania website and its online services. By using the website, you agree to these terms.',
        updated: '23 July 2026',
        sections: [
            { title: 'Website use', paragraphs: ['You may use this website for lawful informational and business purposes. You must not disrupt the website, attempt unauthorised access, introduce harmful code, misuse another person’s information or use the website in a way that infringes any right or law.'] },
            { title: 'Accounts, applications and registrations', paragraphs: ['You are responsible for providing accurate information and safeguarding account credentials. Submitting a membership application or event registration does not guarantee acceptance, availability or any particular benefit. Additional event or membership terms may apply.'] },
            { title: 'Content and intellectual property', paragraphs: ['Unless stated otherwise, website text, branding, graphics and original materials are owned by or licensed to AmCham Tanzania. You may view and print reasonable extracts for personal or internal business reference. Republishing, commercial reuse or modification requires prior written permission.'] },
            { title: 'Member and third-party content', paragraphs: ['Views in member articles, linked websites or third-party materials belong to their respective authors and do not necessarily represent AmCham Tanzania. External links are provided for convenience; we do not control or endorse every linked service.'] },
            { title: 'Accuracy and liability', paragraphs: ['We aim to keep information useful and current, but provide the website on an “as available” basis. Content is general information, not legal, tax, investment or professional advice. To the extent permitted by law, AmCham Tanzania is not liable for indirect loss arising from website use or reliance on its content.'] },
            { title: 'Changes and governing principles', paragraphs: ['We may update the website and these terms. Material updates will be reflected by the date above. These terms are governed by the laws applicable in the United Republic of Tanzania, subject to any mandatory rights that apply.'] },
            { title: 'Contact', paragraphs: ['Questions about these terms may be sent to info@amcham-tz.com.'] },
        ],
    },
    cookies: {
        eyebrow: 'Privacy Choices',
        title: 'Cookie Policy',
        intro: 'This page explains what cookies are, which types this website may use, and how you can control your choices.',
        updated: '23 July 2026',
        sections: [
            { title: 'What cookies are', paragraphs: ['Cookies are small text files saved on your device when you visit a website. Similar local-storage technologies can remember choices, support security and help website owners understand performance.'] },
            { title: 'Essential cookies', paragraphs: ['These are required for core functions such as security, session management, form protection, authentication and remembering your cookie preference. Because the website cannot operate reliably without them, essential cookies cannot be switched off through our consent notice.'] },
            { title: 'Optional analytics cookies', paragraphs: ['If analytics tools are enabled, these cookies help us understand aggregated website usage—such as popular pages, approximate visit counts and technical performance. We will only use optional analytics cookies after you choose “Accept all”.'] },
            { title: 'Third-party content', paragraphs: ['Pages may link to external services or social networks. Those services may set their own cookies when you visit them. Their cookie and privacy practices are controlled by the third party, not AmCham Tanzania.'] },
            { title: 'Managing your choice', paragraphs: ['Use the “Cookie settings” link in the footer to review your choice at any time. You can also delete or block cookies in your browser settings; blocking essential cookies may prevent parts of the website from working correctly.'] },
            { title: 'Questions', paragraphs: ['For questions about cookies or privacy, email info@amcham-tz.com.'] },
        ],
    },
};

export default function Legal({ document }: { document: LegalDocument }) {
    const t = useCms();
    const source = documents[document];
    const content = {
        ...source,
        title: t(`${document}_title`, source.title),
        intro: t(`${document}_body`, source.intro),
    };

    return (
        <PublicLayout seo={{ title: `${content.title} | AMCHAM Tanzania`, description: content.intro }}>
            <Head title={content.title} />
            <header className="relative overflow-hidden bg-navy-950 px-5 py-20 text-white sm:px-8 lg:py-28">
                <div className="absolute inset-x-0 top-0 h-1 brand-rule" />
                <div className="mx-auto max-w-4xl">
                    <p className="text-xs font-bold uppercase tracking-caps text-gold">{content.eyebrow}</p>
                    <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{content.title}</h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{content.intro}</p>
                    <p className="mt-7 text-xs font-semibold uppercase tracking-wide text-white/40">Last updated {content.updated}</p>
                </div>
            </header>
            <div className="mx-auto grid max-w-4xl gap-12 px-5 py-16 sm:px-8 lg:py-24">
                {content.sections.map((section, index) => (
                    <section key={section.title} className="grid gap-4 border-t border-line pt-8 sm:grid-cols-[4rem_1fr]">
                        <span className="font-display text-2xl text-crimson">{String(index + 1).padStart(2, '0')}</span>
                        <div>
                            <h2 className="font-display text-2xl font-semibold text-navy-800">{section.title}</h2>
                            {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-ink-muted">{paragraph}</p>)}
                            {section.bullets && <ul className="mt-5 grid gap-3">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 leading-7 text-ink-muted"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />{bullet}</li>)}</ul>}
                        </div>
                    </section>
                ))}
                <div className="border-l-4 border-crimson bg-mist p-6 text-sm leading-7 text-ink-muted">
                    Related information: <Link href="/privacy-policy" className="font-semibold text-navy-800 underline underline-offset-4">Privacy Policy</Link>, <Link href="/cookie-policy" className="font-semibold text-navy-800 underline underline-offset-4">Cookie Policy</Link>, and <Link href="/terms-and-conditions" className="font-semibold text-navy-800 underline underline-offset-4">Terms & Conditions</Link>.
                </div>
            </div>
        </PublicLayout>
    );
}
