// Every feature listed here was verified against the project's README, source
// code or package manifests. Live demo URLs are included only where verified.
// Display order chosen by the owner. The first three (featured) render as full-width rows;
// the rest as compact cards under "More projects".
// `highlights` are the short recruiter-facing points on the card; `implementation`
// items ({ title, text }) and the rest fill the case-study window.
export const projects = [
  {
    id: 'event-connect',
    featured: true,
    name: 'Event-Connect',
    tagline: 'One place for every club event on campus.',
    context: 'Full-stack MERN platform',
    highlights: [
      'Built a full-stack MERN platform where clubs publish events and students discover and enroll from one calendar.',
      'Implemented role-based access for students and organizers with email-verified sign-up.',
      'Automated participant reporting with one-click PDF and Excel exports, replacing manual spreadsheets.',
    ],
    problem:
      'Event information in colleges is scattered across posters, chats and notices. Students miss events, and organizers have no reliable view of who registered.',
    approach:
      'A centralized MERN application with role-based access for students and organizers, email-verified sign-up, and a calendar as the main way to discover what is happening.',
    implementation: [
      { title: 'Calendar-first discovery', text: 'Students browse events by date and open full event details in one view.' },
      {
        title: 'Organizer dashboard',
        text: 'Manages participants and exports structured reports as PDF (jsPDF) and Excel (xlsx).',
      },
      {
        title: 'Auth and media pipeline',
        text: 'Email verification through Nodemailer; gallery uploads handled with Multer and stored on Cloudinary.',
      },
      { title: 'State management', text: 'Client state in Recoil, persisted across reloads with recoil-persist.' },
    ],
    outcome:
      'Clubs publish and manage events in one place, students enroll in real time, and organizers export participant data without manual spreadsheets.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Recoil', 'Tailwind CSS', 'Nodemailer', 'Cloudinary'],
    repo: 'https://github.com/Cleancode16/Event-Connect',
    live: 'https://event-connect-six-zeta.vercel.app',
    visual: 'calendar',
  },
  {
    id: 'codebattle',
    featured: true,
    name: 'CodeBattle',
    tagline: 'Competitive programming, head to head.',
    context: 'Real-time competitive programming platform',
    highlights: [
      'Engineered real-time 1v1, multiplayer and 2v2–4v4 team coding battles over Socket.io.',
      'Designed skill-based matchmaking that pairs players within a ±200 rating range, with a two-minute search timeout.',
      'Removed manual judging by verifying accepted submissions through the Codeforces API to decide winners automatically.',
      'Added streaks, activity heatmaps and a paginated global leaderboard to drive repeat practice.',
    ],
    problem:
      'Practising alone makes it hard to stay consistent and to simulate contest pressure. Existing judges show results, but not a live opponent.',
    approach:
      'Use Codeforces as the source of problems and the judge, and build the competitive layer on top: matchmaking, rooms, timers and scoring over Socket.io.',
    implementation: [
      {
        title: 'Quick Match',
        text: 'Skill-based pairing within a ±200 rating range, with a two-minute search timeout.',
      },
      {
        title: 'Rooms and team battles',
        text: 'Custom duo, trio and squad rooms, 2v2 to 4v4 battles, and joining by a six-character room code.',
      },
      {
        title: 'Automatic results',
        text: 'Winners are decided by verifying accepted submissions through the Codeforces API.',
      },
      {
        title: 'Engagement features',
        text: 'Topic Mastery practice, Problem of the Day with streaks, activity heatmaps and a paginated leaderboard.',
      },
    ],
    outcome:
      'Turns solo practice into a live, scored competition with history, streaks and leaderboards that keep players coming back.',
    stack: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT', 'Codeforces API'],
    repo: 'https://github.com/Cleancode16/codeBattle-MatchMaking1',
    live: 'https://code-battle-match-making1.vercel.app',
    visual: 'battle',
  },
  {
    id: 'craftconnect',
    featured: true,
    name: 'CraftConnect',
    tagline: 'A marketplace and community for traditional artisans.',
    context: 'Hackathon project · Convergence',
    highlights: [
      'Delivered a multi-role platform for users, artisans, NGOs and admins, each with a dedicated dashboard.',
      'Built a marketplace with cart, orders and an in-app wallet on an Express API of 20+ route modules.',
      'Integrated real-time buyer–artisan chat over Socket.io and Google Gemini guidance for NGO sponsor outreach.',
    ],
    problem:
      'Artisans often lack a direct route to buyers, funding and visibility, while NGOs supporting them struggle to find sponsors and reach their communities.',
    approach:
      'One platform with four roles (user, artisan, NGO and admin), each with its own dashboard, backed by an Express API with more than twenty route modules.',
    implementation: [
      {
        title: 'Marketplace',
        text: 'Products, cart, orders and an in-app wallet; artisans manage their own listings and orders.',
      },
      {
        title: 'Community content',
        text: 'Workshops, art stories, artist posts and comments that showcase crafts and their makers.',
      },
      { title: 'Real-time chat', text: 'Users and artisans message over Socket.io; images upload through Cloudinary.' },
      {
        title: 'AI and analytics',
        text: 'Gemini (Vercel AI SDK) drafts sponsor-approach guidance for NGOs; Recharts powers the analytics views.',
      },
    ],
    outcome:
      'Brings commerce, community and funding for artisans together, with role-specific workflows for every participant.',
    stack: ['React.js', 'Redux', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Gemini API'],
    repo: 'https://github.com/Cleancode16/Convergence',
    live: 'https://craftconnect-ix7v.vercel.app/',
    visual: 'marketplace',
  },
  {
    id: 'collab-code-editor',
    featured: false,
    name: 'CollabCodeEditor',
    tagline: 'Write and run code together, in real time.',
    context: 'Real-time collaborative editor',
    highlights: [
      'Built shared coding rooms with live code sync, presence and chat over Socket.io.',
      'Added sandboxed execution in 13+ languages through Judge0, gated by a room-approval flow.',
      'Secured accounts with JWT and persisted room state in MongoDB.',
    ],
    problem:
      'Pair programming and group practice usually mean screen-sharing, where only one person can type and running code is out of everyone else’s hands.',
    approach:
      'Rooms with shareable codes where every keystroke syncs over Socket.io, and running code is a shared decision rather than one person’s action.',
    implementation: [
      {
        title: 'Rooms and presence',
        text: 'Join codes, member lists and live presence; room code and language are saved in MongoDB.',
      },
      { title: 'Live sync', text: 'Code changes and chat broadcast to everyone in the room over Socket.io.' },
      {
        title: 'Approval-based runs',
        text: 'Execution requests go to room members; a run proceeds once approved, or is rejected or cancelled.',
      },
      { title: 'Sandboxed execution', text: 'Compilation and execution through the Judge0 API, with JWT-authenticated accounts.' },
    ],
    outcome:
      'Lets a group write, discuss and run the same program together, without one person controlling the screen.',
    stack: ['React.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Judge0 API', 'JWT'],
    repo: 'https://github.com/Cleancode16/collabcodeeditor',
    live: 'https://code-collab-editor.vercel.app/',
    visual: 'editor',
  },
  {
    id: 'acadboost',
    featured: false,
    name: 'AcadBoost AI',
    tagline: 'Personalised study plans from real performance data.',
    context: 'Hackathon project · Innovathon 2026',
    highlights: [
      'Turned students’ test history across six CS subjects into AI-generated roadmaps and timetables (LLaMA 3.3 on Groq).',
      'Built a context-aware study chatbot that receives each student’s full academic profile.',
      'Added student and faculty roles with JWT and bcrypt, plus bulk mark updates for faculty.',
    ],
    problem:
      'Students see their marks but rarely get specific guidance on what to study next, or how to split limited time between weak and strong subjects.',
    approach:
      'Build each student’s context from their test history in MongoDB, then ask LLaMA models on Groq for structured, per-subject plans that the UI renders.',
    implementation: [
      {
        title: 'Roles and security',
        text: 'Student and faculty roles with JWT authentication and bcrypt hashing; faculty update marks individually or in bulk.',
      },
      {
        title: 'Adaptive planning',
        text: 'Per-subject roadmaps and daily, weekly and monthly timetables that give weaker subjects more time.',
      },
      { title: 'AI study assistant', text: 'A chatbot grounded in the student’s academic profile, with Markdown-rendered answers.' },
      {
        title: 'Analytics and resilience',
        text: 'Radar, bar and line charts (Recharts) for score trends; exponential-backoff retries on API rate limits.',
      },
    ],
    outcome:
      'Gives every student a data-driven study plan and a clear picture of their progress across Operating Systems, Networks, DBMS, OOP, DSA and Aptitude.',
    stack: ['React.js', 'Vite', 'Tailwind CSS', 'Express.js', 'MongoDB', 'Groq (LLaMA 3.3)', 'Recharts'],
    repo: 'https://github.com/Cleancode16/innovathon-2026',
    live: 'https://innovathon-2026.vercel.app',
    visual: 'analytics',
  },
  {
    id: 'proctoring',
    featured: false,
    name: 'AI-Assisted Online Proctoring System',
    tagline: 'Evidence-backed exam monitoring for human reviewers.',
    context: 'Major project · Computer vision & audio',
    highlights: [
      'Streamed webcam and microphone to a Python server over WebRTC for live, server-side analysis.',
      'Combined vision (FaceNet, YOLOv8, MediaPipe) and audio models to detect impersonation, extra people, devices and whispering.',
      'Produced explainable reports with a 0–100 risk score, evidence snapshots and PDF / Word / JSON exports.',
    ],
    problem:
      'Remote exams can be compromised by impersonation, a second person, phones or extra screens, looking away, or whispered help: things an invigilator would normally notice.',
    approach:
      'Stream camera and microphone from the browser to a Python server over WebRTC, run vision and audio models server-side, and fuse their signals into time-stamped, explained events.',
    implementation: [
      {
        title: 'Identity checks',
        text: 'Face and voice enrollment, FaceNet verification, MiniFASNet anti-spoofing, and head-pose and gaze tracking (MediaPipe, L2CS-Net).',
      },
      {
        title: 'Multimodal detection',
        text: 'YOLOv8 finds extra people and prohibited objects; Silero VAD, YAMNet and Resemblyzer flag speech, other voices and whispering.',
      },
      { title: 'Evidence fusion', text: 'A tolerance buffer confirms and de-duplicates events before they are scored.' },
      {
        title: 'Reviewer reports',
        text: 'A 0–100 risk score, a verdict with reasons, snapshots and audio clips, exported as PDF, Word or JSON.',
      },
    ],
    outcome:
      'Gives reviewers an explainable verdict backed by evidence rather than a black-box flag. Analysis runs live or on an uploaded exam video.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Python', 'Flask', 'WebRTC (aiortc)', 'PyTorch', 'TensorFlow', 'YOLOv8', 'MediaPipe'],
    repo: 'https://github.com/Cleancode16/major-part-2',
    live: null,
    visual: 'proctoring',
  },
]
