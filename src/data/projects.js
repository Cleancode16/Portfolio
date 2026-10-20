// Every feature listed here was verified against the project's README, source
// code or package manifests. Live demo URLs are included only where verified.
// Display order chosen by the owner. The first three (featured) render as full-width rows;
// the rest as compact cards under "More projects".
export const projects = [
  {
    id: 'event-connect',
    featured: true,
    name: 'Event-Connect',
    tagline: 'One place for every club event on campus.',
    context: 'Full-stack MERN platform',
    summary:
      'An event management platform where college clubs create and publish events, and students discover, enroll in and follow them from a single calendar.',
    problem:
      'Event information in colleges is scattered across posters, chats and notices. Students miss events, and organizers have no reliable view of who registered.',
    approach:
      'A centralized MERN application with role-based access for students and organizers, email-verified sign-up, and a calendar as the main way to discover what is happening.',
    implementation: [
      'Calendar-based discovery lets students browse events by date and open full event details.',
      'Organizer dashboard manages participants and exports structured reports as PDF (jsPDF) and Excel (xlsx).',
      'Email-based authentication with Nodemailer; media gallery uploads handled through Multer and Cloudinary.',
      'Client state managed with Recoil and persisted with recoil-persist.',
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
    summary:
      'A platform where programmers race to solve the same Codeforces problem in 1v1, multiplayer or team battles, with automatic matchmaking and instant results.',
    problem:
      'Practising alone makes it hard to stay consistent and to simulate contest pressure. Existing judges show results, but not a live opponent.',
    approach:
      'Use Codeforces as the source of problems and the judge, and build the competitive layer on top: matchmaking, rooms, timers and scoring over Socket.io.',
    implementation: [
      'Skill-based Quick Match pairs players within a ±200 rating range, with a two-minute search timeout.',
      'Custom duo, trio and squad rooms, 2v2 to 4v4 team battles, and joining by six-character room code.',
      'Winners are decided automatically by verifying accepted submissions through the Codeforces API.',
      'Topic Mastery practice, Problem of the Day with streaks, activity heatmaps and a paginated global leaderboard.',
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
    summary:
      'A multi-role platform connecting artisans, NGOs, buyers and administrators: a craft marketplace, workshops, art stories, donations and real-time messaging.',
    problem:
      'Artisans often lack a direct route to buyers, funding and visibility, while NGOs supporting them struggle to find sponsors and reach their communities.',
    approach:
      'One platform with four roles (user, artisan, NGO and admin), each with its own dashboard, backed by an Express API with more than twenty route modules.',
    implementation: [
      'Marketplace with products, cart, orders and an in-app wallet; artisans manage listings and orders.',
      'Workshops, art stories, artist posts and comments to showcase crafts and their makers.',
      'Real-time chat between users and artisans over Socket.io; image uploads through Cloudinary.',
      'AI-generated sponsor-approach guidance for NGOs via Google Gemini (Vercel AI SDK), plus analytics charts with Recharts.',
    ],
    outcome:
      'Brings commerce, community and funding for artisans together, with role-specific workflows for every participant.',
    stack: ['React.js', 'Redux', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Gemini API'],
    repo: 'https://github.com/Cleancode16/Convergence',
    live: null,
    visual: 'marketplace',
  },
  {
    id: 'collab-code-editor',
    featured: false,
    name: 'CollabCodeEditor',
    tagline: 'Write and run code together, in real time.',
    context: 'Real-time collaborative editor',
    summary:
      'A collaborative coding environment with shared rooms, live code synchronisation, in-room chat and sandboxed execution in 13+ languages.',
    problem:
      'Pair programming and group practice usually mean screen-sharing, where only one person can type and running code is out of everyone else’s hands.',
    approach:
      'Rooms with shareable codes where every keystroke syncs over Socket.io, and running code is a shared decision rather than one person’s action.',
    implementation: [
      'Room-based sessions with join codes, member lists and live presence; room code and language are saved in MongoDB.',
      'Real-time code synchronisation and chat broadcast to everyone in the room over Socket.io.',
      'Execution requests go to room members for approval; the run proceeds once approved, or is rejected or cancelled.',
      'Sandboxed compilation and execution through the Judge0 API, with JWT-authenticated accounts.',
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
    summary:
      'An academic performance platform that tracks scores across six core CS subjects and turns them into AI-generated roadmaps, timetables, resources and chat guidance.',
    problem:
      'Students see their marks but rarely get specific guidance on what to study next, or how to split limited time between weak and strong subjects.',
    approach:
      'Build each student’s context from their test history in MongoDB, then ask LLaMA models on Groq for structured, per-subject plans that the UI renders.',
    implementation: [
      'Student and faculty roles with JWT authentication and bcrypt password hashing; faculty can update marks individually or in bulk.',
      'Per-subject roadmaps and daily, weekly and monthly timetables that give weaker subjects more time.',
      'Context-aware chatbot that receives the student’s full academic profile, with Markdown-rendered answers.',
      'Radar, bar and line charts (Recharts) for subject comparison and score trends; retries with exponential backoff on rate limits.',
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
    summary:
      'A multimodal proctoring system that analyses a candidate’s webcam and microphone, detects suspicious behaviour, and produces a scored report a human reviewer can act on.',
    problem:
      'Remote exams can be compromised by impersonation, a second person, phones or extra screens, looking away, or whispered help: things an invigilator would normally notice.',
    approach:
      'Stream camera and microphone from the browser to a Python server over WebRTC, run vision and audio models server-side, and fuse their signals into time-stamped, explained events.',
    implementation: [
      'Face and voice enrollment, then identity verification with FaceNet, anti-spoofing with MiniFASNet, and head-pose and gaze tracking (MediaPipe, L2CS-Net).',
      'YOLOv8 detects extra people and prohibited objects; Silero VAD, YAMNet and Resemblyzer flag speech, other voices, whispering and suspicious sounds.',
      'A tolerance buffer and evidence-fusion engine confirm and de-duplicate events before scoring.',
      'Reports carry a 0–100 risk score, a verdict with reasons, evidence snapshots and audio clips, and PDF / Word / JSON exports.',
    ],
    outcome:
      'Gives reviewers an explainable verdict backed by evidence rather than a black-box flag. Analysis runs live or on an uploaded exam video.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Python', 'Flask', 'WebRTC (aiortc)', 'PyTorch', 'TensorFlow', 'YOLOv8', 'MediaPipe'],
    repo: 'https://github.com/Cleancode16/major-part-2',
    live: null,
    visual: 'proctoring',
  },
]
