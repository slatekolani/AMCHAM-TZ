export interface User {
    id: number;
    uuid: string;
    name: string;
    email: string;
    email_verified_at: string;
    company_id: number | null;
}

export interface HeroCarouselSlide {
    eyebrow: string;
    heading: string;
    accent: string;
    body: string;
    main_image: string;
    secondary_image: string | null;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
}

export interface HeroCarouselConfig {
    slides: HeroCarouselSlide[];
    taglineLineOne: string;
    taglineLineTwo: string;
    originLabel: string;
    destinationLabel: string;
    autoAdvanceMs: number;
    corridorDurationMs: number;
}

export interface BoardMember {
    id: number;
    uuid: string;
    company_id: number | null;
    company?: { id: number; uuid: string; name: string } | null;
    name: string;
    role_title: string;
    bio: string | null;
    photo_path: string | null;
    linkedin_url: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface EconomicStat {
    id: number;
    uuid: string;
    category: 'trade' | 'investment';
    label: string;
    value: string;
    period: string | null;
    description: string | null;
    source: string | null;
    source_url: string | null;
    is_featured: boolean;
    sort_order: number;
    trend: { period: string; value: number }[] | null;
    chart_group: string | null;
    chart_title: string | null;
    trend_value_prefix: string | null;
    trend_value_suffix: string | null;
}

export interface MembershipTier {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    price: string | null;
    currency: string;
    billing_period: string;
    audience: string | null;
    description: string | null;
    benefits: string[];
    sort_order: number;
    is_active: boolean;
}

export interface MembershipApplication {
    id: number;
    uuid: string;
    membership_tier_id: number | null;
    tier_name: string;
    tier_price: string | null;
    tier_currency: string;
    tier_billing_period: string;
    tier_benefits: string[];
    applicant_name: string;
    email: string;
    phone: string;
    company_name: string;
    job_title: string | null;
    sector: string | null;
    website: string | null;
    logo_path: string | null;
    notes: string | null;
    company_profile: string | null;
    certificate_of_incorporation_path: string | null;
    business_license_path: string | null;
    tin_certificate_path: string | null;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes: string | null;
    created_at: string;
    user?: User;
    tier?: MembershipTier | null;
    invoice?: Invoice | null;
}

export interface CompanyDocument {
    id: number;
    uuid: string;
    title: string;
    file_path: string;
    visibility: 'private' | 'public';
    created_at: string;
}

export interface Invoice {
    id: number;
    uuid: string;
    invoice_number: string;
    file_path: string | null;
    tier_name: string;
    amount: string;
    currency: string;
    billing_period: string;
    status: 'unpaid' | 'paid' | 'cancelled';
    issued_at: string;
    sent_at: string | null;
    due_date: string | null;
    paid_at: string | null;
}

export interface Company {
    id: number;
    uuid: string;
    membership_tier_id: number | null;
    membership_tier?: MembershipTier | null;
    name: string;
    slug: string;
    sector: string | null;
    logo_path: string | null;
    cover_image_path: string | null;
    description: string | null;
    website: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: 'pending' | 'approved' | 'suspended';
    approved_at: string | null;
    documents?: CompanyDocument[];
    latest_invoice?: Invoice | null;
    testimonial?: Testimonial | null;
}

export interface Testimonial {
    id: number;
    uuid: string;
    company_id?: number;
    company?: Company | null;
    quote: string;
    is_active?: boolean;
}

export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';

export interface NewsArticle {
    id: number;
    uuid: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    cover_image_path: string | null;
    category: string | null;
    author_id: number | null;
    company_id: number | null;
    company?: Company | null;
    status: ContentStatus;
    published_at: string | null;
    reviewed_by: number | null;
    reviewed_at: string | null;
    rejection_reason: string | null;
    /** Estimated whole minutes to read, computed server-side. */
    reading_time: number;
}

/** Shape of a Laravel `LengthAwarePaginator::toArray()` result, as sent over Inertia. */
export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface Event {
    id: number;
    uuid: string;
    title: string;
    slug: string;
    description: string | null;
    location: string | null;
    starts_at: string;
    ends_at: string | null;
    cover_image_path: string | null;
    category: string | null;
    registration_url: string | null;
    company_id: number | null;
    company?: Company | null;
    status: ContentStatus;
    audience: 'public' | 'members';
    published_at: string | null;
    reviewed_by: number | null;
    reviewed_at: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface EventRegistration {
    id: number;
    uuid: string;
    event_id: number;
    event: Pick<Event, 'id' | 'title' | 'starts_at'>;
    name: string;
    email: string;
    phone: string;
    company: string | null;
    job_title: string | null;
    notes: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
}

export interface Resource {
    id: number;
    uuid: string;
    title: string;
    description: string | null;
    category: string | null;
    cover_image_path: string | null;
    file_path: string;
}

export interface HeroBlockData {
    eyebrow?: string;
    heading: string;
    body?: string;
    primary_cta_label?: string;
    primary_cta_url?: string;
    secondary_cta_label?: string;
    secondary_cta_url?: string;
    image?: string;
}

export interface StatsBlockData {
    items: { label: string; value: string }[];
}

export interface HeadingTextBlockData {
    eyebrow?: string;
    heading: string;
    body?: string;
}

export interface ValuesGridBlockData {
    items: { title: string; body: string; image?: string; image_upload?: File | null }[];
}

export interface TagListBlockData {
    heading?: string;
    items: string[];
}

export interface FactBlockData {
    label: string;
    value: string;
}

export type PageBlock =
    | { id: string; type: 'hero'; data: HeroBlockData }
    | { id: string; type: 'stats'; data: StatsBlockData }
    | { id: string; type: 'heading_text'; data: HeadingTextBlockData }
    | { id: string; type: 'values_grid'; data: ValuesGridBlockData }
    | { id: string; type: 'tag_list'; data: TagListBlockData }
    | { id: string; type: 'fact'; data: FactBlockData };

export type PageBlockType = PageBlock['type'];

export interface PageBlockDataMap {
    hero: HeroBlockData;
    stats: StatsBlockData;
    heading_text: HeadingTextBlockData;
    values_grid: ValuesGridBlockData;
    tag_list: TagListBlockData;
    fact: FactBlockData;
}

export interface Page {
    id: number;
    uuid: string;
    slug: string;
    title: string;
    content: { blocks: PageBlock[]; copy?: Record<string, string> } | null;
    meta_title: string | null;
    meta_description: string | null;
    status: 'draft' | 'published';
}

export interface NavFeaturedEvent {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    starts_at: string;
    cover_image_path: string | null;
    category: string | null;
}

export interface NavLatestArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    published_at: string | null;
    cover_image_path: string | null;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
        roles: string[];
        canPublish: boolean;
        canTestimonial: boolean;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    site: {
        social_linkedin?: string;
        social_twitter?: string;
        social_facebook?: string;
        social_instagram?: string;
        site_name?: string;
        site_tagline?: string;
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
    };
    cms: Record<string, string>;
    seo: {
        baseUrl: string;
        siteName: string;
        defaultImage: string;
    };
    nav: {
        events: NavFeaturedEvent[];
        eventsTotal: number;
        articles: NavLatestArticle[];
        articlesTotal: number;
    };
};
