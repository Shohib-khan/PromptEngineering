const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");
const progressBar = document.getElementById("progressBar");
const filters = document.querySelectorAll(".filter");
const phases = document.querySelectorAll(".phase");
const revealItems = document.querySelectorAll(".reveal");
const completeButtons = document.querySelectorAll(".complete-btn");
const completedCount = document.getElementById("completedCount");
const trackerFill = document.getElementById("trackerFill");
const storageKey = "gen-ai-roadmap-completed";

const completedPhases = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

function setSidebar(open) {
  sidebar.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => setSidebar(true));
closeSidebar.addEventListener("click", () => setSidebar(false));
overlay.addEventListener("click", () => setSidebar(false));

document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => setSidebar(false));
});

function renderCompletion() {
  phases.forEach((phase) => {
    phase.classList.toggle("completed", completedPhases.has(phase.id));
  });

  completeButtons.forEach((button) => {
    const isDone = completedPhases.has(button.dataset.phase);
    button.classList.toggle("done", isDone);
    button.textContent = isDone ? "Completed" : "Mark complete";
  });

  const total = phases.length;
  const done = completedPhases.size;
  completedCount.textContent = `${done} of ${total} phases complete`;
  trackerFill.style.transform = `scaleX(${total ? done / total : 0})`;
  localStorage.setItem(storageKey, JSON.stringify([...completedPhases]));
}

completeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const phaseId = button.dataset.phase;
    if (completedPhases.has(phaseId)) {
      completedPhases.delete(phaseId);
    } else {
      completedPhases.add(phaseId);
    }
    renderCompletion();
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    phases.forEach((phase) => {
      const shouldShow = filter === "all" || phase.dataset.track === filter;
      phase.classList.toggle("hide", !shouldShow);
    });
  });
});

document.querySelectorAll(".expand-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const deliverable = button.nextElementSibling;
    const isOpen = deliverable.classList.toggle("open");
    button.textContent = isOpen ? "Hide deliverable" : "View deliverable";
  });
});

document.querySelectorAll(".accordion-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const wasOpen = panel.classList.contains("open");

    document.querySelectorAll(".accordion-panel").forEach((item) => {
      item.classList.remove("open");
    });

    if (!wasOpen) {
      panel.classList.add("open");
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));
renderCompletion();

const typeTarget = document.querySelector(".hero h1");
const fullText = typeTarget.textContent;
typeTarget.textContent = "";

let index = 0;
const typeTimer = setInterval(() => {
  typeTarget.textContent += fullText[index];
  index += 1;
  if (index >= fullText.length) {
    clearInterval(typeTimer);
  }
}, 18);
