// ─── Types ────────────────────────────────────────────────────────────────

export type LessonStatus = "in-progress" | "completed" | "not-started";

export interface Instructor {
  initials: string;
  name: string;
  title: string;
  color?: "primary" | "secondary";
}

export interface LessonAsset {
  icon: string;
  label: string;
  color?: "primary" | "secondary" | "tertiary";
}

export interface Lesson {
  id: string;
  courseCode: string;
  courseCodeColor: "primary" | "secondary";
  faculty: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  status: LessonStatus;
  resumeAt?: string;
  instructor: Instructor;
  assets: LessonAsset[];
  thumbnail: string;
  thumbnailAlt: string;
}

export interface SessionCard {
  id: string;
  courseCode: string;
  type: "campus" | "online" | "cafe";
  subject: string;
  mentorName: string;
  mentorImg: string;
  mentorImgAlt: string;
  rating: string;
  sessionCount: number;
  price: number;
  date: string;
  time: string;
  locationTitle: string;
  locationDetail: string;
  accentColor: "primary" | "secondary";
  badge?: string;
  badgeColor?: "error" | "primary" | "secondary";
  whatsapp?: string;
  meetLink?: string;
  fellow?: string;
  tutorPayout: number;
}

// ─── Lessons Data ─────────────────────────────────────────────────────────

