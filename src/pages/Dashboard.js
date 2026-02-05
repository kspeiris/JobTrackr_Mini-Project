import { Layout } from '../components/Layout';
import { JobService } from '../services/jobs';
import { AuthService } from '../services/auth';

export async function Dashboard() {
    const user = AuthService.getUser();
    const jobs = await JobService.getAll(user.id);

    // Simple stats
    const total = jobs.length;
    const active = jobs.filter(j => ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'].includes(j.status)).length;
    const interviews = jobs.filter(j => j.status === 'INTERVIEW').length;

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="mb-8">
            <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back, ${user.username}!</h1>
            <p class="text-indigo-200">Here's what's happening with your applications today.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 class="text-indigo-900/60 text-xs font-bold uppercase tracking-wider mb-2">Total Applications</h3>
                <p class="text-4xl font-black text-indigo-900">${total}</p>
                <div class="mt-4 flex items-center text-sm text-indigo-600/80">
                   <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   Tracking active
                </div>
            </div>
            
            <div class="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div class="absolute right-0 top-0 w-32 h-32 bg-green-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 class="text-green-900/60 text-xs font-bold uppercase tracking-wider mb-2">Active Processes</h3>
                <p class="text-4xl font-black text-gray-900">${active}</p>
                 <div class="mt-4 flex items-center text-sm text-green-700/80">
                   <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   In progress
                </div>
            </div>
            
            <div class="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                 <div class="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                <h3 class="text-purple-900/60 text-xs font-bold uppercase tracking-wider mb-2">Interviews</h3>
                <p class="text-4xl font-black text-purple-900">${interviews}</p>
                 <div class="mt-4 flex items-center text-sm text-purple-700/80">
                   <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   Coming up
                </div>
            </div>
        </div>

        <div class="glass-panel rounded-2xl p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recent Activity
            </h2>
            
            ${jobs.length === 0 ? '<p class="text-gray-500 italic">No activity yet. Start by adding an application!</p>' : ''}
            
            <div class="space-y-3">
                ${jobs.slice(0, 5).map(job => {
        const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=64`;
        return `
                    <div class="group flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer" onclick="window.location.hash='/applications/${job.id}'">
                        <div class="flex items-center gap-4">
                            <img src="${logoUrl}" alt="${job.company}" class="w-10 h-10 rounded-lg shadow-sm">
                            <div>
                                <h4 class="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">${job.company}</h4>
                                <p class="text-sm text-gray-500">${job.role}</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/60 text-gray-600 border border-gray-200 backdrop-blur-sm">${job.status}</span>
                    </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;

    return Layout(container);
}
