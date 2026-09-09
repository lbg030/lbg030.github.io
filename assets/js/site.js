const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav-links");
toggle.hidden = false;
const closeMenu = () => {
  toggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
};
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".navigation")) closeMenu();
});
matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

const viewport = document.querySelector("#scene-viewport");
if (viewport) {
  const observer = new IntersectionObserver(
    async (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      try {
        const { initReconstruction } = await import("./reconstruction.js");
        await initReconstruction(viewport);
      } catch {
        viewport.dataset.state = "fallback";
      }
    },
    { rootMargin: "120px" },
  );
  observer.observe(viewport);
}

const video = document.querySelector("#demo-video");
if (video) {
  const demos = {
    mvsgs: ["MVS-GS", "assets/demo_video/demo_video_mvsgs.mp4"],
    ijcai: [
      "IJCAI 2025 — Online 3D Gaussian Splatting",
      "assets/demo_video/demo_video_ijcai.mp4",
    ],
  };
  const key = new URLSearchParams(location.search).get("v");
  const demo = Object.hasOwn(demos, key) ? demos[key] : null;
  if (demo) {
    document.querySelector("#demo-title").textContent = demo[0];
    document.querySelector("#demo-message").textContent =
      "Use the video controls to play, pause, or view full screen.";
    document.title = `${demo[0]} — Byeong Gwon Lee`;
    video.src = demo[1];
    video.hidden = false;
    video.setAttribute("aria-label", demo[0]);
    video.setAttribute("aria-describedby", `overview-${key}`);
  } else if (key) {
    document.querySelector("#demo-title").textContent = "Demo not found";
    document.querySelector("#demo-message").textContent =
      "Choose one of the available research demos below.";
  }
}
