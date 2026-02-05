import { Layout } from '../components/Layout';
import { JobService, JOB_STATUS } from '../services/jobs';
import { AuthService } from '../services/auth';
import { JobCard } from '../components/JobCard';
import { JobForm } from '../components/JobForm';

export async function Board() {
    const user = AuthService.getUser();
    if (!user) return document.createElement('div');

    let jobs = await JobService.getAll(user.id);

    const container = document.createElement('div');
    const cols = Object.values(JOB_STATUS); // Columns

    const render = () => {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Kanban Board</h1>
                <button id="add-job-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    Add Card
                </button>
            </div>
            
            <div class="flex overflow-x-auto pb-8 gap-6 snap-x">
                ${cols.map(status => `
                    <div class="min-w-[300px] w-80 flex-shrink-0 flex flex-col bg-gray-100/50 rounded-xl" data-status="${status}">
                        <div class="p-3 font-semibold text-gray-500 uppercase text-xs tracking-wider flex justify-between items-center">
                            ${status}
                            <span class="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-[10px] count-badge">${jobs.filter(j => j.status === status).length}</span>
                        </div>
                        <div class="flex-1 p-2 space-y-3 min-h-[150px] transition-colors rounded-xl" id="col-${status}">
                            <!-- Cards go here via JS to preserve events -->
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Inject Cards
        cols.forEach(status => {
            const col = container.querySelector(`#col-${status}`);
            const statusJobs = jobs.filter(j => j.status === status);

            // Drop Zone Events
            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                col.classList.add('bg-indigo-50/50', 'ring-2', 'ring-indigo-200');
            });
            col.addEventListener('dragleave', () => {
                col.classList.remove('bg-indigo-50/50', 'ring-2', 'ring-indigo-200');
            });
            col.addEventListener('drop', async (e) => {
                e.preventDefault();
                col.classList.remove('bg-indigo-50/50', 'ring-2', 'ring-indigo-200');
                const jobId = e.dataTransfer.getData('text/plain');
                if (jobId) {
                    await JobService.update(jobId, { status });
                    jobs = await JobService.getAll(user.id);
                    render(); // Re-render whole board (simple but effective for portfolio)
                }
            });

            statusJobs.forEach(job => {
                const card = JobCard(job);
                card.draggable = true;

                card.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', job.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setTimeout(() => card.classList.add('opacity-50'), 0);
                });

                card.addEventListener('dragend', () => {
                    card.classList.remove('opacity-50');
                });

                card.addEventListener('click', () => {
                    window.location.hash = `/applications/${job.id}`;
                });

                col.appendChild(card);
            });
        });

        // Add Button
        container.querySelector('#add-job-btn').addEventListener('click', () => {
            const modal = JobForm({
                onSubmit: async (data) => {
                    await JobService.create(data, user.id);
                    jobs = await JobService.getAll(user.id);
                    render();
                }
            });
            document.body.appendChild(modal);
        });
    };

    render();
    return Layout(container);
}
