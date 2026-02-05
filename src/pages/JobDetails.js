import { Layout } from '../components/Layout';
import { JobService } from '../services/jobs';
import { AuthService } from '../services/auth';
import { JobForm } from '../components/JobForm';

export async function JobDetails(params) {
    const user = AuthService.getUser();
    if (!user) return document.createElement('div');

    const job = await JobService.get(params.id);

    if (!job) {
        const err = document.createElement('div');
        err.innerHTML = '<p class="p-4 text-red-500">Job not found</p>';
        return Layout(err);
    }

    const StatusBadge = (status) => {
        let colorClass = '';
        switch (status) {
            case 'Applied':
                colorClass = 'bg-blue-100 text-blue-800';
                break;
            case 'Interviewing':
                colorClass = 'bg-purple-100 text-purple-800';
                break;
            case 'Offer':
                colorClass = 'bg-green-100 text-green-800';
                break;
            case 'Rejected':
                colorClass = 'bg-red-100 text-red-800';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800';
        }
        return `<span class="px-3 py-1 rounded-full text-sm font-semibold ${colorClass}">${status}</span>`;
    };

    const container = document.createElement('div');

    const render = async () => {
        // Fetch fresh data if needed
        const currentJob = await JobService.get(params.id);
        const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=random&color=fff&size=128`;

        container.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-6">
                <!-- Header Card -->
                <div class="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div class="flex items-center gap-6 z-10">
                        <img src="${logoUrl}" alt="${currentJob.company}" class="w-20 h-20 rounded-2xl shadow-lg ring-4 ring-white/50">
                        <div>
                            <h1 class="text-3xl font-black text-gray-900 tracking-tight">${currentJob.role}</h1>
                            <div class="flex items-center gap-3 mt-2 text-gray-600 font-medium">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    ${currentJob.company}
                                </span>
                                <span>•</span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    ${currentJob.location || 'Remote'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 z-10">
                         ${StatusBadge(currentJob.status)}
                         <button id="edit-job-btn" class="p-2 bg-white/50 hover:bg-white rounded-lg text-indigo-600 transition-all shadow-sm">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                         </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Main details -->
                    <div class="md:col-span-2 space-y-6">
                        <div class="glass-panel p-6 rounded-2xl">
                            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Job Details</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p class="text-xs text-gray-500 mb-1">Salary Range</p>
                                    <p class="font-semibold text-gray-900 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ${currentJob.salary || 'Not specified'}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 mb-1">Date Applied</p>
                                    <p class="font-semibold text-gray-900 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        ${new Date(currentJob.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div class="md:col-span-2">
                                    <p class="text-xs text-gray-500 mb-1">Job Link</p>
                                    ${currentJob.link ?
                `<a href="${currentJob.link}" target="_blank" class="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium group">
                                            ${currentJob.link} 
                                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>`
                : '<span class="text-gray-400">No link provided</span>'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Notes Column -->
                    <div class="md:col-span-1">
                        <div class="glass-panel p-6 rounded-2xl h-full flex flex-col shadow-lg border-t-4 border-indigo-400">
                            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Private Notes
                            </h3>
                            <div class="flex-1 overflow-y-auto max-h-[400px] space-y-3 mb-4 pr-1 scrollbar-thin" id="notes-list">
                                ${(currentJob.notes || []).length === 0 ?
                '<div class="text-center py-8 text-gray-400"><p>No notes yet.</p><p class="text-xs mt-1">Keep track of interview details here.</p></div>'
                : ''}
                                ${(currentJob.notes || []).sort((a, b) => new Date(b.date) - new Date(a.date)).map(note => `
                                    <div class="bg-white/60 p-3 rounded-xl shadow-sm border border-white/50 backdrop-blur-sm">
                                        <p class="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">${note.content}</p>
                                        <p class="text-[10px] text-indigo-400/80 mt-2 font-medium text-right">${new Date(note.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                `).join('')}
                            </div>
                            <form id="note-form" class="mt-auto pt-4 border-t border-gray-100">
                                <textarea name="content" required placeholder="Type a note..." class="w-full text-sm bg-white/50 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all shadow-inner p-3 mb-2 resize-none" rows="3"></textarea>
                                <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2 px-4 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all text-sm">Add Note</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#note-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const textarea = e.target.querySelector('textarea');
            const content = textarea.value.trim();
            if (!content) return;

            const note = {
                id: Date.now(),
                content,
                date: new Date()
            };

            const updatedJob = await JobService.get(params.id);
            const notes = updatedJob.notes || [];
            notes.push(note);

            await JobService.update(params.id, { notes });
            render();
        });

        container.querySelector('#edit-job-btn').addEventListener('click', () => {
            const modal = JobForm({
                initialData: currentJob,
                onSubmit: async (data) => {
                    await JobService.update(currentJob.id, data);
                    render();
                }
            });
            document.body.appendChild(modal);
        });
    };

    await render();
    return Layout(container);
}
