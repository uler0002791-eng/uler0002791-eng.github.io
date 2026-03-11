const GITHUB_USER = 'uler0002791-eng';

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Mobile menu ── */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── Scroll reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Language dot color ── */
function langClass(lang) {
  const map = {
    JavaScript: 'lc-JavaScript',
    TypeScript:  'lc-TypeScript',
    Python:      'lc-Python',
    HTML:        'lc-HTML',
    CSS:         'lc-CSS',
    Java:        'lc-Java',
    Rust:        'lc-Rust',
    Go:          'lc-Go',
  };
  return map[lang] || 'lc-default';
}

/* ── GitHub Projects ── */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res   = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    const repos = await res.json();

    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    if (!filtered.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem;">暂无公开项目</p>';
      return;
    }

    grid.innerHTML = filtered.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card reveal">
        <div class="project-name">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/>
          </svg>
          ${repo.name}
        </div>
        <p class="project-desc">${repo.description || '暂无描述'}</p>
        <div class="project-meta">
          ${repo.language ? `
            <span class="lang-row">
              <span class="lang-dot ${langClass(repo.language)}"></span>
              ${repo.language}
            </span>` : ''}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      </a>
    `).join('');

    document.querySelectorAll('.project-card.reveal').forEach(el => observer.observe(el));

  } catch {
    grid.innerHTML = '<p style="color:var(--text-muted);padding:2rem;grid-column:1/-1;">项目加载失败，请刷新页面重试</p>';
  }
}

loadProjects();
