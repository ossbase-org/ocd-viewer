/**
 * #######################
 * #   Explorer Section  #
 * #######################
 **/
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const mainContent = document.getElementById('mainContent');
    const grid = document.getElementById('dataGrid');
    const searchInput = document.getElementById('searchInput');
    const sidePanel = document.getElementById('sidePanel');

    let allData = { projects: [], data: [], standards: [] };
    let currentFilter = 'all';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const ocd = JSON.parse(event.target.result);
                processOCD(ocd);
            } catch (err) { alert("Error: This is not a valid OCD JSON file."); }
        };
        reader.readAsText(file);
    });

    function processOCD(ocd) {
        currentOCD = ocd;
        graphLoaded = false;
        if (currentView === 'graph') sendToGraph();
        document.getElementById('headerTitle').textContent = ocd.organization?.name || "Organization";
        document.getElementById('headerSubtitle').textContent = ocd.organization?.description || ocd.organization?.domain || "";

        const linkBox = document.getElementById('headerLinks');
        linkBox.innerHTML = '';
        if (ocd.organization?.links) {
            Object.entries(ocd.organization.links).forEach(([key, url]) => {
                linkBox.innerHTML += `<a href="${url}" target="_blank" class="bg-white/10 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/5 uppercase">${key.replace('_', ' ')}</a>`;
            });
        }

        allData.projects = ocd.projects || [];
        allData.data = ocd.open_data || [];
        allData.standards = ocd.open_standards || [];

        uploadArea.classList.add('hidden');
        mainContent.classList.remove('hidden');
        renderCards();
    }

    function filterType(type) {
        currentFilter = type;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
            btn.classList.add('text-slate-500');
        });
        event.currentTarget.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
        renderCards();
    }

    function renderCards() {
        grid.innerHTML = '';
        let itemsToDisplay = [];

        if (currentFilter === 'all') itemsToDisplay = [...allData.projects.map(i => ({ ...i, _type: 'Project' })), ...allData.data.map(i => ({ ...i, _type: 'Dataset' })), ...allData.standards.map(i => ({ ...i, _type: 'Standard' }))];
        else if (currentFilter === 'projects') itemsToDisplay = allData.projects.map(i => ({ ...i, _type: 'Project' }));
        else if (currentFilter === 'data') itemsToDisplay = allData.data.map(i => ({ ...i, _type: 'Dataset' }));
        else if (currentFilter === 'standards') itemsToDisplay = allData.standards.map(i => ({ ...i, _type: 'Standard' }));

        const term = searchInput.value.toLowerCase();
        itemsToDisplay = itemsToDisplay.filter(i => JSON.stringify(i).toLowerCase().includes(term));

        itemsToDisplay.forEach(item => {
            const title = item.name || item.title || "Untitled";
            const desc = item.description || "No description provided.";

            const card = document.createElement('div');
            card.className = "ocd-card bg-white rounded-[2.5rem] border border-gray-100 p-10 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group";
            card.onclick = () => openPanel(item);

            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">${item._type}</span>
                        <i class="fas ${item.status === 'archived' ? 'fa-archive text-amber-500' : 'fa-check-circle text-emerald-500'} text-xs"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">${title}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8">${desc}</p>
                </div>
                <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-tighter">Click to explore</span>
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <i class="fas fa-arrow-right text-xs"></i>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    function formatValue(val) {
        if (!val) return '<span class="text-slate-300">N/A</span>';
        if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('www'))) {
            return `
                <div class="flex items-center gap-2 group/link">
                    <a href="${val}" target="_blank" class="text-blue-600 hover:underline font-mono text-sm truncate">${val}</a>
                    <button onclick="event.stopPropagation(); navigator.clipboard.writeText('${val}'); alert('Link copied!')" class="text-slate-300 hover:text-blue-500 transition-colors">
                        <i class="far fa-copy"></i>
                    </button>
                </div>`;
        }
        if (Array.isArray(val)) {
            return `<div class="flex flex-wrap gap-2 mt-2">${val.map(v => `<span class="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">${typeof v === 'object' ? 'Nested Info' : v}</span>`).join('')}</div>`;
        }
        if (typeof val === 'object') {
            let html = '<div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">';
            for (const [k, v] of Object.entries(val)) {
                html += `<div><label class="text-[9px] font-black text-slate-400 uppercase block mb-1">${k.replace(/_/g, ' ')}</label><div class="text-slate-800">${formatValue(v)}</div></div>`;
            }
            html += '</div>';
            return html;
        }
        return `<span class="text-slate-700">${val}</span>`;
    }

    function openPanel(item) {
        document.getElementById('panelType').textContent = item._type;
        document.getElementById('panelTitle').textContent = item.name || item.title;
        const panelContent = document.getElementById('panelContent');
        panelContent.innerHTML = '';
        Object.entries(item).forEach(([key, value]) => {
            if (key.startsWith('_')) return;
            const label = key.replace(/_/g, ' ').toUpperCase();
            panelContent.innerHTML += `
                <div class="mb-10 animate-fade-in">
                    <label class="text-blue-600 font-black text-[10px] tracking-widest block mb-3 uppercase border-b border-blue-50 pb-2">${label}</label>
                    <div class="text-base">${formatValue(value)}</div>
                </div>`;
        });
        sidePanel.classList.remove('translate-x-full');
    }

    function closePanel() { sidePanel.classList.add('translate-x-full'); }
    searchInput.addEventListener('input', renderCards);




function toggleUrlCollapse() {
    const collapse = document.getElementById('urlCollapse');
    if (collapse.classList.contains('hidden')) {
        collapse.classList.remove('hidden');
        collapse.style.opacity = "0";
        setTimeout(() => { collapse.style.opacity = "1"; }, 10);
        document.getElementById('remoteUrlInput').focus();
    } else {
        collapse.classList.add('hidden');
    }
}


function showUrlError(message) {
    const errorDiv = document.getElementById('urlError');
    const errorText = document.getElementById('urlErrorText');
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
    

    setTimeout(() => { errorDiv.classList.add('hidden'); }, 5000);
}


async function fetchRemoteData() {
    const urlInput = document.getElementById('remoteUrlInput');
    let url = urlInput.value.trim();

    if (url && !url.startsWith('http')) {
        url = 'https://' + url;
        urlInput.value = url; 
    }

    const btn = event.currentTarget;
    const errorDiv = document.getElementById('urlError');
    errorDiv.classList.add('hidden');

    if (!url) {
        showUrlError("Please enter a URL.");
        return;
    }

    const isValidFormat = url.toLowerCase().endsWith('.json') || url.toLowerCase().includes('.well-known');
    if (!isValidFormat) {
        showUrlError("The URL must point to a .json file or a .well-known endpoint.");
        return;
    }


    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.classList.add('opacity-50', 'pointer-events-none');

    try {

        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`Target site unreachable (Status ${response.status})`);
        }

        const ocd = await response.json();
        
        // Success
        processOCD(ocd);
        document.getElementById('urlCollapse').classList.add('hidden');

    } catch (err) {
        showUrlError(err.message || "Failed to fetch data.");
    } finally {
        btn.innerHTML = originalText;
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }
}


