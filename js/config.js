/* ============================================================================
   CONFIG — yahin se apna saara content badlo (text, links, images).
   Koi bhi image: bas file `assets/...` folder me rakho aur neeche ka path likho.
   ============================================================================ */

const CONFIG = {

  /* ---------- PROFILE ---------- */
  profile: {
    name:     'Avinash Parab',
    email:    'avinashparab170799@gmail.com',
    phone:    '+91-7990985830',
    location: 'Vadodara, India',
    photo:         'assets/profile.jpg',   // apni photo (jpg/png) is naam se rakho
    photoFallback: 'assets/photo.svg',   // photo na mile to ye dikhega
    resume:        'assets/Avinash_Parab_Resume_2026.pdf',
    bio: `I'm <em>Avinash</em> — I turn repetitive work into <em>automation</em>.
          From Nissan's OTA backend at TCS to payment analytics at Bank of Baroda's
          subsidiary and data-quality automation at Numerator. Currently deepening
          DSA &amp; System Design (<em>275+</em> LeetCode problems).`
  },

  /* ---------- SOCIAL (hover preview ke liye) ---------- */
  social: {
    linkedin: 'https://www.linkedin.com/in/avinash-parab-6a76a622a/',   // poora URL
    github:   'AvinashParab99',                  // sirf username
    leetcode: 'Avinash_Parab'                 // sirf username
  },

  /* ---------- SKILLS ---------- */
  skillCategories: {
    languages:  'Languages',
    frameworks: 'Frameworks',
    databases:  'Databases',
    cloud:      'Cloud & Tools',
    core:       'Core Concepts',
    learning:   'Learning'
  },
  skills: [
    { name: 'Python', cat: 'languages' },  { name: 'C#', cat: 'languages' },
    { name: 'SQL', cat: 'languages' },     { name: 'HTML', cat: 'languages' },
    { name: 'CSS', cat: 'languages' },

    { name: 'Flask', cat: 'frameworks' },  { name: 'Pandas', cat: 'frameworks' },
    { name: 'NumPy', cat: 'frameworks' },  { name: 'OpenCV', cat: 'frameworks' },
    { name: 'GSAP', cat: 'frameworks' },

    { name: 'PostgreSQL', cat: 'databases' }, { name: 'MySQL', cat: 'databases' },

    { name: 'Azure', cat: 'cloud' },       { name: 'Git', cat: 'cloud' },
    { name: 'GitHub', cat: 'cloud' },      { name: 'Power BI', cat: 'cloud' },
    { name: 'Excel', cat: 'cloud' },       { name: 'Google Sheets', cat: 'cloud' },
    { name: 'Apps Script', cat: 'cloud' }, { name: 'Docker', cat: 'cloud' },

    { name: 'Automation', cat: 'core' },   { name: 'Backend Development', cat: 'core' },
    { name: 'REST APIs', cat: 'core' },    { name: 'Scalable Systems', cat: 'core' },
    { name: 'Data Processing', cat: 'core' }, { name: 'Debugging', cat: 'core' },
    { name: 'Process Optimization', cat: 'core' },

    { name: 'DSA', cat: 'learning' },      { name: 'System Design', cat: 'learning' },
    { name: 'LeetCode 275+', cat: 'learning' }
  ],

  /* ---------- EDUCATION ----------
     logo: college ka logo (assets/logos/ me rakho) — na mile to initials dikhenge.
     cgpa / cgpaMax: ring me dikhta hai. highlights: chhote tags. */
  education: [
    {
      start: 2017, end: 2021,
      title:  'Bachelor of Engineering – Electronics & Communication',
      place:  'Government Engineering College (GTU), Bharuch',
      cgpa: 7.18, cgpaMax: 10,
      highlights: ['Electronics & Communication', 'GTU', 'Bharuch, Gujarat'],
      logo: 'assets/logos/gec.png', initials: 'GEC', color: '#1a1618'
    }
  ],

  /* ---------- WORK JOURNEY (purana -> naya; path isi order me chalega) ----------
     logo: company logo (assets/logos/ me rakho) — na mile to initials + color dikhega.
     stat: card ke saamne wali khaali side par bada number (count-up animation). */
  experience: [
    {
      period:  'Mar 2022 — Aug 2023',
      role:    'Assistant System Engineer · Python Developer',
      company: 'Tata Consultancy Services · Gandhinagar',
      logo: 'assets/logos/tcs.png', initials: 'TCS', color: '#1f3a8a',
      summary: 'Automotive backend (Nissan FOTA) and a real-time vision dashboard (Mitsubishi).',
      skills:  ['.NET Microservices', 'PostgreSQL', 'Azure', 'Python', 'Pandas', 'OpenCV'],
      wins: [
        'Core member of an 800+ global team on Nissan OTA updates',
        '20% faster service response through code optimisation',
        'Live object detection (trees, cows, pedestrians) for Mitsubishi',
        'Earned AZ-900 & DP-900 Azure certifications'
      ],
      stat: { value: 20, suffix: '%', label: 'faster service response on Nissan FOTA' }
    },
    {
      period:  'Apr 2024 — Aug 2025',
      role:    'Senior Executive',
      company: 'Baroda Global Shared Service Ltd · Vadodara',
      logo: 'assets/logos/baroda.png', initials: 'BG', color: '#d9534f',
      summary: 'Payment data analysis and automation for a Bank of Baroda subsidiary.',
      skills:  ['Python', 'Pandas', 'NumPy', 'Excel', 'Razorpay', 'CCAvenue', 'Airpay'],
      wins: [
        '20% fewer reconciliation delays through transaction analysis',
        '95% on-time project completion with aggregators & tech teams',
        '35% less manual effort, 45% better accuracy via Python automation',
        '15% fewer financial errors; 25% higher transaction throughput'
      ],
      stat: { value: 95, suffix: '%', label: 'on-time project completion' }
    },
    {
      period:  'Aug 2025 — Now',
      role:    'Custom Group Associate – Data Quality & Taxonomy',
      company: 'Numerator · India (Remote)',
      logo: 'assets/logos/numerator.png', initials: 'N', color: '#0f766e',
      summary: 'Product taxonomy, attribute validation and workflow automation.',
      skills:  ['Python', 'Google Apps Script', 'Slack automation', 'Dashboards', 'Data QC'],
      wins: [
        'Tracking process cut from 2 hours to 20 minutes (~83%)',
        '~60% fewer manual tracker updates with dashboards + Slack flows',
        '95%+ delivery accuracy across projects',
        'Star Performer & Spot Awards for automation'
      ],
      stat: { value: 83, suffix: '%', label: 'less time on tracking (2 hrs → 20 min)' }
    }
  ],

  /* ---------- PROJECTS ----------
     image: apna screenshot daalo (kisi bhi size ka) — card ke size me auto fit hoga.
     colors: image na ho tab gradient ke 2 colors. */
  projects: [
    { title: 'Automation Suite',          subtitle: 'Numerator · Python + Apps Script', category: 'Automation', image: 'assets/projects/p1.jpg', colors: ['#ff6a3d', '#7a2bff'] },
    { title: 'Nissan FOTA',               subtitle: 'TCS · .NET, PostgreSQL, Azure',    category: 'Backend',    image: 'assets/projects/p2.jpg', colors: ['#2b3dff', '#00d4ff'] },
    { title: 'Payment Analytics',         subtitle: 'Baroda Global · Pandas, NumPy',    category: 'Data',       image: 'assets/projects/p3.jpg', colors: ['#1f7a4d', '#c8ff3d'] },
    { title: 'Mitsubishi Live Dashboard', subtitle: 'TCS · OpenCV, Pandas',             category: 'Vision',     image: 'assets/projects/p4.jpg', colors: ['#0b0b0b', '#ff4f8b'] },
    { title: 'Festivus',                  subtitle: 'PyPI CLI · argparse',              category: 'Tools',      image: 'assets/projects/p5.jpg', colors: ['#ff9fb8', '#ffd36b'] },
    { title: 'YouTube Downloader',        subtitle: 'Tkinter · pytube',                 category: 'Tools',      image: 'assets/projects/p6.jpg', colors: ['#3b82f6', '#111111'] },
    { title: 'Colour Extractor',          subtitle: 'OpenCV · KMeans',                  category: 'Vision',     image: 'assets/projects/p7.jpg', colors: ['#f59e0b', '#be185d'] }
  ],

  /* ---------- CERTIFICATES & AWARDS ----------
     image: jpg / png / svg — sab ek hi box me poori dikhengi (crop nahi hogi). */
  certificates: [
    { title: 'Numerator Star Performer Award',  year: '2026', issuer: 'For automation (May)',      image: 'assets/certs/star.jpg' },
    { title: 'Numerator Spot Award',            year: '2025', issuer: 'For automation (December)', image: 'assets/certs/spot.png' },
    { title: 'Azure Fundamentals (AZ-900)',     year: '2022', issuer: 'Microsoft Certified',       image: 'assets/certs/az900.png' },
    { title: 'Azure Data Fundamentals (DP-900)',year: '2022', issuer: 'Microsoft Certified',       image: 'assets/certs/dp900.png' }
  ],

  /* ---------- SHOUT OUTS ----------
     image: real screenshot (chat / LinkedIn recommendation). Sab same size ke cards me aayenge.
     image na ho to quote/name wala placeholder card dikhega. */
  shouts: [
     { image: 'assets/shouts/s1.jpg', quote: 'Add a real testimonial from a manager here. One or two lines about your impact.', name: 'Name Surname', role: 'Manager, Numerator' },
    { image: 'assets/shouts/s2.jpg', quote: 'Add a real testimonial from a colleague here. Mention reliability and speed.',    name: 'Name Surname', role: 'Colleague, Baroda Global' }

  ],

  /* ---------- LOOK & FEEL ---------- */
  settings: {
    projectImageFit: 'cover',    // 'cover' = card bhar ke (crop ho sakta) | 'contain' = poori image
    shoutImageFit:   'contain'   // screenshots ke liye 'contain' best hai
  }
};
