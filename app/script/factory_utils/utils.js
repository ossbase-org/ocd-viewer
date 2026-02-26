/**
 * #####################
 * #   Utils function  #
 * #####################
 **/
window.addEventListener('scroll', function () {
    const upButton = document.getElementById('up-button');

    if (window.scrollY > 300) {
        upButton.classList.remove('opacity-0', 'invisible');
        upButton.classList.add('opacity-100', 'visible');
    } else {
        upButton.classList.add('opacity-0', 'invisible');
        upButton.classList.remove('opacity-100', 'visible');
    }
});

async function loadCountries() {
    const countrySelect = document.getElementById('org-country');

    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
    const countries = await response.json();


    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));


    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca2; //  "FR", "US", etc.
        option.textContent = `${country.name.common} (${country.cca2})`;
        countrySelect.appendChild(option);
    });
}

window.addEventListener('DOMContentLoaded', loadCountries);

function validateContactsAnyOf() {
    const types = ['os', 'sec', 'com'];
    let allValid = true;

    types.forEach(type => {
        const emailEl = document.getElementById(`contact-${type}-email`);
        const urlEl = document.getElementById(`contact-${type}-url`);
        const email = emailEl.value.trim();
        const url = urlEl.value.trim();
        const groupContainer = document.getElementById(`group-${type}`);


        if (email === "" && url === "") {
            if (groupContainer) groupContainer.classList.remove('contact-group-error');
            return;
        }

        const hasContent = email !== "" || url !== "";
        const isEmailFormatValid = emailEl.checkValidity();
        const isUrlFormatValid = urlEl.checkValidity();

        if (hasContent && isEmailFormatValid && isUrlFormatValid) {
            if (groupContainer) groupContainer.classList.remove('contact-group-error');
        } else {
            allValid = false;
            if (groupContainer) groupContainer.classList.add('contact-group-error');
        }
    });

    return allValid;
}


/**
 * #####################
 * #   Tab functions   #
 * #####################
 **/

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'tab-error');
        b.classList.add('text-slate-400');
    });

    document.getElementById(tabId).classList.add('active');
    const activeBtn = document.getElementById('btn-' + tabId);
    activeBtn.classList.add('bg-blue-600', 'text-white');
    activeBtn.classList.remove('text-slate-400');
}

function handleItemAdd(projectId, type) {
    const input = document.getElementById(`${type === 'tags' ? 'tag' : 'maint'}-input-${projectId}`);
    const container = document.getElementById(`${type}-container-${projectId}`);
    const val = input.value.trim();

    if (val === "") return;
    let items = JSON.parse(container.getAttribute('data-items') || "[]");

    // Add if unique
    if (!items.includes(val)) {
        items.push(val);
        container.setAttribute('data-items', JSON.stringify(items));
        renderItemBadges(projectId, type);
    }

    input.value = "";
}

function renderItemBadges(projectId, type) {
    const container = document.getElementById(`${type}-container-${projectId}`);
    const items = JSON.parse(container.getAttribute('data-items') || "[]");

    const styleClasses = type === 'tags'
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200';

    container.innerHTML = items.map((item, index) => `
<span class="flex items-center gap-2 px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider ${styleClasses} animate-fadeIn">
    ${item}
    <i class="fas fa-times cursor-pointer hover:text-red-500 ml-1 transition-colors" 
        onclick="removeItem('${projectId}', '${type}', ${index})"></i>
</span>
`).join('');
}

function removeItem(projectId, type, index) {
    const container = document.getElementById(`${type}-container-${projectId}`);
    let items = JSON.parse(container.getAttribute('data-items') || "[]");
    items.splice(index, 1);
    container.setAttribute('data-items', JSON.stringify(items));
    renderItemBadges(projectId, type);
}

function openPasteModal() {
    document.getElementById('paste-modal').classList.remove('hidden');
    document.getElementById('paste-modal').classList.add('flex');
    document.getElementById('raw-json-input').focus();
}


function closePasteModal() {
    document.getElementById('paste-modal').classList.add('hidden');
    document.getElementById('paste-modal').classList.remove('flex');
    document.getElementById('raw-json-input').value = '';
}
function processPastedJSON() {
    const jsonArea = document.getElementById('raw-json-input');
    const rawValue = jsonArea.value.trim();

    if (!rawValue) return;

    try {
        const data = JSON.parse(rawValue);

        fillForm(data);
        closePasteModal();

    } catch (err) {
        alert("Invalid JSON format. Please check your syntax.\n\nError: " + err.message);
        jsonArea.classList.add('border-red-500');
    }
}