export const lessons: Lesson[] = [
  {
    id: "comp201",
    courseCode: "COMP201",
    courseCodeColor: "primary",
    faculty: "AUCA Faculty of IT • Software Engineering (Unit 3)",
    title: "Classes, Memory & Heap Allocation in Java",
    description:
      "Deep dive into reference vs primitive passing, constructor overloading, and JVM garbage collector behavior.",
    duration: "48:50 min",
    progress: 75,
    status: "in-progress",
    resumeAt: "36:12",
    instructor: {
      initials: "EM",
      name: "Emmanuel Mugabo",
      title: "AUCA Valedictorian • 4.9 ★",
      color: "primary",
    },
    assets: [
      { icon: "description", label: "24-Pg PDF Notes", color: "primary" },
      { icon: "code", label: "Code Repo (.zip)", color: "secondary" },
      { icon: "chat", label: "Q&A Thread", color: "tertiary" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMBQJFvFUKUhY-ef4d2X8sgwAedteJRz4asJxMC9sVdFQD-dqh59C2_k4440qPzgwN7VEVRhXT3sr1Qb0LoOaMpKWPaXZjXA83v_YJXlapCsTbTW9p8iNKdaruknP5UATKW8azS9ZFqr9ikufQJSABXc4s4EGiBNPuw3kESFE2t5sL99bWTQ30AUh4bMYyRzUifTKX2QIlYSJiDBZR3Dpg7bI7W34wCg0KTrIyR_Ez",
    thumbnailAlt: "University computer science classroom showing Java code on projector",
  },
  {
    id: "se304",
    courseCode: "SE304",
    courseCodeColor: "secondary",
    faculty: "AUCA Faculty of IT • Algorithms & Data Structures",
    title: "AVL Tree Rotations & Red-Black Balancing",
    description:
      "Rigorous time complexity proof for self-balancing search trees with live C++ and Java implementations.",
    duration: "54:10 min",
    progress: 100,
    status: "completed",
    instructor: {
      initials: "AU",
      name: "Aline Uwase",
      title: "AUCA CS Alumna & Graduate Fellow • 5.0 ★",
      color: "secondary",
    },
    assets: [
      { icon: "verified_user", label: "AUCA Escrow Protected", color: "secondary" },
      { icon: "download", label: "Lecture Cheatsheet", color: "primary" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQuGqcpTkx0uIwgF390EMPdtn9LcD35xMmY3RK3w_sqIuGLyqgAB_47HOcaaIMjZk-xX5EC-iE9EVQFLd1qvwJt6jK1fh6zKlaEPN3y4M7EV-KT7jif6B9ee9dPt1Yc9Bs9Nf4HgfnVb3mR_Ckp0lzUMBqQgRtqI3w6jo_l1BRNUwLTUotCNSJwLDVfBsppqvZmLRot8kv99JUB7ho2gFBMhI_nCkdH6lAQecjuOPo",
    thumbnailAlt: "Data structures whiteboard diagram with AVL rotations",
  },
  {
    id: "net201",
    courseCode: "NET201",
    courseCodeColor: "primary",
    faculty: "AUCA Faculty of Information Technology • NET201",
    title: "Network & Communication Systems: IPv4 Subnetting & CIDR",
    description:
      "Fast binary tricks, VLSM addressing, and routing table calculations for AUCA Cisco CCNA Lab (Masoro Lab 2 exam).",
    duration: "62:15 min",
    progress: 35,
    status: "in-progress",
    resumeAt: "21:40",
    instructor: {
      initials: "DK",
      name: "David Kwizera",
      title: "AUCA Faculty of IT Senior Mentor • CCNA Certified • 4.8 ★",
      color: "primary",
    },
    assets: [
      { icon: "description", label: "Subnet Worksheet", color: "primary" },
      { icon: "terminal", label: "Packet Tracer .pkt", color: "secondary" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkHrAk4zwB9GmOg2V5aJLRdcwc6Yoaw6tFd655ihy5gcL-8i9IdiHFSTSZiYypZVj38MRsODrrGuxxhCrvXPaC0yQZW-eEC82yxzHQWXtDnj4lT0kjHYMtLv4aSrVRFH7Wk4TxwJ-7n2f4A-VvGM-jr_j-1RZgIgh5EGfKeq-xcP2A6RF7uR87IwOjrkpdlW-sVS7LBJOPWXEqKGdmTBoPN6hQ3yuVnd3W0J-FoH1",
    thumbnailAlt: "Network engineering switchboard and server rack",
  },
  {
    id: "db204",
    courseCode: "DB204",
    courseCodeColor: "primary",
    faculty: "AUCA Faculty of IT • Database Systems (DB204)",
    title: "Relational Normalization: 1NF to BCNF",
    description:
      "Eliminating update anomalies and functional dependencies with real Rwandan banking use cases.",
    duration: "51:30 min",
    progress: 50,
    status: "in-progress",
    resumeAt: "25:40",
    instructor: {
      initials: "GA",
      name: "Grace Akaliza",
      title: "AUCA Database TA • 4.9 ★",
      color: "primary",
    },
    assets: [
      { icon: "description", label: "SQL Script Dump", color: "primary" },
      { icon: "schema", label: "ER Diagram", color: "secondary" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLPlhf6zIODUZh-8r3xluxO2MBAp5DY_B1ZInJimwfA3d9qndtb57K2j4DMqxT484220y3LaKPvOiKjV2SQaP9PTGithUEhHNlegJDKsW5WPRQs3ikuMCZZWiNRVqJFKhV8f-E8rFyJh9EvWTO4-GATBaOx8_NS1SwhEB5uG5QkXIhN4nmXFN7AoLXnzxMU8EvZKm0oL1phpNNLavpbgzXN65MnJGFeqVO4K5R40Ef",
    thumbnailAlt: "SQL relational database schema design diagram",
  },
  {
    id: "mat201",
    courseCode: "MAT201",
    courseCodeColor: "primary",
    faculty: "AUCA Faculty of IT • Discrete Mathematics (MAT201)",
    title: "Propositional Logic & Proof by Induction",
    description:
      "Conquering AUCA midterms: inductive base steps, inductive hypothesis, and predicate quantifiers.",
    duration: "42:20 min",
    progress: 100,
    status: "completed",
    instructor: {
      initials: "PK",
      name: "Patrick Kayiranga",
      title: "AUCA Masoro Pure Math Lead • 4.9 ★",
      color: "primary",
    },
    assets: [
      { icon: "verified_user", label: "AUCA Escrow Protected", color: "secondary" },
      { icon: "quiz", label: "Exam Problem Bank" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzT9-AQnN1HDVQLJujk7PoaoHgjqILTffWqSRaTNiU_hF0Q2g2C1zefkr5vc_jS-Sn5AUqoeRn3wJkCJOUJMLPEY31CdD543xLfTK8EnrHNBGm3j6K3vXzkUMNwCVimU6X7cY_a47CHlH8_X1M-l80e9paKr4KRcjpyv2j6Pmpz0ik4D4xoC-HYF5gja1yYuFLdg0LredLTuLHbQ5QXDAPCGLZ1bkTVyG_XzqmhNTi",
    thumbnailAlt: "Discrete mathematics logic gates and boolean algebra",
  },
  {
    id: "cs310",
    courseCode: "CS310",
    courseCodeColor: "primary",
    faculty: "AUCA Faculty of IT • Systems Programming (CS310)",
    title: "OS Processes, Threads & Deadlock Prevention",
    description:
      "Semaphores, mutex locks, and the Banker's Algorithm explained step-by-step with practical scenarios.",
    duration: "60:45 min",
    progress: 20,
    status: "in-progress",
    resumeAt: "12:15",
    instructor: {
      initials: "EM",
      name: "Emmanuel Mugabo",
      title: "AUCA Honors Peer Tutor • 4.9 ★",
      color: "primary",
    },
    assets: [
      { icon: "description", label: "C Threads Lab", color: "primary" },
      { icon: "code", label: "Semaphore Demos", color: "secondary" },
    ],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCwcJnAkXCwJsLrLA40eiaZAwd5LPPxN7MnxFK8wOO0ZgK_JTLVTxhBkCxORZ35dTBckRA2oHd-GW827fJXkIGJD9MJQLycuAjB1DUB1DelQCsjwApKOzkAMvAMtNhdgdNi6EGBvwQ0mPX47MqlVFpqJ0isTOIafcUf04XRNqw8qsoAbEuHwNgfbvBxagRU7rbBpslilCUePyeVTpkynnlbjGpTrLtIwlzlIXUNnA1",
    thumbnailAlt: "Operating system kernel architecture on dark terminal",
  },
];

// ─── Sessions Data ─────────────────────────────────────────────────────────

export const sessions: SessionCard[] = [
  {
    id: "sess-a",
    courseCode: "COMP201",
    type: "campus",
    subject: "Object-Oriented Programming: Polymorphism & Abstraction",
    mentorName: "Emmanuel Mugabo",
    mentorImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC92dD2UlGJ6y0wKlOIvq-KjNgSj46FmKknRzQH-1K_zMjZu1qRHtTwhNtgzTnJ17f3lYA38n3Slpg0O0cByqncauEYgVh30jrJwn7lglIVlSYSmkbXCy3RuopyhaokaCh92mvryDYEAy7o6DnFHWeO4tx5S0p4uKRJuXpBr-C0Oo9ZH2CEoriH_APclQnfLkNrcN0UPbMfZuKEFjDHezW16ySHESGz_l5G0eBTrQbo",
    mentorImgAlt: "Smiling young Rwandan university male tutor",
    rating: "4.9",
    sessionCount: 42,
    price: 3000,
    date: "Tomorrow, Friday Oct 25",
    time: "02:00 PM – 02:45 PM (45 min)",
    locationTitle: "AUCA Masoro Campus",
    locationDetail: "Central Library • Study Room 3B (2nd Floor)",
    accentColor: "primary",
    badge: "Starts in 18 hrs",
    badgeColor: "error",
    whatsapp: "250788123456",
    tutorPayout: 2400,
  },
  {
    id: "sess-b",
    courseCode: "SE304",
    type: "online",
    subject: "AVL Tree Balancing & Complexity Proofs",
    mentorName: "Aline Uwase",
    mentorImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA148crFyUC_45Gkr_SZu6jachfQF1rEXJkSEA7Rb6RaGIDa94lxoJzuTMhvgEhGT8fRb77YMjWjL8SURHzPvflnJ8rbrYIvBGTzGeF5O_yy5PkfL6dh2VqIwo6LoOXkF_BUgS2zWPbKZxIphdyUwijBSptHx0lewrxyVrdl01bGVfD_hNScg31JkRikAmtxkZ4KjyP8r0WmbAvVVe-9ea5b1eVCyJV7aIW5bGY1teZ",
    mentorImgAlt: "Intelligent female Rwandan peer tutor with glasses",
    rating: "5.0",
    sessionCount: 68,
    price: 2000,
    date: "Saturday, Oct 26",
    time: "04:30 PM – 05:15 PM (45 min)",
    locationTitle: "meet.amanota.rw/se304-aline",
    locationDetail: "HD Screen Share & Digital Whiteboard Ready",
    accentColor: "secondary",
    badge: "Saturday Oct 26",
    badgeColor: "secondary",
    meetLink: "https://meet.amanota.rw/se304-aline",
    fellow: "CMU Africa Fellow",
    tutorPayout: 1600,
  },
  {
    id: "sess-c",
    courseCode: "MAT201",
    type: "cafe",
    subject: "Propositional Logic & Inductive Proof Review",
    mentorName: "Patrick Kayiranga",
    mentorImg: "",
    mentorImgAlt: "AUCA peer tutor Patrick",
    rating: "4.9",
    sessionCount: 31,
    price: 3000,
    date: "Sunday, Oct 27",
    time: "10:00 AM – 10:45 AM (45 min)",
    locationTitle: "Nearby Café (Masoro Area)",
    locationDetail: "To be confirmed via WhatsApp",
    accentColor: "primary",
    tutorPayout: 2400,
  },
];
