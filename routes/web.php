<?php

use App\Http\Controllers\Admin\CompanyController as AdminCompanyController;
use App\Http\Controllers\Admin\BoardMemberController as AdminBoardMemberController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EconomicStatController as AdminEconomicStatController;
use App\Http\Controllers\Admin\EmailCampaignController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\EventRegistrationController as AdminEventRegistrationController;
use App\Http\Controllers\Admin\InvoiceController as AdminInvoiceController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\MembershipApplicationController as AdminMembershipApplicationController;
use App\Http\Controllers\Admin\MembershipTierController as AdminMembershipTierController;
use App\Http\Controllers\Admin\NewsArticleController as AdminNewsArticleController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\OurWorkController as AdminOurWorkController;
use App\Http\Controllers\Admin\PolicyUpdateController as AdminPolicyUpdateController;
use App\Http\Controllers\Admin\ResourceController as AdminResourceController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\SubscriberController as AdminSubscriberController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WorkingGroupController as AdminWorkingGroupController;
use App\Http\Controllers\Admin\WhatsAppCampaignController;
use App\Http\Controllers\Admin\WebsiteCopyController;
use App\Http\Controllers\Member\CompanyProfileController;
use App\Http\Controllers\Member\EventController as MemberEventController;
use App\Http\Controllers\Member\MemberEventsController;
use App\Http\Controllers\Member\NewsArticleController as MemberNewsArticleController;
use App\Http\Controllers\Member\PortalController;
use App\Http\Controllers\Member\TestimonialController as MemberTestimonialController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\BoardMembersController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\EconomicDataController;
use App\Http\Controllers\Public\EventsController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\EventRegistrationController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\MembershipController;
use App\Http\Controllers\Public\MembershipApplicationController;
use App\Http\Controllers\Public\MembersController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\OurWorkController as PublicOurWorkController;
use App\Http\Controllers\Public\PolicyUpdatesController;
use App\Http\Controllers\Public\ResourcesController;
use App\Http\Controllers\Public\WorkingGroupsController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\SubscribeController;
use App\Http\Controllers\Public\SiteSearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/site-search', SiteSearchController::class)->middleware('throttle:60,1')->name('site-search');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/about-us', [AboutController::class, 'index'])->name('about');
Route::get('/board-members', [BoardMembersController::class, 'index'])->name('board-members');
Route::get('/trade', [EconomicDataController::class, 'trade'])->name('trade');
Route::get('/investment', [EconomicDataController::class, 'investment'])->name('investment');
Route::get('/membership', [MembershipController::class, 'index'])->name('membership');
Route::get('/membership/join/{tier:slug}', [MembershipApplicationController::class, 'create'])->name('membership.join');
Route::post('/membership/join/{tier:slug}', [MembershipApplicationController::class, 'store'])->middleware(['auth', 'throttle:3,1'])->name('membership.join.store');
Route::get('/events', [EventsController::class, 'index'])->name('events');
Route::get('/events/{event:slug}', [EventsController::class, 'show'])->name('events.show');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
Route::post('/events/{event:slug}/register', [EventRegistrationController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('events.register');
Route::get('/news', [NewsController::class, 'index'])->name('news');
Route::get('/news/{article:slug}', [NewsController::class, 'show'])->name('news.show');
Route::get('/members', [MembersController::class, 'index'])->name('members');
Route::get('/members/{company:slug}', [MembersController::class, 'show'])->name('members.show');
Route::get('/resources', [ResourcesController::class, 'index'])->name('resources');
Route::get('/newsletters', [ResourcesController::class, 'newsletters'])->name('newsletters');
Route::get('/policy-updates', [PolicyUpdatesController::class, 'index'])->name('policy-updates');
Route::get('/policy-updates/{policyUpdate:slug}', [PolicyUpdatesController::class, 'show'])->name('policy-updates.show');
Route::get('/our-work', [PublicOurWorkController::class, 'index'])->name('our-work');
Route::get('/our-work/{ourWork:slug}', [PublicOurWorkController::class, 'show'])->name('our-work.show');
Route::get('/working-groups', [WorkingGroupsController::class, 'index'])->name('working-groups');
Route::get('/working-groups/{workingGroup:slug}', [WorkingGroupsController::class, 'show'])->name('working-groups.show');
Route::get('/resources/{resource}/download', [ResourcesController::class, 'download'])->name('resources.download');
Route::get('/contact-us', [ContactController::class, 'index'])->name('contact');
Route::get('/privacy-policy', fn () => Inertia::render('Public/Legal', ['document' => 'privacy']))->name('privacy');
Route::get('/terms-and-conditions', fn () => Inertia::render('Public/Legal', ['document' => 'terms']))->name('terms');
Route::get('/cookie-policy', fn () => Inertia::render('Public/Legal', ['document' => 'cookies']))->name('cookies');
Route::post('/contact-us', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::post('/subscribe', [SubscribeController::class, 'store'])->middleware('throttle:5,1')->name('subscribe.store');
Route::get('/unsubscribe/{token}', [SubscribeController::class, 'unsubscribe'])->name('subscribe.unsubscribe');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified', 'role:admin|super-admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
    Route::get('/pages/{page}/edit', [AdminPageController::class, 'edit'])->name('pages.edit');
    Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');

    Route::get('/companies', [AdminCompanyController::class, 'index'])->name('companies.index');
    Route::get('/companies/{company}/edit', [AdminCompanyController::class, 'edit'])->name('companies.edit');
    Route::put('/companies/{company}', [AdminCompanyController::class, 'update'])->name('companies.update');
    Route::post('/companies/{company}/approve', [AdminCompanyController::class, 'approve'])->name('companies.approve');
    Route::post('/companies/{company}/suspend', [AdminCompanyController::class, 'suspend'])->name('companies.suspend');
    Route::delete('/companies/{company}', [AdminCompanyController::class, 'destroy'])->name('companies.destroy');
    Route::resource('/board-members', AdminBoardMemberController::class)->except('show');
    Route::get('/testimonials', [AdminTestimonialController::class, 'index'])->name('testimonials.index');
    Route::delete('/testimonials/{testimonial}', [AdminTestimonialController::class, 'destroy'])->name('testimonials.destroy');
    Route::resource('/policy-updates', AdminPolicyUpdateController::class)->except('show');
    Route::resource('/our-work', AdminOurWorkController::class)->except('show');
    Route::resource('/working-groups', AdminWorkingGroupController::class)->except('show');
    Route::resource('/economic-stats', AdminEconomicStatController::class)->except('show');
    Route::resource('/membership-tiers', AdminMembershipTierController::class)->except('show');
    Route::get('/membership-applications', [AdminMembershipApplicationController::class, 'index'])->name('membership-applications.index');
    Route::put('/membership-applications/{membershipApplication}', [AdminMembershipApplicationController::class, 'update'])->name('membership-applications.update');
    Route::delete('/membership-applications/{membershipApplication}', [AdminMembershipApplicationController::class, 'destroy'])->name('membership-applications.destroy');
    Route::post('/invoices/{invoice}/send', [AdminInvoiceController::class, 'send'])->name('invoices.send');
    Route::post('/invoices/{invoice}/mark-paid', [AdminInvoiceController::class, 'markPaid'])->name('invoices.mark-paid');

    Route::get('/news', [AdminNewsArticleController::class, 'index'])->name('news.index');
    Route::get('/news/create', [AdminNewsArticleController::class, 'create'])->name('news.create');
    Route::post('/news', [AdminNewsArticleController::class, 'store'])->name('news.store');
    Route::get('/news/{article}/edit', [AdminNewsArticleController::class, 'edit'])->name('news.edit');
    Route::put('/news/{article}', [AdminNewsArticleController::class, 'update'])->name('news.update');
    Route::post('/news/{article}/approve', [AdminNewsArticleController::class, 'approve'])->name('news.approve');
    Route::post('/news/{article}/reject', [AdminNewsArticleController::class, 'reject'])->name('news.reject');
    Route::delete('/news/{article}', [AdminNewsArticleController::class, 'destroy'])->name('news.destroy');

    Route::get('/events', [AdminEventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [AdminEventController::class, 'create'])->name('events.create');
    Route::post('/events', [AdminEventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}/edit', [AdminEventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [AdminEventController::class, 'update'])->name('events.update');
    Route::post('/events/{event}/approve', [AdminEventController::class, 'approve'])->name('events.approve');
    Route::post('/events/{event}/reject', [AdminEventController::class, 'reject'])->name('events.reject');
    Route::delete('/events/{event}', [AdminEventController::class, 'destroy'])->name('events.destroy');
    Route::get('/event-registrations', [AdminEventRegistrationController::class, 'index'])->name('event-registrations.index');
    Route::get('/event-registrations/export', [AdminEventRegistrationController::class, 'export'])->name('event-registrations.export');
    Route::post('/event-registrations/{eventRegistration}/approve', [AdminEventRegistrationController::class, 'approve'])->name('event-registrations.approve');
    Route::post('/event-registrations/{eventRegistration}/reject', [AdminEventRegistrationController::class, 'reject'])->name('event-registrations.reject');

    Route::get('/resources', [AdminResourceController::class, 'index'])->name('resources.index');
    Route::post('/resources', [AdminResourceController::class, 'store'])->name('resources.store');
    Route::put('/resources/{resource}', [AdminResourceController::class, 'update'])->name('resources.update');
    Route::delete('/resources/{resource}', [AdminResourceController::class, 'destroy'])->name('resources.destroy');

    Route::get('/media', [AdminMediaController::class, 'index'])->name('media.index');
    Route::post('/media', [AdminMediaController::class, 'store'])->name('media.store');
    Route::put('/media/{media}', [AdminMediaController::class, 'update'])->name('media.update');
    Route::delete('/media/{media}', [AdminMediaController::class, 'destroy'])->name('media.destroy');

    Route::get('/subscribers', [AdminSubscriberController::class, 'index'])->name('subscribers.index');
    Route::post('/subscribers', [AdminSubscriberController::class, 'store'])->name('subscribers.store');
    Route::delete('/subscribers/{subscriber}', [AdminSubscriberController::class, 'destroy'])->name('subscribers.destroy');

    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
    Route::get('/website-copy', [WebsiteCopyController::class, 'edit'])->name('website-copy.edit');
    Route::put('/website-copy', [WebsiteCopyController::class, 'update'])->name('website-copy.update');

    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.role');

    Route::get('/campaigns/email', [EmailCampaignController::class, 'index'])->name('campaigns.email.index');
    Route::get('/campaigns/email/create', [EmailCampaignController::class, 'create'])->name('campaigns.email.create');
    Route::post('/campaigns/email', [EmailCampaignController::class, 'store'])->name('campaigns.email.store');
    Route::post('/campaigns/email/{emailCampaign}/send', [EmailCampaignController::class, 'send'])->name('campaigns.email.send');
    Route::delete('/campaigns/email/{emailCampaign}', [EmailCampaignController::class, 'destroy'])->name('campaigns.email.destroy');

    Route::get('/campaigns/whatsapp', [WhatsAppCampaignController::class, 'index'])->name('campaigns.whatsapp.index');
    Route::get('/campaigns/whatsapp/create', [WhatsAppCampaignController::class, 'create'])->name('campaigns.whatsapp.create');
    Route::post('/campaigns/whatsapp', [WhatsAppCampaignController::class, 'store'])->name('campaigns.whatsapp.store');
    Route::post('/campaigns/whatsapp/{whatsappCampaign}/send', [WhatsAppCampaignController::class, 'send'])->name('campaigns.whatsapp.send');
    Route::delete('/campaigns/whatsapp/{whatsappCampaign}', [WhatsAppCampaignController::class, 'destroy'])->name('campaigns.whatsapp.destroy');
});

Route::middleware(['auth', 'verified', 'role:member'])->prefix('member-portal')->name('member.')->group(function () {
    Route::get('/', [PortalController::class, 'index'])->name('portal');

    Route::get('/profile', [CompanyProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [CompanyProfileController::class, 'update'])->name('profile.update');

    Route::get('/testimonial', [MemberTestimonialController::class, 'edit'])->name('testimonial.edit');
    Route::post('/testimonial', [MemberTestimonialController::class, 'store'])->name('testimonial.store');
    Route::put('/testimonial', [MemberTestimonialController::class, 'update'])->name('testimonial.update');
    Route::patch('/testimonial/toggle', [MemberTestimonialController::class, 'toggle'])->name('testimonial.toggle');
    Route::delete('/testimonial', [MemberTestimonialController::class, 'destroy'])->name('testimonial.destroy');

    Route::get('/news', [MemberNewsArticleController::class, 'index'])->name('news.index');
    Route::get('/news/create', [MemberNewsArticleController::class, 'create'])->name('news.create');
    Route::post('/news', [MemberNewsArticleController::class, 'store'])->name('news.store');
    Route::get('/news/{article}/edit', [MemberNewsArticleController::class, 'edit'])->name('news.edit');
    Route::put('/news/{article}', [MemberNewsArticleController::class, 'update'])->name('news.update');
    Route::post('/news/{article}/submit', [MemberNewsArticleController::class, 'submit'])->name('news.submit');
    Route::delete('/news/{article}', [MemberNewsArticleController::class, 'destroy'])->name('news.destroy');

    Route::get('/member-events', [MemberEventsController::class, 'index'])->name('member-events.index');

    Route::get('/events', [MemberEventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [MemberEventController::class, 'create'])->name('events.create');
    Route::post('/events', [MemberEventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}/edit', [MemberEventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [MemberEventController::class, 'update'])->name('events.update');
    Route::post('/events/{event}/submit', [MemberEventController::class, 'submit'])->name('events.submit');
    Route::delete('/events/{event}', [MemberEventController::class, 'destroy'])->name('events.destroy');
});

require __DIR__.'/auth.php';
