// Content sourced from Devasani Bharath's résumé. Contact details are
// intentionally absent: visitors reach out through the contact form only.

export const profile = {
  name: 'Devasani Bharath',
  shortName: 'Bharath',
  role: 'Full-Stack Developer',
  location: 'Hyderabad, India',
  github: 'https://github.com/Cleancode16',
}

// About bento grid. `illustration` keys resolve in components/about/illustrations.jsx.
export const aboutCards = [
  {
    title: 'First-Principles Thinking',
    text: 'Break complex problems into fundamentals, question assumptions, and build the simplest solution that works.',
    illustration: 'firstPrinciples',
  },
  {
    title: 'End-to-End Engineering',
    text: 'I enjoy owning a feature from database schema and API design to the final user interface.',
    illustration: 'endToEnd',
  },
  {
    title: 'Scalable Systems',
    text: 'I am interested in system design, clear service boundaries, and building applications that can grow reliably.',
    illustration: 'scalable',
  },
  {
    title: 'Real-Time Applications',
    text: 'I explore applications where multiple users interact through synchronized rooms, events, and shared state.',
    illustration: 'realTime',
  },
  {
    title: 'Problem Solving with CP & DSA',
    text: 'Competitive programming sharpens my reasoning about complexity, edge cases, algorithms, and data structures.',
    illustration: 'problemSolving',
  },
  {
    title: 'Build, Debug, Improve',
    text: 'I learn by implementing, testing, understanding failures, and continuously refining solutions.',
    illustration: 'buildDebug',
  },
]

// Roles shown in the hero, in the owner's order.
export const heroRoles = [
  'Software Development Engineer',
  'Full-Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack AI Developer',
]

// "Currently" list at the bottom of the hero illustration card (the developer's stated interests).
export const heroCurrently = [
  'Building full-stack products with React, Node.js and MongoDB',
  'Studying system design and scalable architecture',
  'Competing on LeetCode, CodeChef and Codeforces',
]

// Résumé-backed figures shown in the hero's highlights card.
export const heroStats = [
  { value: '600+', label: 'Problems solved' },
  { value: '2027', label: 'Graduating' },
  { value: '8.97/10', label: 'CGPA' },
]

export const experience = [
  {
    kind: 'Work',
    role: 'Frontend Developer Intern',
    org: 'Intripid (startup)',
    period: 'Oct 2025 – Nov 2025',
    points: [
      'Built responsive, reusable UI components with React.js and Tailwind CSS.',
      'Improved UI consistency through layout refinement and better user interactions.',
    ],
    tags: ['React.js', 'Tailwind CSS'],
  },
  {
    kind: 'Community',
    role: 'Tutor & Problem Setter',
    org: 'ACM VNR VJIET Student Chapter, Hyderabad',
    period: 'Volunteer',
    points: [
      'Conducted workshops for junior students on data structures and competitive programming.',
      'Designed and set problems for a national-level contest, the Winter Coding Contest, balancing difficulty with learning outcomes.',
    ],
    tags: ['Teaching', 'Problem setting', 'DSA'],
  },
]

export const education = [
  {
    school: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    degree: 'B.Tech in Computer Science and Engineering',
    period: 'Sep 2023 – May 2027 (expected)',
    result: 'CGPA 8.97 / 10',
  },
  {
    school: 'Narayana Junior College, Hyderabad',
    degree: 'Intermediate (MPC)',
    period: 'Jun 2021 – May 2023',
    result: '97.7%',
  },
  {
    school: 'St. Paul’s High School, Jangaon',
    degree: 'High School',
    period: '2021',
    result: 'CGPA 10 / 10',
  },
]

export const certifications = [
  { title: 'Smart Coder Certification', issuer: 'Smart Interviews', year: '2025' },
  { title: 'Mastering Data Structures & Algorithms using C and C++', issuer: 'Udemy (Abdul Bari)' },
]

