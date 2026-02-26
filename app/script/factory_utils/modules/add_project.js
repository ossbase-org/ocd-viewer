/**
 * #########################
 * #   Additionals fields  #
 * #########################
 **/

function addProject() {
    const id = Date.now();
    const html = `
<div class="card-item border-l-4 border-l-blue-500 animate-fadeIn relative p-6 bg-white shadow-sm rounded-2xl mb-6" id="p-${id}">
    <button type="button" onclick="this.parentElement.remove()" class="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
        <i class="fas fa-trash"></i>
    </button>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">1. Project Identity</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label>Project Name *</label>
                    <input type="text" class="p-name" required minlength="1">
                </div>
                <div class="md:col-span-2">
                    <label>Description *</label>
                    <textarea class="p-desc" rows="2" required minlength="1"></textarea>
                </div>
                <div>
                    <label>Status</label>
                    <select class="p-status">
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                        <option value="disabled">Disabled</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">2. Repository (Required)</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Repo URL *</label><input type="url" class="p-repo-url" required placeholder="https://github.com/..."></div>
                <div><label>License (SPDX) *</label><input type="text" class="p-repo-license" required minlength="1" placeholder="MIT"></div>
                <div><label>Clone URL</label><input type="url" class="p-repo-clone"  placeholder="https://github.com/..."></div>
                <div><label>Tests URL</label><input type="url" class="p-repo-tests"  placeholder="https://github.com/..."></div>
                <div><label>Type </label><input type="text" class="p-repo-type" minlength="1" placeholder="git"></div>
            </div>
        </div>

        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">3. Project Links</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Project Page</label><input type="url" class="p-link-page"  placeholder="https://..."></div>
                <div><label>Home Page</label><input type="url" class="p-link-home-page" placeholder="https://..."></div>
                <div><label>Documentation</label><input type="url" class="p-link-docs" placeholder="https://..."></div>
                <div><label>Demo</label><input type="url" class="p-link-demo" placeholder="https://..."></div>
                <div><label>Releases</label><input type="url" class="p-link-releases" placeholder="https://..."></div>
                <div><label>Community</label><input type="url" class="p-link-community" placeholder="https://..."></div>
                <div>
                    <label>OpenAPI Spec (Metadata)</label>
                    <input type="url" class="p-link-openapi" placeholder="https://api.example.com/openapi.json">
                </div>
            </div>
        </div>
        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">4. Participate</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- issues , good_first_issues , chat, docs all urls -->
                <div><label>Issues URL</label><input type="url" class="p-part-issues" placeholder="https://..."></div>
                <div><label>Good First Issues URL</label><input type="url" class="p-part-good-first-issues" placeholder="https://..."></div>
                <div><label>Chat URL</label><input type="url" class="p-part-chat" placeholder="https://..."></div>
                <div><label>Docs URL</label><input type="url" class="p-part-docs" placeholder="https://..."></div>
            </div>
        </div>

        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">5. Governance</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Maintainers (Press Enter or +)</label>
                    <div class="flex gap-2">
                        <input type="text" id="maint-input-${id}" class="flex-grow" placeholder="Name or Github handle"
                                onkeydown="if(event.key === 'Enter') { event.preventDefault(); handleItemAdd('${id}', 'maint'); }">
                        <button type="button" onclick="handleItemAdd('${id}', 'maint')" 
                                class="bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div id="maint-container-${id}" class="flex flex-wrap gap-2 mt-3" data-items="[]"></div>
                </div>
                <div><label>Code owner</label><input type="url" class="p-part-code-owner" placeholder="https://..."></div>
            </div>
        </div>
        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">6. Release</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label>Changelog URL</label><input type="url" class="p-part-changelog" placeholder="https://..."></div>
                <div><label>Security policy URL</label><input type="url" class="p-part-security-policy" placeholder="https://..."></div>
            </div>
        </div>    
        <div class="md:col-span-2 border-t pt-4">
            <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">7. Tags</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Tags (Press Enter or +)</label>
                    <div class="flex gap-2">
                        <input type="text" id="tag-input-${id}" class="flex-grow" placeholder="Add a tag..." 
                                onkeydown="if(event.key === 'Enter') { event.preventDefault(); handleItemAdd('${id}', 'tags'); }">
                        <button type="button" onclick="handleItemAdd('${id}', 'tags')" 
                                class="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div id="tags-container-${id}" class="flex flex-wrap gap-2 mt-3" data-items="[]"></div>
                </div>
            </div>
        </div>
        <div class="md:col-span-2 border-t pt-6 mt-4" id="group-project-attr-${id}">
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 italic">8. Other Identifiers / Custom Attributes</h4>
                <button type="button" onclick="toggleCustomForm('project-attr-${id}')"
                    class="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase">
                    <i class="fas fa-plus-circle"></i> Add Attribute
                </button>
            </div>

            <div id="custom-form-project-attr-${id}"
                class="hidden mt-4 p-4 bg-white rounded-xl border border-dashed border-slate-300 animate-fadeIn">
                <div class="flex gap-2">
                    <input type="text" placeholder="Key (ex: vat_number)"
                        class="custom-key-project-attr-${id} text-xs p-2 rounded-lg border w-1/3">
                    <input type="text" placeholder="Value"
                        class="custom-val-project-attr-${id} text-xs p-2 rounded-lg border flex-grow">
                    <button type="button" onclick="addCustomFieldList('project-attr-${id}', 'project')"
                        class="bg-slate-800 text-white px-4 rounded-lg">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </div>
            <div id="custom-container-project-attr-${id}"
                class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>
        </div>
    </div>
</div>`;
    document.getElementById('project-list').insertAdjacentHTML('beforeend', html);
}
