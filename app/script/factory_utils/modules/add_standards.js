/**
 * #########################
 * #   Additionals fields  #
 * #########################
 **/
function addStandard() {
    const id = Date.now();
    const html = `
        <div class="card-item border-l-4 border-l-purple-500 animate-fadeIn" id="s-${id}">
            <button type="button" onclick="this.parentElement.remove()" class="absolute top-4 right-4 text-slate-300 hover:text-red-500"><i class="fas fa-trash"></i></button>
            <div class="grid grid-cols-1 gap-4">
                <div><label>Standard Body *</label><input type="text" class="s-body" required placeholder="W3C"></div>
                <div><label>Contribution Title *</label><input type="text" class="s-title" required></div>
                <div><label>Reference URL *</label><input type="url" class="s-url" required></div>
            </div>
        </div>`;
    document.getElementById('standards-list').insertAdjacentHTML('beforeend', html);
}