/**
 * ####################
 * #   Custom Fields  #
 * ####################
 **/
function addCustomField(projectId, category) {
    const groupEl = document.getElementById(`group-${projectId}`) || 
                    document.getElementById(`tab-org`) || 
                    document.getElementById(`p-${projectId}`);

    if (!groupEl) {
        return;
    }


    const keyInput = groupEl.querySelector(`.custom-key-link-${projectId}, .custom-key-${projectId}`);
    const valInput = groupEl.querySelector(`.custom-val-link-${projectId}, .custom-val-${projectId}`);
    

    const container = document.getElementById(`custom-container-${projectId}`) || 
                    document.getElementById(`custom-container-link-${projectId}`);

    if (!keyInput || !valInput) {
        console.error("Inputs not found inside group:", projectId);
        return;
    }

    const rawKey = keyInput.value.trim();
    const val = valInput.value.trim();

    if (rawKey === "" || val === "") return;

    const cleanKey = rawKey.toLowerCase().replace(/\s+/g, '_');
    const displayKey = rawKey.charAt(0).toUpperCase() + rawKey.slice(1);

    const div = document.createElement('div');
    div.className = "animate-fadeIn flex flex-col";
    div.innerHTML = `
        <div class="flex justify-between items-center mb-1">
            <label class="mb-0 text-slate-700">${displayKey}</label>
            <button type="button" onclick="this.closest('.animate-fadeIn').remove()" 
                class="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-tighter">
                <i class="fas fa-trash-alt"></i> 
            </button>
        </div>
        <input type="text" class="custom-field-input" 
            data-key="${cleanKey}" value="${val}">
    `;

    container.appendChild(div);

    keyInput.value = "";
    valInput.value = "";
    

    if (typeof toggleCustomForm === 'function') toggleCustomForm(projectId);
}

function addCustomFieldList(projectId, category) {
    const formGroup = document.getElementById(`group-${projectId}`) || 
                      document.getElementById(`custom-form-${projectId}`).parentElement;

    if (!formGroup) {
        return;
    }

    const keyInput = formGroup.querySelector(`.custom-key-${projectId}`);
    const valInput = formGroup.querySelector(`.custom-val-${projectId}`);
    const container = document.getElementById(`custom-container-${projectId}`);

    if (!keyInput || !valInput || !container) {
        console.error("Required elements not found for project:", projectId);
        return;
    }

    const rawKey = keyInput.value.trim();
    const val = valInput.value.trim();

    if (rawKey === "" || val === "") return;


    const cleanKey = rawKey.toLowerCase().replace(/\s+/g, '_');
    const displayKey = rawKey.charAt(0).toUpperCase() + rawKey.slice(1);


    const div = document.createElement('div');
    div.className = "animate-fadeIn flex flex-col bg-slate-50 p-2 rounded-lg border border-slate-100";
    div.innerHTML = `
        <div class="flex justify-between items-center mb-1">
            <label class="mb-0 text-slate-700 text-[10px] font-black uppercase tracking-tighter">${displayKey}</label>
            <button type="button" onclick="this.closest('.animate-fadeIn').remove()" 
                class="text-red-400 hover:text-red-600 text-[10px]">
                <i class="fas fa-trash-alt"></i> 
            </button>
        </div>
        <input type="text" class="custom-field-input w-full p-1 text-sm bg-white border rounded shadow-sm focus:ring-1 focus:ring-blue-400 outline-none" 
            data-key="${cleanKey}" value="${val}">
    `;

    container.appendChild(div);

    keyInput.value = "";
    valInput.value = "";
    
    if (typeof toggleCustomForm === 'function') toggleCustomForm(projectId);
}

function addCustomFieldWithData(projectId, category, key, value) {
    const container = document.getElementById(`custom-container-link-${projectId}`) || 
                    document.getElementById(`custom-container-${projectId}`);
    
    if (!container) {
        return;
    }

    const cleanKey = key.toLowerCase().replace(/\s+/g, '_');
    const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

    const div = document.createElement('div');
    div.className = "animate-fadeIn flex flex-col";
    div.innerHTML = `
        <div class="flex justify-between items-center mb-1">
            <label class="mb-0 text-slate-700 text-xs font-bold uppercase tracking-wide">${displayKey}</label>
            <button type="button" onclick="this.closest('.animate-fadeIn').remove()" 
                class="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-tighter transition-colors">
                <i class="fas fa-trash-alt"></i> 
            </button>
        </div>
        <input type="text" class="custom-field-input w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            data-key="${cleanKey}" value="${value}">
    `;

    container.appendChild(div);
}
function addNewContactGroup(importedName = null) {
    const name = importedName || prompt("Enter category name:");
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, '_');
    if (document.getElementById(`group-${id}`)) return;

    const container = document.getElementById('contact-groups-list');
    const div = document.createElement('div');
    div.className = "contact-group p-6 bg-slate-100/50 rounded-2xl border border-slate-200 animate-fadeIn relative mt-6";
    div.id = `group-${id}`;

    div.innerHTML = `
<div class="flex justify-between items-start mb-4">
    <h3 class="font-bold uppercase text-xs tracking-wider"><i class="fas fa-address-card mr-2"></i>${name}</h3>
    <div class="flex gap-4">
        <button type="button" onclick="toggleCustomForm('${id}')" class="text-blue-600 font-bold text-[10px] uppercase">
            <i class="fas fa-plus-circle"></i> Add Field
        </button>
        <button type="button" onclick="this.closest('.contact-group').remove()" class="text-red-400"><i class="fas fa-trash"></i></button>
    </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div><label>Email</label><input type="email" id="contact-${id}-email" placeholder="email@example.org"></div>
    <div><label>URL</label><input type="url" id="contact-${id}-url" placeholder="https://..."></div>
</div>
<div id="custom-form-${id}" class="hidden mt-4 p-4 bg-white rounded-xl border border-dashed border-slate-300">
    <div class="flex gap-2">
        <input type="text" placeholder="Key" class="custom-key-link-${id} text-xs p-2 rounded-lg border w-1/3">
        <input type="text" placeholder="Value" class="custom-val-link-${id} text-xs p-2 rounded-lg border flex-grow">
        <button type="button" onclick="addCustomField('${id}', 'contact')" class="bg-slate-800 text-white px-3 rounded-lg"><i class="fas fa-check"></i></button>
    </div>
</div>
<div id="custom-container-link-${id}" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>
`;
    container.appendChild(div);
}

function clearContactCustoms() {
    ['os', 'sec', 'com'].forEach(id => {
        const container = document.getElementById(`custom-container-link-${id}`);
        if (container) container.innerHTML = '';
        const form = document.getElementById(`custom-form-${id}`);
        if (form) form.classList.add('hidden');
    });
    const list = document.getElementById('contact-groups-list');
    while (list.children.length > 3) {
        list.removeChild(list.lastChild);
    }
}

function toggleCustomForm(id) {
        const form = document.getElementById(`custom-form-${id}`);
        if (form) {
            form.classList.toggle('hidden');

            if (!form.classList.contains('hidden')) {
                const firstInput = form.querySelector('input');
                if (firstInput) firstInput.focus();
            }
        }
    }