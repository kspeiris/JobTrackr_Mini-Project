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
  container.className = "flex h-screen overflow-hidden bg-gray-900"; // Ensure background is dark matching the theme

  container.innerHTML = `
      <!-- Mobile Header -->
      <header class="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:hidden z-40">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span class="text-lg font-bold text-white tracking-tight">JobTrackr</span>
        </div>
        <button id="mobile-menu-btn" class="p-2 text-gray-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      <!-- Sidebar -->
      <aside id="sidebar" class="fixed inset-y-0 left-0 w-72 bg-[#1a1b26]/95 backdrop-blur-xl border-r border-white/10 text-white transform -translate-x-full md:translate-x-0 transition-transform duration-300 z-50 flex flex-col shadow-2xl md:relative h-full nav-sidebar">
        <div class="p-6 flex items-center justify-between border-b border-white/10 bg-white/5">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span class="text-xl font-bold text-white tracking-tight text-shadow-sm">JobTrackr</span>
            </div>
            <button id="close-sidebar-btn" class="md:hidden text-gray-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 py-6 overflow-y-auto">
          <a href="#/" class="nav-link flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/')}">
            <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span class="font-medium tracking-wide">Dashboard</span>
            ${isActive('/') ? '<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
          </a>
          <a href="#/applications" class="nav-link flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/applications')}">
            <svg class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <span class="font-medium tracking-wide">Applications</span>
            ${isActive('/applications') ? '<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></div>' : ''}
          </a>
          <a href="#/board" class="nav-link flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/board')}">
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

      <!-- Overlay for mobile when sidebar is open -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden md:hidden transition-opacity opacity-0"></div>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent pt-16 md:pt-0" id="main-content">
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

  // Sidebar Toggle Logic
  const mobileMenuBtn = container.querySelector('#mobile-menu-btn');
  const sidebar = container.querySelector('#sidebar');
  const overlay = container.querySelector('#sidebar-overlay');
  const closeSidebarBtn = container.querySelector('#close-sidebar-btn');
  const navLinks = container.querySelectorAll('.nav-link');

  const toggleSidebar = () => {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
      // small timeout to allow display:block to apply before opacity transition
      setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.classList.add('hidden'), 300);
    }
  };

  mobileMenuBtn?.addEventListener('click', toggleSidebar);
  closeSidebarBtn?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', toggleSidebar);

  // Close sidebar on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    });
  });

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
