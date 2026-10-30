import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Brand & Header
    'brand.name': 'আফরান অনলাইন সেন্টার',
    'brand.subtitle': 'AFRAN ONLINE CENTRE',
    'brand.tagline': 'গ্রাহক সেবা ও অনলাইন আবেদন পোর্টাল',
    'common.farakka': 'ফারাক্কা, মুর্শিদাবাদ, পশ্চিমবঙ্গ',
    
    // Navigation
    'nav.home': 'হোম',
    'nav.services': 'সকল পরিষেবা',
    'nav.applications': 'আমার আবেদন',
    'nav.notifications': 'বিজ্ঞপ্তি',
    'nav.profile': 'প্রোফাইল',

    // Dashboard Home
    'home.welcome': 'স্বাগতম',
    'home.guest': 'সম্মানিত গ্রাহক',
    'home.search_placeholder': 'কী পরিষেবা খুঁজছেন? যেমন: আধার, প্যান, ভোটার...',
    'home.popular_title': 'জনপ্রিয় পরিষেবা সমূহ',
    'home.all_services': 'সকল পরিষেবা সমূহ',
    'home.need_help_title': 'সহায়তার প্রয়োজন?',
    'home.need_help_desc': 'সরাসরি আমাদের সেন্টারের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন।',
    'home.whatsapp_btn': 'হোয়াটসঅ্যাপে যোগাযোগ',
    'home.business_location': 'সেন্টারের ঠিকানা',
    'home.active_apps': 'চলমান আবেদন সমূহ',
    'home.view_all_apps': 'সকল আবেদন দেখুন',
    'home.no_active_apps': 'বর্তমানে কোনো চলমান আবেদন নেই।',
    'home.apply_new': 'নতুন আবেদন করুন',

    // Categories
    'cat.all': 'সবগুলো',
    'cat.aadhaar': 'আধার কার্ড',
    'cat.pan': 'প্যান কার্ড',
    'cat.voter': 'ভোটার কার্ড',
    'cat.ration': 'রেশন কার্ড',
    'cat.ayushman': 'আয়ুষ্মান',
    'cat.epfo': 'ইপিএফও / পিএফ',
    'cat.dl': 'ড্রাইভিং লাইসেন্স',
    'cat.other': 'অন্যান্য পরিষেবা',

    // Service Detail & Booking
    'service.required_documents': 'প্রয়োজনীয় নথিপত্র (Required Documents)',
    'service.docs_instruction': 'আবেদন শুরুর পূর্বে অনুগ্রহ করে নিচের প্রয়োজনীয় কাগজপত্র প্রস্তুত রাখুন:',
    'service.why_needed': 'কেন এই নথিটি প্রয়োজন:',
    'service.mandatory': 'বাধ্যতামূলক',
    'service.optional': 'ঐচ্ছিক',
    'service.select_subservice': 'নির্দিষ্ট পরিষেবা নির্বাচন করুন',
    'service.booking_type': 'বুকিং এর ধরন (Booking Type)',
    'service.standard_booking': 'নিয়মিত আবেদন (Standard Booking)',
    'service.standard_booking_desc': 'নিয়মিত কিউতে আবেদন প্রক্রিয়াকরণ ও যাচাইকরণ সহায়তা।',
    'service.permanent_booking': 'স্থায়ী বুকিং (Permanent Booking)',
    'service.permanent_booking_desc': 'অগ্রাধিকার ভিত্তিতে সংরক্ষিত ও দ্রুততম অফিশিয়াল প্রসেসিং সহায়তা।',
    'service.apply_now': 'আবেদন করুন',
    'service.permanent_badge': 'স্থায়ী বুকিং উপলব্ধ',

    // Application Form
    'form.step1': '১. পরিষেবা ও বুকিং',
    'form.step2': '২. গ্রাহকের বিবরণ',
    'form.step3': '৩. নথি আপলোড',
    'form.step4': '৪. নিশ্চিতকরণ ও জমা',
    'form.applicant_name': 'আবেদনকারীর পুরো নাম (Full Name)',
    'form.applicant_phone': 'মোবাইল নম্বর (১০ অঙ্ক)',
    'form.applicant_email': 'গুগল ইমেইল',
    'form.applicant_address': 'গ্রাম / পাড়া / ঠিকানা',
    'form.notes_label': 'বিশেষ কোনো নির্দেশিকা বা মন্তব্য (ঐচ্ছিক)',
    'form.notes_placeholder': 'যেমন: নামের বানান ভুল ঠিক করতে হবে...',
    'form.upload_instruction': 'প্রয়োজনীয় নথির স্ক্যান বা পরিষ্কার ছবি আপলোড করুন (JPG, PNG বা PDF)',
    'form.choose_file': 'ফাইল বেছে নিন',
    'form.file_uploaded': 'আপলোড সম্পন্ন',
    'form.max_size': 'সর্বোচ্চ ৫ মেগাবাইট পর্যন্ত',
    'form.consent_title': 'আইনি ও গ্রাহক সম্মতিপত্র',
    'form.consent_text': 'আমি নিশ্চিত করছি যে প্রদত্ত সমস্ত তথ্য ও নথি সঠিক এবং বৈধ। আমি আফরান অনলাইন সেন্টারকে সরকারি পোর্টালে আমার পক্ষে আবেদন প্রক্রিয়াকরণের জন্য প্রয়োজনীয় সহায়তা প্রদানের অনুমতি দিচ্ছি।',
    'form.consent_error': 'আবেদন জমা দিতে সম্মতিপত্রে টিক দিন।',
    'form.submit_button': 'আবেদন নিশ্চিত ও জমা করুন',
    'form.submitting': 'জমা হচ্ছে...',
    'form.back': 'পূর্ববর্তী',
    'form.next': 'পরবর্তী ধাপ',
    'form.cancel': 'বাতিল করুন',

    // Submission Success
    'success.title': 'আবেদন সফলভাবে গৃহীত হয়েছে!',
    'success.app_id': 'আবেদন আইডি (Application ID)',
    'success.status': 'বর্তমান স্ট্যাটাস',
    'success.whatsapp_status': 'হোয়াটসঅ্যাপ নোটিফিকেশন স্ট্যাটাস',
    'success.pending_whatsapp': 'নোটিফিকেশন প্রস্তুত (Pending WhatsApp Dispatch)',
    'success.sent_whatsapp': 'সেন্টারে হোয়াটসঅ্যাপ পাঠানো হয়েছে',
    'success.send_wa_action': 'সরাসরি সেন্টারের হোয়াটসঅ্যাপে স্লিপ পাঠান',
    'success.view_my_apps': 'আমার আবেদনের তালিকা দেখুন',
    'success.close': 'বন্ধ করুন',

    // Statuses
    'status.submitted': 'জমা হয়েছে (Submitted)',
    'status.under_review': 'পর্যালোচনা চলছে (Under Review)',
    'status.processing': 'প্রক্রিয়াকরণ চলছে (Processing)',
    'status.completed': 'সম্পূর্ণ হয়েছে (Completed)',
    'status.rejected': 'বাতিল হয়েছে (Rejected)',

    // Applications View
    'apps.title': 'আমার আবেদন সমূহ',
    'apps.subtitle': 'আপনার দাখিলকৃত সকল অনলাইন আবেদনের বর্তমান অবস্থা',
    'apps.empty_title': 'কোনো আবেদন পাওয়া যায়নি',
    'apps.empty_desc': 'আপনি এখনো কোনো পরিষেবার জন্য আবেদন করেননি। হোমপেজ থেকে প্রয়োজনীয় পরিষেবা বেছে আবেদন করুন।',
    'apps.app_id': 'আইডি',
    'apps.applied_on': 'আবেদনের তারিখ',
    'apps.view_details': 'বিস্তারিত দেখুন',
    'apps.details_modal_title': 'আবেদনের বিস্তারিত ও অগ্রগতি',
    'apps.timeline': 'অগ্রগতি টাইমলাইন',
    'apps.attached_docs': 'সংযুক্ত নথিপত্র',
    'apps.no_docs': 'কোনো অতিরিক্ত নথি সংযুক্ত নেই',
    'apps.contact_centre': 'এই আবেদন সংক্রান্ত তথ্যের জন্য সেন্টারে যোগাযোগ',

    // Notifications
    'notif.title': 'বিজ্ঞপ্তি সমূহ',
    'notif.empty': 'বর্তমানে কোনো নতুন বিজ্ঞপ্তি নেই।',
    'notif.mark_all_read': 'সব পঠিত হিসেবে চিহ্নিত করুন',

    // Profile & Auth
    'profile.title': 'গ্রাহক প্রোফাইল',
    'profile.subtitle': 'আপনার ব্যক্তিগত তথ্য ও সিকিউর অ্যাকাউন্ট',
    'profile.mobile': 'মোবাইল নম্বর',
    'profile.add_mobile': 'মোবাইল নম্বর যোগ করুন',
    'profile.save': 'সংরক্ষণ করুন',
    'profile.language_switch': 'ভাষা পরিবর্তন (Language)',
    'profile.total_apps': 'মোট আবেদন',
    'profile.in_progress': 'চলমান প্রক্রিয়া',
    'profile.completed': 'সম্পূর্ণ',
    'profile.centre_info': 'সেন্টারের পরিচয় ও অবস্থান',
    'profile.logout': 'লগআউট করুন',
    'profile.logging_out': 'লগআউট হচ্ছে...',
    'profile.login_required': 'লগইন আবশ্যক',
    'profile.login_desc': 'আপনার আবেদন সংরক্ষণ, অগ্রগতি ট্র্যাক এবং নথিপত্র সুরক্ষিত রাখতে গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন।',
    'profile.google_login': 'গুগল দিয়ে সাইন-ইন করুন',
    'profile.security_notice': 'সম্পূর্ণ সিকিউর গ্রাহক পোর্টাল। অন্য কোনো গ্রাহক আপনার আবেদন বা নথিপত্র দেখতে পাবেন না।',
    'profile.need_mobile_title': 'আপনার মোবাইল নম্বর দিন',
    'profile.need_mobile_desc': 'আবেদনের গুরুত্বপূর্ণ আপডেট ও স্ট্যাটাস পেতে আপনার সক্রিয় ১০ অঙ্কের মোবাইল নম্বরটি প্রদান করুন।'
  },
  en: {
    // Brand & Header
    'brand.name': 'AFRAN ONLINE CENTRE',
    'brand.subtitle': 'AFRAN ONLINE CENTRE',
    'brand.tagline': 'Citizen Services & Online Application Portal',
    'common.farakka': 'Farakka, Murshidabad, West Bengal',

    // Navigation
    'nav.home': 'Home',
    'nav.services': 'All Services',
    'nav.applications': 'My Applications',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',

    // Dashboard Home
    'home.welcome': 'Welcome',
    'home.guest': 'Valued Customer',
    'home.search_placeholder': 'Search services (e.g., Aadhaar, PAN, Voter...)',
    'home.popular_title': 'Popular Services',
    'home.all_services': 'All Citizen Services',
    'home.need_help_title': 'Need Assistance?',
    'home.need_help_desc': 'Directly chat with our centre on official WhatsApp.',
    'home.whatsapp_btn': 'WhatsApp Contact',
    'home.business_location': 'Centre Location',
    'home.active_apps': 'Active Applications',
    'home.view_all_apps': 'View All Applications',
    'home.no_active_apps': 'No ongoing applications right now.',
    'home.apply_new': 'Apply for Service',

    // Categories
    'cat.all': 'All',
    'cat.aadhaar': 'Aadhaar',
    'cat.pan': 'PAN Card',
    'cat.voter': 'Voter Card',
    'cat.ration': 'Ration Card',
    'cat.ayushman': 'Ayushman',
    'cat.epfo': 'EPFO / PF',
    'cat.dl': 'Driving Licence',
    'cat.other': 'Other Services',

    // Service Detail & Booking
    'service.required_documents': 'Required Documents',
    'service.docs_instruction': 'Please keep the following documents ready before starting your application:',
    'service.why_needed': 'Why this document is required:',
    'service.mandatory': 'Mandatory',
    'service.optional': 'Optional',
    'service.select_subservice': 'Select Specific Sub-Service',
    'service.booking_type': 'Booking Type',
    'service.standard_booking': 'Standard Assistance',
    'service.standard_booking_desc': 'Regular processing queue with dedicated verification support.',
    'service.permanent_booking': 'Permanent Booking',
    'service.permanent_booking_desc': 'Reserved priority slot for accelerated official submission and tracking.',
    'service.apply_now': 'Start Application',
    'service.permanent_badge': 'Permanent Booking Available',

    // Application Form
    'form.step1': '1. Service & Booking',
    'form.step2': '2. Applicant Details',
    'form.step3': '3. Document Upload',
    'form.step4': '4. Consent & Submit',
    'form.applicant_name': 'Applicant Full Name',
    'form.applicant_phone': 'Mobile Number (10 digits)',
    'form.applicant_email': 'Google Account Email',
    'form.applicant_address': 'Village / Locality / Full Address',
    'form.notes_label': 'Specific Instructions or Notes (Optional)',
    'form.notes_placeholder': 'e.g. Need correction of spelling mistake in surname...',
    'form.upload_instruction': 'Upload scanned copies or clear photos (JPG, PNG or PDF)',
    'form.choose_file': 'Choose File',
    'form.file_uploaded': 'Uploaded',
    'form.max_size': 'Max 5MB per document',
    'form.consent_title': 'Customer Consent & Verification Declaration',
    'form.consent_text': 'I hereby confirm that all information and documents supplied are true, authentic and legal. I authorize AFRAN ONLINE CENTRE to process this application assistance on government portals on my behalf.',
    'form.consent_error': 'Please check the consent box to proceed.',
    'form.submit_button': 'Confirm & Submit Application',
    'form.submitting': 'Submitting...',
    'form.back': 'Back',
    'form.next': 'Next Step',
    'form.cancel': 'Cancel',

    // Submission Success
    'success.title': 'Application Submitted Successfully!',
    'success.app_id': 'Application ID',
    'success.status': 'Current Status',
    'success.whatsapp_status': 'WhatsApp Notification Status',
    'success.pending_whatsapp': 'Ready to Notify (Pending WhatsApp Dispatch)',
    'success.sent_whatsapp': 'Notified to Centre WhatsApp',
    'success.send_wa_action': 'Send Application Slip to Centre WhatsApp',
    'success.view_my_apps': 'Go to My Applications',
    'success.close': 'Close',

    // Statuses
    'status.submitted': 'Submitted',
    'status.under_review': 'Under Review',
    'status.processing': 'Processing',
    'status.completed': 'Completed',
    'status.rejected': 'Rejected',

    // Applications View
    'apps.title': 'My Applications',
    'apps.subtitle': 'Track the real-time status of your online submissions',
    'apps.empty_title': 'No Applications Found',
    'apps.empty_desc': 'You have not submitted any applications yet. Select a service from the home screen to begin.',
    'apps.app_id': 'ID',
    'apps.applied_on': 'Applied on',
    'apps.view_details': 'View Details',
    'apps.details_modal_title': 'Application Details & Progress',
    'apps.timeline': 'Status Timeline',
    'apps.attached_docs': 'Uploaded Documents',
    'apps.no_docs': 'No additional documents attached',
    'apps.contact_centre': 'Contact Centre About This Application',

    // Notifications
    'notif.title': 'Notifications',
    'notif.empty': 'No notifications at this moment.',
    'notif.mark_all_read': 'Mark all as read',

    // Profile & Auth
    'profile.title': 'Customer Profile',
    'profile.subtitle': 'Personal details and secure account management',
    'profile.mobile': 'Mobile Number',
    'profile.add_mobile': 'Add Mobile Number',
    'profile.save': 'Save Changes',
    'profile.language_switch': 'Language Preference',
    'profile.total_apps': 'Total Applications',
    'profile.in_progress': 'In Progress',
    'profile.completed': 'Completed',
    'profile.centre_info': 'Centre Information & Location',
    'profile.logout': 'Sign Out',
    'profile.logging_out': 'Signing out...',
    'profile.login_required': 'Sign-In Required',
    'profile.login_desc': 'Sign in securely with your Google account to save applications, track progress and access your records anytime.',
    'profile.google_login': 'Sign in with Google',
    'profile.security_notice': 'Private & customer-isolated. No other customer can access your documents or records.',
    'profile.need_mobile_title': 'Provide Your Mobile Number',
    'profile.need_mobile_desc': 'Please provide an active 10-digit mobile number so the centre can contact you regarding your application status.'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('afran_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('afran_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
