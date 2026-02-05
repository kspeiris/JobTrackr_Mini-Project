import { JOB_STATUS } from '../services/jobs';

export function JobForm({ onSubmit, onCancel, initialData = {} }) {
  const container = document.createElement('div');
  container.className = "fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 opacity-0 transition-opacity duration-300";
  setTimeout(() => container.classList.remove('opacity-0'), 10);

  const isEdit = !!initialData.id;

  container.innerHTML = `
    <div class="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300" id="modal-panel">
      <div class="px-8 py-6 border-b border-gray-200/50 flex justify-between items-center bg-white/50">
        <h3 class="text-xl font-bold text-gray-900">${isEdit ? 'Edit Application' : 'New Application'}</h3>
        <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100" id="close-btn">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form id="job-form" class="p-8 space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Company</label>
          <input type="text" name="company" required value="${initialData.company || ''}" class="glass-input w-full rounded-xl px-4 py-2.5">
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Role</label>
          <input type="text" name="role" required value="${initialData.role || ''}" class="glass-input w-full rounded-xl px-4 py-2.5">
        </div>

        <div class="grid grid-cols-2 gap-5">
           <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" class="glass-input w-full rounded-xl px-4 py-2.5">
                 ${Object.values(JOB_STATUS).map(s => `
                    <option value="${s}" ${initialData.status === s ? 'selected' : ''}>${s}</option>
                 `).join('')}
              </select>
           </div>
           <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value="${initialData.location || ''}" class="glass-input w-full rounded-xl px-4 py-2.5">
           </div>
        </div>
        
        <div class="grid grid-cols-2 gap-5">
             <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
              <input type="text" name="salary" value="${initialData.salary || ''}" class="glass-input w-full rounded-xl px-4 py-2.5">
             </div>
             <div>
               <label class="block text-sm font-semibold text-gray-700 mb-1">Link</label>
               <input type="url" name="link" value="${initialData.link || ''}" class="glass-input w-full rounded-xl px-4 py-2.5">
             </div>
        </div>

        <div class="flex justify-end pt-6 space-x-3 border-t border-gray-100">
          <button type="button" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors" id="cancel-btn">
            Cancel
          </button>
          <button type="submit" class="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5">
            Save Application
          </button>
        </div>
      </form>
    </div>
  `;

  // Animation fix
  setTimeout(() => {
    container.querySelector('#modal-panel').classList.remove('scale-95');
    container.querySelector('#modal-panel').classList.add('scale-100');
  }, 10);

  const close = () => {
    container.remove();
    if (onCancel) onCancel();
  };

  container.querySelector('#close-btn').addEventListener('click', close);
  container.querySelector('#cancel-btn').addEventListener('click', close);

  container.querySelector('#job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
    container.remove();
  });

  return container;
}