/**
 * ###################
 * #   Graph view    #
 * ###################
 * The loaded descriptor shown as a graph by project-graph (Pivograph), embedded
 * in an iframe. The page sends it the descriptor it already holds, so a local
 * file works as well as a remote one. For local development, point it at
 * another instance with ?graph=http://localhost:5199/ in this page's URL.
 **/
const GRAPH_URL = new URLSearchParams(location.search).get('graph') || 'https://ecrou-exact.github.io/project-graph/';

let currentOCD = null;
let currentView = 'cards';
let graphFrame = null;
let graphReady = false;
let graphLoaded = false;

function showView(view) {
    currentView = view;
    const isGraph = view === 'graph';
    document.getElementById('graphView').classList.toggle('hidden', !isGraph);
    document.getElementById('dataGrid').classList.toggle('hidden', isGraph);
    // Search and category filters belong to the cards; the graph has its own.
    document.getElementById('categoryFilters').classList.toggle('invisible', isGraph);
    document.getElementById('searchInput').parentElement.classList.toggle('invisible', isGraph);
    // The sticky header would cover the top of the graph when scrolling: let it scroll away.
    document.querySelector('#mainContent > header').classList.toggle('sticky', !isGraph);
    // The graph takes the whole width of the page; the cards keep their column.
    const main = document.getElementById('explorerMain');
    main.classList.toggle('max-w-7xl', !isGraph);
    main.classList.toggle('max-w-none', isGraph);
    main.classList.toggle('px-6', !isGraph);
    main.classList.toggle('px-3', isGraph);
    main.classList.toggle('py-12', !isGraph);
    main.classList.toggle('py-4', isGraph);
    [['cards', 'viewCardsBtn'], ['graph', 'viewGraphBtn']].forEach(([name, id]) => {
        const btn = document.getElementById(id);
        const active = name === view;
        btn.setAttribute('aria-selected', String(active));
        btn.classList.toggle('bg-white', active);
        btn.classList.toggle('text-slate-900', active);
        btn.classList.toggle('shadow-sm', active);
        btn.classList.toggle('text-slate-500', !active);
    });
    if (isGraph) openGraph();
}

