// Public website content. Update this file, then run `node scripts/build.mjs`.
export const profile = {
  name: "Byeong Gwon Lee",
  role: "3D Computer Vision Researcher",
  fields: "3D Reconstruction · Gaussian Splatting · SLAM · Multi-View Stereo",
  email: "lee971009@naver.com",
  links: [
    ["CV (PDF)", "cv/cv.pdf"],
    [
      "Google Scholar",
      "https://scholar.google.co.kr/citations?user=VLyJXToAAAAJ&hl=en",
    ],
    ["GitHub", "https://github.com/lbg030"],
    ["LinkedIn", "https://www.linkedin.com/in/byeonggwon-lee-3a2b5133b/"],
  ],
};
export const experience = [
  { organization: "KETI", role: "Researcher", date: "Sep. 2026 – Present" },
  {
    organization: "StradVision",
    role: "Researcher",
    date: "Jul. 2026 – Jul. 2026",
  },
  {
    organization: "MotifDrive",
    role: "Researcher",
    date: "May 2026 – Jul. 2026",
  },
  {
    organization: "RTM AI Image",
    role: "2D Computer Vision Researcher",
    date: "Sep. 2022 – Feb. 2024",
    description:
      "Manufacturing defect detection, image segmentation, model optimization, and few-shot auto labeling. Progressed from research intern to data scientist.",
  },
];
export const education = [
  {
    organization: "Dongguk University",
    degree: "M.S. in Computer Science and Artificial Intelligence",
    date: "Mar. 2024 – Feb. 2026",
    description: "Advisor: Prof. Soohwan Song",
    thesis:
      "Thesis: Online 3D Gaussian Splatting Modeling with Novel View Selection",
  },
  {
    organization: "Hanyang University ERICA",
    degree: "B.S. in Software Engineering",
    date: "Mar. 2020 – Feb. 2023",
  },
];
export const publications = [
  {
    id: "ijcai",
    title: "Online 3D Gaussian Splatting Modeling with Novel View Selection",
    venue: "IJCAI 2025",
    year: "2025",
    status: "Published",
    role: "First Author",
    authors: "Byeonggwon Lee, Junkyu Park, Khang Truong Giang, Soohwan Song",
    image: "ijcai-thumbnail.png",
    summary:
      "Selecting informative views to improve the completeness of online 3D Gaussian Splatting models.",
    links: [
      ["Paper", "https://arxiv.org/abs/2508.14014"],
      ["Poster", "poster/IJCAI2025_Poster_v2.pdf"],
      [
        "Presentation",
        "https://github.com/lbg030/lbg030.github.io/releases/download/Final/Montreal_Presentation_V4.pptx",
      ],
      ["Demo video", "demo.html?v=ijcai"],
    ],
  },
  {
    id: "mvs-gs",
    title:
      "MVS-GS: High-Quality 3D Gaussian Splatting Mapping via Online Multi-View Stereo",
    venue: "IEEE Access",
    year: "2025",
    status: "Published",
    role: "First Author",
    authors:
      "Byeonggwon Lee, Junkyu Park, Khang Truong Giang, Sungho Jo, Soohwan Song",
    image: "mvs-gs-thumbnail.png",
    summary:
      "Bringing dense multi-view geometry into online Gaussian Splatting for high-quality 3D mapping.",
    links: [
      [
        "Paper",
        "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11050405",
      ],
      ["Demo video", "demo.html?v=mvsgs"],
    ],
  },
  {
    id: "stereo-gs",
    title:
      "Stereo-GS: Online 3D Gaussian Splatting Mapping Using Stereo Depth Estimation",
    venue: "MDPI Electronics",
    year: "2025",
    status: "Published",
    role: "Co-first Author",
    authors: "Junkyu Park, Byeonggwon Lee, Sanggi Lee, Soohwan Song",
    image: "stereo-gs-thumbnail.png",
    summary:
      "Integrating stereo depth estimation into online Gaussian Splatting mapping.",
    links: [["Paper", "https://www.mdpi.com/2079-9292/14/22/4436"]],
  },
  {
    id: "m2depth",
    title:
      "M2Depth: Unifying Monocular Depth Foundation Priors with Multi-View Stereo",
    venue: "IEEE Transactions on Multimedia (TMM)",
    year: "2026",
    status: "Under Review",
    role: "First Author",
    authors:
      "Byeonggwon Lee, Sanggi Lee, Siwoo Lee, Khang Truong Giang, Soohwan Song",
    summary:
      "Bidirectional refinement between monocular depth foundation priors and multi-view stereo, combining learned structure with multi-view geometry.",
    links: [["arXiv", "https://arxiv.org/pdf/2608.20788"]],
  },
  {
    id: "m2slam",
    title:
      "M2SLAM: Coupling Multi-View Stereo with Monocular SLAM for Precise 3D Reconstruction",
    venue: "IEEE Transactions on Robotics (T-RO)",
    year: "2026",
    status: "Under Review",
    role: "First Author",
    summary:
      "Coupling monocular SLAM and multi-view stereo for dense 3D reconstruction and 3D Gaussian Splatting.",
    links: [],
  },
];
export const projects = [
  {
    id: "drone",
    title: "From drone imagery to a 3D map.",
    fullTitle: "Online/Offline Real-Time 3D Reconstruction Using Drone Imagery",
    organization: "Mobility One Inc.",
    date: "Oct. 2024 – Apr. 2025",
    image: "project1_thumbnail.png",
    alt: "Drone imagery and reconstructed scene from the online and offline mapping project",
    tags: "SLAM / Multi-View Stereo / Gaussian Splatting",
    problem:
      "Reconstruct aerial scenes while balancing online processing and offline geometric quality.",
    approach:
      "Combine SLAM camera tracking with multi-view stereo in an online/offline reconstruction pipeline.",
    contribution:
      "Adaptive keyframe selection, hierarchical bundle adjustment, and loop closure for pose drift correction.",
    result:
      "Completed delivery to Mobility One and secured a follow-up project.",
    links: [
      ["Related research", "publications.html#mvs-gs"],
      ["Demo video", "demo.html?v=mvsgs"],
    ],
  },
  {
    id: "diffusion",
    title: "Reconstructing what the camera missed.",
    fullTitle: "3D Reconstruction with Diffusion-based Inpainting",
    organization: "Mobility One Inc.",
    date: "Jun. 2025 – Dec. 2025",
    image: "project2_thumbnail.png",
    alt: "Diffusion-assisted completion pipeline for drone-based 3D reconstruction",
    tags: "COLMAP / OpenMVS / Diffusion",
    problem:
      "Sparse drone viewpoints leave incomplete regions in reconstructed 3D models.",
    approach:
      "Use COLMAP and OpenMVS with diffusion-based image interpolation and inpainting.",
    contribution:
      "A geometric constraint filter checks generated imagery for consistency before reconstruction.",
    result:
      "Reconstructed missing mesh regions without additional image capture.",
    links: [],
  },
];
export const industryProjects = [
  [
    "Daeduck Electronics",
    "Mar. 2023 – Apr. 2023",
    "Multi-focus (top/bottom) image defect detection proof of concept.",
  ],
  [
    "AI Voucher Project",
    "May 2023 – Dec. 2023",
    "Defect object detection model and equipment integration through a C++ SDK.",
  ],
  [
    "Daeduck Electronics",
    "Apr. 2023 – Jun. 2023",
    "Multi-angle image defect detection proof of concept.",
  ],
  [
    "Seobaujeok",
    "Mar. 2023 – Dec. 2023",
    "High-resolution cosmetic container defect inspection.",
  ],
];