// Technologies from the résumé. `icon` keys resolve in components/skills/TechIcon.jsx:
// "si*" names are official brand marks (simple-icons), the rest are Lucide icons.
export const skillGroups = [
  {
    id: 'languages',
    title: 'Languages',
    short: 'Languages',
    items: [
      { name: 'C', icon: 'siC' },
      { name: 'C++', icon: 'siCplusplus' },
      { name: 'Java', icon: 'siOpenjdk' },
      { name: 'JavaScript', icon: 'siJavascript' },
      { name: 'TypeScript', icon: 'siTypescript' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    short: 'Frontend',
    items: [
      { name: 'React.js', icon: 'siReact' },
      { name: 'Next.js', icon: 'siNextdotjs' },
      { name: 'Recoil', icon: 'siRecoil' },
      { name: 'Tailwind CSS', icon: 'siTailwindcss' },
      { name: 'Bootstrap', icon: 'siBootstrap' },
      { name: 'HTML', icon: 'siHtml5' },
      { name: 'CSS', icon: 'siCss' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & real-time',
    short: 'Backend',
    items: [
      { name: 'Node.js', icon: 'siNodedotjs' },
      { name: 'Express.js', icon: 'siExpress' },
      { name: 'Socket.io', icon: 'siSocketdotio' },
      { name: 'REST APIs', icon: 'Webhook' },
      { name: 'JWT authentication', icon: 'siJsonwebtokens' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    short: 'Databases',
    items: [
      { name: 'MongoDB', icon: 'siMongodb' },
      { name: 'SQL', icon: 'Database' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & deployment',
    short: 'Tools',
    items: [
      { name: 'Git', icon: 'siGit' },
      { name: 'GitHub', icon: 'siGithub' },
      { name: 'Vercel', icon: 'siVercel' },
      { name: 'Render', icon: 'siRender' },
    ],
  },
  {
    id: 'fundamentals',
    title: 'CS fundamentals',
    short: 'Fundamentals',
    items: [
      { name: 'Data Structures & Algorithms', icon: 'Binary' },
      { name: 'Object-Oriented Programming', icon: 'Boxes' },
      { name: 'Operating Systems', icon: 'Cpu' },
      { name: 'DBMS', icon: 'Table2' },
      { name: 'Computer Networks', icon: 'Network' },
    ],
  },
]

// Core stack shown in the Dock (names must match items above).
export const dockStack = [
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'JavaScript',
  'TypeScript',
  'Tailwind CSS',
  'Socket.io',
  'C++',
  'Git',
]

// Ratings and counts are the figures listed on the résumé. They are not fetched live.
export const cpPlatforms = [
  {
    platform: 'LeetCode',
    icon: 'siLeetcode',
    handle: 'cleancode16',
    url: 'https://leetcode.com/u/cleancode16/',
    description: 'Data structures and algorithms practice, plus rated contests.',
    detail: '500+ problems solved',
    rating: 1764,
  },
  {
    platform: 'CodeChef',
    icon: 'siCodechef',
    handle: 'devasanibharat',
    url: 'https://www.codechef.com/users/devasanibharat',
    description: 'Rated contests across a wide range of algorithmic topics.',
    detail: '2-star coder',
    rating: 1516,
  },
  {
    platform: 'Codeforces',
    icon: 'siCodeforces',
    handle: 'cleancode08',
    url: 'https://codeforces.com/profile/cleancode08',
    description: 'Timed contests focused on speed and correctness under pressure.',
    detail: 'Rated contest participant',
    rating: 1104,
  },
]

export const cpSummary = [
  { value: '600+', label: 'Problems solved across platforms' },
  { value: '1764', label: 'LeetCode maximum rating' },
  { value: '2-star', label: 'CodeChef designation' },
]

export const cpHighlights = [
  {
    title: '600+ problems solved',
    text: 'Consistent practice across LeetCode, Codeforces and CodeChef, from fundamentals to contest problems.',
  },
  {
    title: 'Finalist, CodeVerse 2025',
    text: 'Campus-level competitive programming contest organised by Turing Hut, VNRVJIET.',
  },
  {
    title: 'Problem setter, Winter Coding Contest',
    text: 'Designed problems for a national-level contest with the ACM VNR VJIET Student Chapter.',
  },
  {
    title: 'Hackathons',
    text: 'Convergence, Innovathon and Technovista: rapid prototyping and problem-solving in teams.',
  },
]