function openGraph() {
    if (!graphFrame) {
        graphFrame = document.createElement('iframe');
        const url = new URL(GRAPH_URL);
        url.searchParams.set('embed', '1');
        graphFrame.src = url.toString();
        graphFrame.title = 'Graph of the open contributions';
        graphFrame.className = 'w-full h-full border-0';
        graphFrame.allow = 'fullscreen';
        document.getElementById('graphFrameHolder').appendChild(graphFrame);
    }
    sendToGraph();
}

function sendToGraph() {
    if (!graphFrame || !graphReady || !currentOCD || graphLoaded) return;
    graphFrame.contentWindow.postMessage({ type: 'pivograph:load', data: currentOCD, name: 'open-contributions.json' }, new URL(GRAPH_URL).origin);
    graphLoaded = true;
}

window.addEventListener('message', (event) => {
    // Only messages from our own graph iframe.
    if (!graphFrame || event.source !== graphFrame.contentWindow) return;
    if (event.data?.type === 'pivograph:ready') {
        graphReady = true;
        graphLoaded = false;
        sendToGraph();
    } else if (event.data?.type === 'pivograph:error') {
        console.warn('Graph view:', event.data.message);
    }
});

/** Full screen for the graph view (the box, so the button stays on top). */
function toggleGraphFullscreen() {
    const box = document.getElementById('graphBox');
    if (document.fullscreenElement) document.exitFullscreen();
    else box.requestFullscreen?.();
}

document.addEventListener('fullscreenchange', () => {
    const full = document.fullscreenElement === document.getElementById('graphBox');
    const box = document.getElementById('graphBox');
    const holder = document.getElementById('graphFrameHolder');
    box.classList.toggle('rounded-[2rem]', !full);
    // In full screen the graph fills the screen under the bar (box is a flex column).
    holder.classList.toggle('h-[calc(100vh-230px)]', !full);
    holder.classList.toggle('min-h-[560px]', !full);
    holder.classList.toggle('flex-1', full);
    box.classList.toggle('h-screen', full);
    const btn = document.getElementById('graphFullscreenBtn');
    btn.innerHTML = full
        ? '<i class="fas fa-compress"></i> <span>Exit full screen</span>'
        : '<i class="fas fa-expand"></i> <span>Full screen</span>';
});
