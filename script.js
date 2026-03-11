const GITHUB_USER = 'uler0002791-eng';

/* ── Mobile menu ── */
const menuBtn  = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
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

/* ── Q-block easter egg ── */
document.querySelectorAll('.q-block').forEach(block => {
  block.addEventListener('click', () => {
    block.textContent = '★';
    block.style.background = '#ff4020';
    block.style.boxShadow = 'inset -5px -5px 0 #8b1000, inset 5px 5px 0 #ff8060';
    setTimeout(() => {
      block.textContent = '?';
      block.style.background = '';
      block.style.boxShadow = '';
    }, 700);
  });
});

/* ── Language color ── */
function langClass(lang) {
  const map = {
    JavaScript: 'lc-JavaScript', TypeScript: 'lc-TypeScript',
    Python: 'lc-Python', HTML: 'lc-HTML', CSS: 'lc-CSS',
    Java: 'lc-Java', Rust: 'lc-Rust', Go: 'lc-Go',
  };
  return map[lang] || 'lc-default';
}

/* ── GitHub Projects ── */
async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res   = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    const repos = await res.json();
    const list  = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    if (!list.length) {
      grid.innerHTML = '<p class="px-loading">NO ITEMS FOUND</p>';
      return;
    }

    grid.innerHTML = list.map(r => `
      <a href="${r.html_url}" target="_blank" rel="noopener" class="project-card reveal">
        <div class="proj-top">▶ REPO</div>
        <div class="proj-body">
          <div class="proj-name">${r.name}</div>
          <p class="proj-desc">${r.description || '暂无描述'}</p>
          <div class="proj-meta">
            ${r.language ? `<span class="lang-row"><span class="lang-dot ${langClass(r.language)}"></span>${r.language}</span>` : ''}
            <span>★ ${r.stargazers_count}</span>
            <span>⑂ ${r.forks_count}</span>
          </div>
        </div>
      </a>
    `).join('');

    document.querySelectorAll('.project-card.reveal').forEach(el => observer.observe(el));
  } catch {
    grid.innerHTML = '<p class="px-loading blink">ERROR: FAILED TO LOAD</p>';
  }
}

loadProjects();
