import { AuthService } from '../services/auth';
import { Router } from '../router';

export function Layout(content) {
  const user = AuthService.getUser();
  const path = window.location.hash.slice(1) || '/';

  // If public page (no user), just return content if it's an element, or wrap string
  if (!user) {
    if (typeof content === 'string') {
      const div = document.createElement('div');
      div.innerHTML = content;
      return div;
    }
    return content;
  }

  const isActive = (p) => path === p || (p !== '/' && path.startsWith(p))
    ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white ring-1 ring-white/20'
    : 'text-indigo-100/70 hover:bg-white/10 hover:text-white';

  const container = document.createElement('div');
  container.className = "flex h-screen overflow-hidden"; // bg handled by body

  container.innerHTML = `
      <!-- Sidebar -->
      <aside class="w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 text-white hidden md:flex flex-col transition-all duration-300 relative z-20 shadow-2xl">
        <div class="p-6 flex items-center gap-3 border-b border-white/10 bg-white/5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span class="text-xl font-bold text-white tracking-tight text-shadow-sm">JobTrackr</span>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 py-6 overflow-y-auto">
          <a href="#/" class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/')}">
            <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span class="font-medium tracking-wide">Dashboard</span>
            ${isActive('/') ? '<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
          </a>
          <a href="#/applications" class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/applications')}">
            <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <span class="font-medium tracking-wide">Applications</span>
            ${isActive('/applications') ? '<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
          </a>
          <a href="#/board" class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/board')}">
             <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
             <span class="font-medium tracking-wide">Kanban Board</span>
             ${isActive('/board') ? '<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
          </a>
        </nav>
        
        <div class="p-6 border-t border-white/10">
          <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
             <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-sm font-bold border-2 border-white/20">
                ${user.username[0].toUpperCase()}
             </div>
             <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate text-white">${user.username}</p>
                <button id="layout-logout-btn" class="text-xs text-indigo-300 hover:text-white transition-colors flex items-center gap-1 mt-0.5">
                   Log out
                   <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
             </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent" id="main-content">
        <div class="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        </div>
      </main>
  `;

  // Inject content
  const main = container.querySelector('#main-content > div');
  if (typeof content === 'string') {
    main.innerHTML = content;
  } else if (content instanceof Node) {
    main.appendChild(content);
  }

  // Bind logout
  const logoutBtn = container.querySelector('#layout-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AuthService.logout();
      window.location.hash = '/login';
    });
  }

  return container;
}
