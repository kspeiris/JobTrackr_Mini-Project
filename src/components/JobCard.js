import { StatusBadge } from './StatusBadge';

export function JobCard(job) {
    const card = document.createElement('div');
    card.className = "glass-panel p-4 rounded-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden";
    card.draggable = true;
    card.dataset.id = job.id;

    const daysAgo = Math.floor((new Date() - new Date(job.updatedAt)) / (1000 * 60 * 60 * 24));

    card.innerHTML = `
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
    
        <div class="relative z-10 flex justify-between items-start mb-3">
             <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner border border-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                ${job.company[0].toUpperCase()}
             </div>
             ${StatusBadge(job.status)}
        </div>
        
        <div class="relative z-10">
            <h3 class="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">${job.role}</h3>
            <p class="text-sm text-gray-500 font-medium mb-4 line-clamp-1">${job.company}</p>
            
            <div class="flex items-center justify-between pt-3 border-t border-gray-100/50 mt-3">
                <p class="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ${daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                </p>
                ${job.link ? `
                    <a href="${job.link}" target="_blank" class="p-1.5 rounded-full text-indigo-400 hover:text-white hover:bg-indigo-500 transition-all opacity-0 group-hover:opacity-100" onclick="event.stopPropagation()">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}
