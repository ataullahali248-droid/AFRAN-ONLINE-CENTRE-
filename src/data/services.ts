import { BusinessInfo, ServiceItem } from '../types';

export const BUSINESS_INFO: BusinessInfo = {
  name: 'AFRAN ONLINE CENTRE',
  address: 'UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA',
  whatsapp: '+91 7074626784',
  rawWhatsappNumber: '917074626784',
  landmark: 'Mamrejpur Bridge, Uttar Mahadebnagar',
  pincode: '742202',
  state: 'West Bengal'
};

export const SERVICES_CATALOG: ServiceItem[] = [
  // A. Aadhaar Assistance
  {
    id: 'aadhaar-service',
    category: 'aadhaar',
    titleBn: 'আধার কার্ড সহায়তা (Aadhaar Assistance)',
    titleEn: 'Aadhaar Assistance Services',
    shortDescBn: 'নাম, জন্মতারিখ, ঠিকানা ও বায়োমেট্রিক সংক্রান্ত অফিশিয়াল আধার সহায়তা।',
    shortDescEn: 'Official citizen assistance for name, date of birth, address and mobile updates.',
    isPopular: true,
    permanentBookingAvailable: true,
    subServicesBn: [
      'নাম সংশোধন ও আপডেট সহায়তা (Name Correction)',
      'জন্ম তারিখ সংশোধন সহায়তা (DOB Update)',
      'ঠিকানা পরিবর্তন ও আপডেট সহায়তা (Address Update)',
      'মোবাইল নম্বর আপডেট ও লিংক সহায়তা (Mobile Link / Update)',
      'অন্যান্য আধার সংক্রান্ত অনলাইন সহায়তা (Other Aadhaar Services)'
    ],
    subServicesEn: [
      'Name Correction / Update Assistance',
      'Date of Birth Update Assistance',
      'Address Update Assistance',
      'Mobile Number Update & Linking Assistance',
      'Other Aadhaar-Related Assistance'
    ],
    requiredDocs: [
      {
        id: 'aadhaar_copy',
        nameBn: 'বর্তমান আধার কার্ড / এনরোলমেন্ট স্লিপ',
        nameEn: 'Current Aadhaar Card / Enrollment Slip',
        descriptionBn: 'বর্তমান তথ্যের যাচাইকরণ ও ইউআইডি নম্বর নিশ্চিত করার জন্য প্রয়োজন।',
        descriptionEn: 'Required to verify current records and existing UID number.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'poi_doc',
        nameBn: 'পরিচয় প্রমাণপত্র (Proof of Identity - POI)',
        nameEn: 'Proof of Identity (POI)',
        descriptionBn: 'নাম বা জন্মতারিখ সংশোধনের জন্য ভোটার কার্ড, প্যান কার্ড বা পাসপোর্ট প্রয়োজন।',
        descriptionEn: 'Voter ID, PAN Card or Passport to officially verify legal name or identity.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'poa_doc',
        nameBn: 'ঠিকানার প্রমাণপত্র (Proof of Address - POA)',
        nameEn: 'Proof of Address (POA)',
        descriptionBn: 'ঠিকানা পরিবর্তনের ক্ষেত্রে বিদ্যুৎ বিল, ব্যাংক পাসবুক বা রেশন কার্ড প্রযোজ্য।',
        descriptionEn: 'Electricity bill, Bank passbook, or Ration card for address updates.',
        isMandatory: false,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  },

  // B. PAN Card
  {
    id: 'pan-service',
    category: 'pan',
    titleBn: 'প্যান কার্ড পরিষেবা (PAN Card Services)',
    titleEn: 'PAN Card Services',
    shortDescBn: 'নতুন প্যান কার্ড আবেদন, ত্রুটি সংশোধন এবং নষ্ট বা হারানো প্যান রিপ্রিন্ট।',
    shortDescEn: 'New instant PAN application, demographic correction, and reprint assistance.',
    isPopular: true,
    permanentBookingAvailable: true,
    subServicesBn: [
      'নতুন প্যান কার্ড আবেদন (New PAN Application Form 49A)',
      'প্যান কার্ডের তথ্য সংশোধন (PAN Name / DOB / Parent Correction)',
      'প্যান কার্ড রিপ্রিন্ট / ডুপ্লিকেট (PAN Card Reprint / Lost Card)'
    ],
    subServicesEn: [
      'New PAN Application Assistance',
      'PAN Correction Assistance',
      'PAN Reprint / Lost Card Assistance'
    ],
    requiredDocs: [
      {
        id: 'pan_aadhaar',
        nameBn: 'আধার কার্ডের কপি (বাধ্যতামূলক)',
        nameEn: 'Aadhaar Card Copy (Mandatory)',
        descriptionBn: 'প্যান কার্ডের পরিচিতি ও ঠিকানা যাচাইকরণে আধার কেন্দ্রীয়ভাবে বাধ্যতামূলক।',
        descriptionEn: 'Mandatory proof of identity and address for PAN issuance.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'applicant_photo',
        nameBn: 'পাসপোর্ট সাইজ রঙিন ছবি',
        nameEn: 'Passport Size Photograph',
        descriptionBn: 'নতুন প্যান কার্ডে মুদ্রণের জন্য সাম্প্রতিক রঙিন ছবি আবশ্যক।',
        descriptionEn: 'Recent colored photograph to print on the physical PAN card.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png']
      },
      {
        id: 'applicant_signature',
        nameBn: 'আবেদনকারীর স্বাক্ষর বা টিপসই',
        nameEn: 'Applicant Signature Specimen',
        descriptionBn: 'প্যান কার্ডে প্রদর্শিত হওয়ার জন্য সাদা কাগজে স্পষ্ট স্বাক্ষর প্রয়োজন।',
        descriptionEn: 'Clear signature on plain white paper for card printing.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png']
      }
    ]
  },

  // C. Voter Card
  {
    id: 'voter-service',
    category: 'voter',
    titleBn: 'ভোটার কার্ড পরিষেবা (Voter Card / EPIC)',
    titleEn: 'Voter Card (EPIC) Services',
    shortDescBn: 'নতুন ভোটার তালিকাভুক্তিকরণ (ফর্ম ৬), নাম ও ঠিকানা সংশোধন (ফর্ম ৮)।',
    shortDescEn: 'New voter enrollment, correction of details, and assembly shifting.',
    isPopular: true,
    permanentBookingAvailable: true,
    subServicesBn: [
      'নতুন ভোটার রেজিস্ট্রেশন (New Voter Registration Form 6)',
      'ভোটার কার্ডে নাম ও জন্মতারিখ সংশোধন (Name & Age Correction Form 8)',
      'ঠিকানা পরিবর্তন / বুথ পরিবর্তন (Address & Assembly Shifting)',
      'অন্যান্য ভোটার পরিষেবা ও আধার লিংক (Other Voter Card Services)'
    ],
    subServicesEn: [
      'New Voter Registration Assistance',
      'Name & Detail Correction Assistance',
      'Address Shifting Assistance',
      'Other Voter Services & Aadhaar Linking'
    ],
    requiredDocs: [
      {
        id: 'voter_age_proof',
        nameBn: 'বয়সের প্রমাণপত্র (Age Proof)',
        nameEn: 'Age Proof (Birth Certificate / Aadhaar / Marksheet)',
        descriptionBn: '১৮ বছর বয়স উত্তীর্ণ হওয়ার প্রমাণ যাচাই করতে সরকার কর্তৃক স্বীকৃত নথিপত্র।',
        descriptionEn: 'Official document to verify minimum 18 years age eligibility.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'voter_residence_proof',
        nameBn: 'বর্তমান ঠিকানার প্রমাণপত্র (Address Proof)',
        nameEn: 'Proof of Residence (Address Proof)',
        descriptionBn: 'সংশ্লিষ্ট নির্বাচনী এলাকার বাসিন্দা হিসেবে অবস্থান নিশ্চিত করার নথি।',
        descriptionEn: 'Proof of dwelling to verify electoral constituency bounds.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'voter_photo',
        nameBn: 'পাসপোর্ট সাইজ ফটো',
        nameEn: 'Passport Size Photo',
        descriptionBn: 'ভোটার পরিচয়পত্রে মুদ্রিত করার জন্য পরিষ্কার মুখচ্ছবি।',
        descriptionEn: 'Clear facial portrait photograph for EPIC card generation.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png']
      }
    ]
  },

  // D. Ration Card
  {
    id: 'ration-service',
    category: 'ration',
    titleBn: 'ডিজিটাল রেশন কার্ড (Ration Card Services)',
    titleEn: 'Digital Ration Card Services',
    shortDescBn: 'নতুন রেশন কার্ড আবেদন, পরিবারে নতুন সদস্য সংযোজন বা নাম বিয়োজন।',
    shortDescEn: 'New digital ration card, addition/deletion of family members, and corrections.',
    isPopular: false,
    permanentBookingAvailable: true,
    subServicesBn: [
      'নতুন রেশন কার্ড আবেদন (New Digital Ration Card Assistance)',
      'পরিবারে সদস্যের নাম যোগ বা বাদ (Name Addition / Deletion)',
      'রেশন কার্ড সংশোধন ও ঠিকানা আপডেট (Correction & Address Updation)'
    ],
    subServicesEn: [
      'New Ration Card Application Assistance',
      'Family Member Addition / Deletion Assistance',
      'Ration Correction and Address-Related Assistance'
    ],
    requiredDocs: [
      {
        id: 'ration_head_card',
        nameBn: 'পরিবার প্রধানের রেশন কার্ডের কপি',
        nameEn: 'Head of Family Ration Card Copy',
        descriptionBn: 'পরিবার ও খাদ্য সামগ্রী ডিলার কোড নিশ্চিত করতে প্রয়োজন।',
        descriptionEn: 'Required to map family grouping and assigned fair-price dealer.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'members_aadhaar',
        nameBn: 'সকল সদস্যের আধার কার্ড',
        nameEn: 'Aadhaar Cards of All Members',
        descriptionBn: 'ডিজিটাল বায়োমেট্রিক সিডিং ও যোগ্য সদস্য সংখ্যা যাচাই করতে প্রয়োজন।',
        descriptionEn: 'Required for digital seed verification and unique beneficiary quota.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  },

  // E. Ayushman Card
  {
    id: 'ayushman-service',
    category: 'ayushman',
    titleBn: 'আয়ুষ্মান কার্ড (Ayushman Bharat PM-JAY)',
    titleEn: 'Ayushman Card (PM-JAY)',
    shortDescBn: 'স্বাস্থ্য সাথী ও আয়ুষ্মান ভারত কার্ড যোগ্যতা যাচাই এবং নতুন কার্ড সহায়তা।',
    shortDescEn: 'Eligibility assessment, eKYC verification and Ayushman health card assistance.',
    isPopular: true,
    permanentBookingAvailable: true,
    subServicesBn: [
      'আয়ুষ্মান কার্ড যোগ্যতা ও আবেদন সহায়তা (Eligibility & Application)',
      'কার্ড ই-কেওয়াইসি ও কার্ড ডাউনলোড সহায়তা (Card e-KYC & Download)'
    ],
    subServicesEn: [
      'Ayushman Eligibility and Application Assistance',
      'Card eKYC and Download Assistance'
    ],
    requiredDocs: [
      {
        id: 'ayushman_aadhaar',
        nameBn: 'আবেদনকারীর আধার কার্ড',
        nameEn: 'Applicant Aadhaar Card',
        descriptionBn: 'কেন্দ্রীয় পোর্টাল থেকে ই-কেওয়াইসি যাচাইকরণের জন্য আধার বাধ্যতামূলক।',
        descriptionEn: 'Mandatory for direct OTP / demographic eKYC verification.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'ayushman_ration',
        nameBn: 'ডিজিটাল রেশন কার্ড কপি',
        nameEn: 'Digital Ration Card Copy',
        descriptionBn: 'SECC পরিবার তালিকা বা ক্যাটাগরি মিলিয়ে দেখতে রেশন কার্ড দরকার।',
        descriptionEn: 'Required to confirm SECC or priority household beneficiary registry.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  },

  // F. EPFO / PF Services
  {
    id: 'epfo-service',
    category: 'epfo',
    titleBn: 'ইপিএফও / পিএফ পরিষেবা (EPFO / PF Services)',
    titleEn: 'EPFO / PF Services',
    shortDescBn: 'পিএফ অ্যাডভান্স বা ফাইনাল উইথড্রল, ইউএএন অ্যাক্টিভেশন ও কেওয়াইসি সিডিং।',
    shortDescEn: 'PF advance claim, final withdrawal, UAN activation, and bank KYC linking.',
    isPopular: false,
    permanentBookingAvailable: true,
    subServicesBn: [
      'পিএফ টাকা তোলা ও অগ্রিম ক্লেইম (PF Withdrawal & Advance Claim Assistance)',
      'UAN অ্যাক্টিভেশন ও কেওয়াইসি আপডেট (UAN Activation & Bank KYC Linking)',
      'পাসবুক ও ব্যালেন্স চেক এবং অন্যান্য পিএফ পরিষেবা (EPFO Passbook & Assistance)'
    ],
    subServicesEn: [
      'PF-Related Online Withdrawal Assistance',
      'UAN Activation & Bank/PAN KYC Linking',
      'Passbook & Other Eligible EPFO Services'
    ],
    requiredDocs: [
      {
        id: 'pf_uan_doc',
        nameBn: 'ইউএএন (UAN) নম্বর ও মোবাইল নম্বর',
        nameEn: 'UAN Details / Member Slip',
        descriptionBn: 'সদস্য একাউন্ট খুঁজে পেতে ১২ অঙ্কের ইউনিভার্সাল অ্যাকাউন্ট নম্বর প্রয়োজন।',
        descriptionEn: '12-digit Universal Account Number required to access member ledger.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'pf_cheque',
        nameBn: 'বাতিল চেক (Cancelled Cheque) বা ব্যাংক পাসবুক',
        nameEn: 'Cancelled Cheque or Bank Passbook',
        descriptionBn: 'পিএফ এর অর্থ সঠিক ব্যাংক অ্যাকাউন্টে জমা করার স্বার্থে আইএফএসসি সহ প্রমাণের জন্য।',
        descriptionEn: 'Clear IFSC and account number verification for direct bank credit.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'pf_pan',
        nameBn: 'প্যান কার্ডের কপি',
        nameEn: 'PAN Card Copy',
        descriptionBn: '৫০ হাজার টাকার অধিক ক্লেইমের ক্ষেত্রে টিডিএস কর্তন থেকে রেহাই পেতে আবশ্যক।',
        descriptionEn: 'Required for tax exemption on eligible withdrawal claims.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  },

  // G. Driving Licence
  {
    id: 'dl-service',
    category: 'dl',
    titleBn: 'ড্রাইভিং লাইসেন্স (Driving Licence Services)',
    titleEn: 'Driving Licence Services',
    shortDescBn: 'লার্নার লাইসেন্স আবেদন, ডিএল নবায়ন এবং ঠিকানা বা তথ্য সংশোধন।',
    shortDescEn: 'Learner licence application, driving licence renewal, and duplicate copy assistance.',
    isPopular: false,
    permanentBookingAvailable: true,
    subServicesBn: [
      'লার্নার লাইসেন্স আবেদন সহায়তা (Learner Licence Assistance)',
      'ড্রাইভিং লাইসেন্স নবায়ন সহায়তা (DL Renewal Assistance)',
      'লাইসেন্স সংশোধন ও ডুপ্লিকেট কপি (Correction & Duplicate Copy Assistance)'
    ],
    subServicesEn: [
      'Learner Licence Application Assistance',
      'Driving Licence Renewal Assistance',
      'Correction and Other Eligible DL Services'
    ],
    requiredDocs: [
      {
        id: 'dl_age_proof',
        nameBn: 'বয়স ও পরিচয়ের প্রমাণপত্র',
        nameEn: 'Age & Identity Proof (Aadhaar / 10th Admit)',
        descriptionBn: 'মোটর ভেহিকেল আইনানুযায়ী নির্ধারিত বয়স যাচাইয়ের জন্য আবশ্যক।',
        descriptionEn: 'Required under Motor Vehicles Act to prove driving age qualification.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'dl_blood_group',
        nameBn: 'রক্তের গ্রুপ ও ফিটনেস বিবরণী',
        nameEn: 'Blood Group Record / Self Declaration',
        descriptionBn: 'জরুরি পরিস্থিতিতে দ্রুত চিকিৎসার সুবিধার্থে লাইসেন্সে রক্তগ্রুপ যুক্ত করা হয়।',
        descriptionEn: 'Blood group verification to emboss emergency medical data on licence.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'dl_existing',
        nameBn: 'বর্তমান লাইসেন্স কপি (নবায়নের ক্ষেত্রে)',
        nameEn: 'Existing Driving Licence (For Renewal)',
        descriptionBn: 'নবায়ন বা সংশোধনের জন্য পূর্ববর্তী লাইসেন্সের তথ্য আবশ্যক।',
        descriptionEn: 'Mandatory if applying for renewal, endorsement, or correction.',
        isMandatory: false,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  },

  // H. Other Online Services
  {
    id: 'other-service',
    category: 'other',
    titleBn: 'অন্যান্য অনলাইন পরিষেবা (Other Online Citizen Services)',
    titleEn: 'Other Online Citizen Services',
    shortDescBn: 'জাতিগত শংসাপত্র (Caste), ইনকাম ও ডমিসাইল, পাসপোর্ট ও সরকারি প্রকল্প সহায়তা।',
    shortDescEn: 'Caste certificates, Income/Domicile, Passport assistance, and government schemes.',
    isPopular: false,
    permanentBookingAvailable: true,
    subServicesBn: [
      'জাতিগত শংসাপত্র আবেদন সহায়তা (Caste Certificate - SC/ST/OBC)',
      'ইনকাম ও আবাসিক সার্টিফিকেট সহায়তা (Income & Residential Certificate)',
      'পাসপোর্ট আবেদন ও পুলিশ ভেরিফিকেশন সহায়তা (Passport Assistance)',
      'ট্রেড লাইসেন্স ও অনলাইন রেজিস্ট্রি (Trade Licence Assistance)',
      'সরকারি স্কলারশিপ ও অনুদান সহায়তা (Scholarship & Citizen Schemes)'
    ],
    subServicesEn: [
      'Caste Certificate Application Assistance (SC/ST/OBC)',
      'Income & Residential Certificate Assistance',
      'Passport Application Online Assistance',
      'Trade Licence & Business Registration Assistance',
      'Scholarship & Government Welfare Schemes Assistance'
    ],
    requiredDocs: [
      {
        id: 'other_aadhaar',
        nameBn: 'আধার কার্ড ও ফোন নম্বর',
        nameEn: 'Aadhaar Card & Phone Number',
        descriptionBn: 'আবেদনকারীর প্রাথমিক পরিচয়পত্র।',
        descriptionEn: 'Primary citizen identity credential.',
        isMandatory: true,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      },
      {
        id: 'other_support',
        nameBn: 'প্রাসঙ্গিক সহায়ক নথি (Supporting Documents)',
        nameEn: 'Relevant Supporting Document',
        descriptionBn: 'প্রকল্পের ধরন অনুযায়ী জমির দলিল, বংশতালিকা বা আয়ের প্রমাণ।',
        descriptionEn: 'Specific supporting evidence depending on the target scheme or certificate.',
        isMandatory: false,
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
      }
    ]
  }
];
