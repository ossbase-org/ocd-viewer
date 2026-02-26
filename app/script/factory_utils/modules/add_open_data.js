/**
 * ###############
 * #   ADD data  #
 * ###############
 **/

function addData() {
    const id = Date.now();
    const html = `
        <div class="card-item border-l-4 border-l-emerald-500 animate-fadeIn" id="d-${id}">
            <button type="button" onclick="this.parentElement.remove()" class="absolute top-4 right-4 text-slate-300 hover:text-red-500"><i class="fas fa-trash"></i></button>
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2"><label>Dataset Name *</label><input type="text" class="d-name" required></div>
                <div><label>Landing Page URL *</label><input type="url" class="d-url" required></div>
                <div><label>License *</label><input type="text" class="d-license" required placeholder="CC-BY-4.0"></div>
                <div><label>Formats (CSV, JSON...)</label><input type="text" class="d-formats"></div>
            </div>
        </div>`;
    document.getElementById('data-list').insertAdjacentHTML('beforeend', html);
}