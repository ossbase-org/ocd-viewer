/**
 * ##############################
 * #   Factory Functions (JSON) #
 * ##############################
 **/

function clearJSON() {
    if (!confirm("Are you sure you want to clear the entire form? All unsaved data will be lost.")) {
        return;
    }

    const form = document.getElementById('ocd-form');
    form.reset();

    const dynamicLists = ['project-list', 'data-list', 'standards-list'];
    dynamicLists.forEach(listId => {
        const el = document.getElementById(listId);
        if (el) el.innerHTML = '';
    });

    clearContactCustoms();

    const fixedCustomContainers = [
        'custom-container-link-org',
        'custom-container-link-org-attr',
        'custom-container-link-pol',
        'custom-container-policy-attr'
    ];

    fixedCustomContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
    });


    const dynamicProjectContainers = document.querySelectorAll('[id^="custom-container-project-attr-"]');
    dynamicProjectContainers.forEach(container => {
        container.innerHTML = '';
    });

    const importText = document.getElementById('import-text');
    const addMoreBtn = document.getElementById('import-add-more');
    const importLabel = document.getElementById('import-label');

    if (importText) importText.textContent = "IMPORT";
    if (addMoreBtn) addMoreBtn.classList.add('hidden');
    if (importLabel) importLabel.classList.remove('bg-slate-800');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('tab-error');
    });

    document.querySelectorAll('.contact-group').forEach(group => {
        group.classList.remove('contact-group-error');
    });

    showTab('tab-org');
}
function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const importText = document.getElementById('import-text');
    const addMoreBtn = document.getElementById('import-add-more');
    const importLabel = document.getElementById('import-label');

    importText.textContent = file.name;
    addMoreBtn.classList.remove('hidden');
    importLabel.classList.add('bg-slate-800');

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            fillForm(data);

            event.target.value = '';
        } catch (err) {
            alert("Error parsing JSON: " + err.message);
        }
    };
    reader.readAsText(file);
}

function fillForm(ocd) {
    if (ocd.organization) {
        document.getElementById('org-name').value = ocd.organization.name || "";
        document.getElementById('org-domain').value = ocd.organization.domain || "";
        document.getElementById('org-country').value = ocd.organization.country || "";
        document.getElementById('org-desc').value = ocd.organization.description || "";

        const orgRootStandardKeys = ['name', 'domain', 'country', 'description', 'links', 'policies'];

        Object.keys(ocd.organization).forEach(key => {
            if (!orgRootStandardKeys.includes(key) && typeof ocd.organization[key] !== 'object') {
                addCustomFieldWithData('org-attr', 'link', key, ocd.organization[key]);
            }
        });

        if (ocd.organization.links) {
            document.getElementById('org-link-home').value = ocd.organization.links.homepage || "";
            document.getElementById('org-link-os').value = ocd.organization.links.opensource_page || "";
            document.getElementById('org-link-github').value = ocd.organization.links.github_org || "";

            const orgLinkStandardKeys = ['homepage', 'opensource_page', 'github_org'];
            Object.keys(ocd.organization.links).forEach(key => {
                if (!orgLinkStandardKeys.includes(key) && ocd.organization.links[key]) {
                    addCustomFieldWithData('org', 'link', key, ocd.organization.links[key]);
                }
            });
        }
    }

    // 2. Contacts
    if (ocd.contacts) {
        const standardTypes = { opensource: 'os', security: 'sec', community: 'com' };

        Object.entries(ocd.contacts).forEach(([key, data]) => {
            let prefix = standardTypes[key];


            if (!prefix) {
                addNewContactGroup(key); 
                prefix = key.toLowerCase().replace(/\s+/g, '_');
            }

            if (data) {
                const groupEl = document.getElementById(`group-${prefix}`);
                if (groupEl) {
                    const emailInput = groupEl.querySelector(`[id="contact-${prefix}-email"], .contact-custom-email`);
                    const urlInput = groupEl.querySelector(`[id="contact-${prefix}-url"], .contact-custom-url`);
                    if (emailInput) emailInput.value = data.email || "";
                    if (urlInput) urlInput.value = data.url || "";
                }

                const contactStandardKeys = ['email', 'url'];
                Object.keys(data).forEach(cKey => {
                    if (!contactStandardKeys.includes(cKey) && data[cKey]) {
                        addCustomFieldWithData(prefix, 'contact', cKey, data[cKey]);
                    }
                });
            }
        });
    }
    // 3. Policies
    if (ocd.policies) {
        const cocInput = document.getElementById('policy-coc');
        const contribInput = document.getElementById('policy-contrib');
        const vdpInput = document.getElementById('policy-vdp');
        const licenseInput = document.getElementById('policy-license');

        if (cocInput) cocInput.value = ocd.policies.code_of_conduct || "";
        if (contribInput) contribInput.value = ocd.policies.contributing || "";
        if (vdpInput) vdpInput.value = ocd.policies.vulnerability_disclosure || "";
        if (licenseInput) licenseInput.value = ocd.policies.license_policy || "";

        const policyStandardKeys = [
            'code_of_conduct', 
            'contributing', 
            'vulnerability_disclosure', 
            'license_policy'
        ];

        Object.keys(ocd.policies).forEach(pKey => {
            if (!policyStandardKeys.includes(pKey) && ocd.policies[pKey]) {
                addCustomFieldWithData('policy-attr', 'policy', pKey, ocd.policies[pKey]);
            }
        });
    }
    // 4. Projects
    document.getElementById('project-list').innerHTML = "";
    if (ocd.projects && Array.isArray(ocd.projects)) {
        ocd.projects.forEach(p => {
            addProject();
            const cards = document.querySelectorAll('#project-list .card-item');
            const lastCard = cards[cards.length - 1];
            const pId = lastCard.id.replace('p-', '');

            // Identity
            lastCard.querySelector('.p-name').value = p.name || "";
            lastCard.querySelector('.p-desc').value = p.description || "";
            lastCard.querySelector('.p-status').value = p.status || "active";

            // Repository 
            if (p.repository) {
                lastCard.querySelector('.p-repo-url').value = p.repository.url || "";
                lastCard.querySelector('.p-repo-license').value = p.repository.license || "";
                lastCard.querySelector('.p-repo-clone').value = p.repository.clone || "";
                lastCard.querySelector('.p-repo-tests').value = p.repository.tests || "";
                lastCard.querySelector('.p-repo-type').value = p.repository.type || "";
            }

            // Project Links & Metadata
            if (p.links) {
                const standardKeys = ['project_page', 'homepage', 'documentation', 'demo', 'releases', 'community', 'metadata'];

                lastCard.querySelector('.p-link-page').value = p.links.project_page || "";
                lastCard.querySelector('.p-link-home-page').value = p.links.homepage || "";
                lastCard.querySelector('.p-link-docs').value = p.links.documentation || "";
                lastCard.querySelector('.p-link-demo').value = p.links.demo || "";
                lastCard.querySelector('.p-link-releases').value = p.links.releases || "";
                lastCard.querySelector('.p-link-community').value = p.links.community || "";

                if (p.links.metadata) {
                    lastCard.querySelector('.p-link-openapi').value = p.links.metadata.openapi || "";
                }


                Object.keys(p.links).forEach(key => {
                    if (!standardKeys.includes(key) && p.links[key]) {
                        addCustomFieldWithData(pId, 'link', key, p.links[key]);
                    }
                });
            }
            

            // Participate
            if (p.participate) {
                lastCard.querySelector('.p-part-issues').value = p.participate.issues || "";
                lastCard.querySelector('.p-part-good-first-issues').value = p.participate.good_first_issues || "";
                lastCard.querySelector('.p-part-chat').value = p.participate.chat || "";
                lastCard.querySelector('.p-part-docs').value = p.participate.docs || "";
            }

            // Governance & Maintainers
            if (p.governance) {
                lastCard.querySelector('.p-part-code-owner').value = p.governance.codeowners || "";
                if (p.governance.maintainers) {
                    const container = document.getElementById(`maint-container-${pId}`);
                    container.setAttribute('data-items', JSON.stringify(p.governance.maintainers));
                    renderItemBadges(pId, 'maint');
                }
            }

            // Release
            if (p.release) {
                lastCard.querySelector('.p-part-changelog').value = p.release.changelog || "";
                lastCard.querySelector('.p-part-security-policy').value = p.release.security_policy || "";
            }

            // Tags (Badge System)
            if (p.tags) {
                const container = document.getElementById(`tags-container-${pId}`);
                container.setAttribute('data-items', JSON.stringify(p.tags));
                renderItemBadges(pId, 'tags');
            }

            const knownProjectKeys = [
                'name', 'description', 'status', 'repository', 
                'links', 'participate', 'governance', 'release', 'tags'
            ];

            Object.keys(p).forEach(pKey => {
                if (!knownProjectKeys.includes(pKey) && p[pKey] !== null && typeof p[pKey] !== 'object') {
                    
                    addCustomFieldWithData(`project-attr-${pId}`, 'project', pKey, p[pKey]);
                }
            });
        });
    }

    // 5. Open Data
    document.getElementById('data-list').innerHTML = "";
    if (ocd.open_data && Array.isArray(ocd.open_data)) {
        ocd.open_data.forEach(d => {
            addData();
            const cards = document.querySelectorAll('#data-list .card-item');
            const last = cards[cards.length - 1];
            last.querySelector('.d-name').value = d.name || "";
            last.querySelector('.d-license').value = d.license || "";
            last.querySelector('.d-formats').value = d.formats ? d.formats.join(', ') : "";
            if (d.urls) {
                last.querySelector('.d-url').value = d.urls.landing_page || "";
            }
        });
    }

    alert("JSON imported successfully!");
}

/**
 * #########################
 * #   Export functions    #
 * #########################
 **/

function exportJSON() {
    const form = document.getElementById('ocd-form');
    const navButtons = document.querySelectorAll('.nav-btn');

    // Reset validation styles
    navButtons.forEach(btn => btn.classList.remove('tab-error'));
    const isContactValid = validateContactsAnyOf();

    // Form Validation
    if (!form.checkValidity() || !isContactValid) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            const invalidFields = tab.querySelectorAll(':invalid');
            const contactErrors = tab.querySelectorAll('.contact-group-error');

            if (invalidFields.length > 0 || contactErrors.length > 0) {
                const btnId = 'btn-' + tab.id;
                const btn = document.getElementById(btnId);
                if (btn) btn.classList.add('tab-error');
            }
        });

        form.reportValidity();
        return;
    }

    /** * HELPERS 
     **/

    // Helper to map contacts based on anyOf (email OR url)
    const mapContact = (idPrefix) => {
        const groupEl = document.getElementById(`group-${idPrefix}`);
        if (!groupEl) return undefined;

        const email = groupEl.querySelector(`[id="contact-${idPrefix}-email"], .contact-custom-email`)?.value.trim();
        const url = groupEl.querySelector(`[id="contact-${idPrefix}-url"], .contact-custom-url`)?.value.trim();

        let contactObj = {};
        if (email) contactObj.email = email;
        if (url) contactObj.url = url;

        const customInputs = document.querySelectorAll(`#custom-container-link-${idPrefix} .custom-field-input`);
        customInputs.forEach(input => {
            const key = input.getAttribute('data-key');
            const val = input.value.trim();
            if (val !== "") contactObj[key] = val;
        });

        return Object.keys(contactObj).length > 0 ? contactObj : undefined;
    };

    // Helper to get arrays from the badge system (Tags & Maintainers)
    const getBadgeArray = (projectId, type) => {
        const container = document.getElementById(`${type}-container-${projectId}`);
        const data = JSON.parse(container?.getAttribute('data-items') || "[]");
        return data.length > 0 ? data : undefined;
    };

    /** * CONSTRUCTING THE JSON OBJECT 
     **/

    const ocd = {
        spec_version: "1.0",
        generated_at: new Date().toISOString(),
        organization: {
            name: document.getElementById('org-name').value,
            domain: document.getElementById('org-domain').value,
            country: document.getElementById('org-country').value || undefined,
            description: document.getElementById('org-desc').value || undefined,
            // Custom Organization Attributes
            ...(() => {
                const attrs = {};
                document.querySelectorAll('#custom-container-link-org-attr .custom-field-input').forEach(input => {
                    attrs[input.getAttribute('data-key')] = input.value;
                });
                return attrs;
            })(),
            links: (() => {
                const linksObj = {
                    homepage: document.getElementById('org-link-home').value || undefined,
                    opensource_page: document.getElementById('org-link-os').value || undefined,
                    github_org: document.getElementById('org-link-github').value || undefined
                };

                document.querySelectorAll('#custom-container-link-org .custom-field-input').forEach(input => {
                    const key = input.getAttribute('data-key');
                    const val = input.value.trim();
                    if (val !== "") linksObj[key] = val;
                });

                return linksObj;
            })()
        },
        contacts: (() => {
            const contactsObj = {};
            contactsObj.opensource = mapContact('os');
            contactsObj.security = mapContact('sec');
            contactsObj.community = mapContact('com');

            document.querySelectorAll('#contact-groups-list .contact-group').forEach(group => {
                const id = group.id.replace('group-', '');
                if (!['os', 'sec', 'com'].includes(id)) {
                    contactsObj[id] = mapContact(id);
                }
            });

            Object.keys(contactsObj).forEach(key => contactsObj[key] === undefined && delete contactsObj[key]);
            return Object.keys(contactsObj).length > 0 ? contactsObj : undefined;
        })(),
        policies: (() => {
            const polObj = {
                code_of_conduct: document.getElementById('policy-coc').value || undefined,
                contributing: document.getElementById('policy-contrib').value || undefined,
                vulnerability_disclosure: document.getElementById('policy-vdp').value || undefined,
                license_policy: document.getElementById('policy-license').value || undefined
            };

            document.querySelectorAll('#custom-container-policy-attr .custom-field-input').forEach(input => {
                const key = input.getAttribute('data-key');
                const val = input.value.trim();
                if (val !== "") polObj[key] = val;
            });

            Object.keys(polObj).forEach(key => polObj[key] === undefined && delete polObj[key]);
            return Object.keys(polObj).length > 0 ? polObj : undefined;
        })(),
        projects: Array.from(document.querySelectorAll('#project-list .card-item')).map(el => {
            const projectId = el.id.replace('p-', '');
            const getVal = (cls) => {
                const val = el.querySelector(cls)?.value?.trim();
                return val !== "" ? val : undefined;
            };
            const maint = getBadgeArray(projectId, 'maint');
            const owner = getVal('.p-part-code-owner');
            
            // Create base project object
            const projectObj = {
                // 1. Project Identity
                name: getVal('.p-name'),
                description: getVal('.p-desc'),
                status: getVal('.p-status'),

                // 2. Repository
                repository: {
                    url: getVal('.p-repo-url'),
                    license: getVal('.p-repo-license'),
                    type: getVal('.p-repo-type'),
                    clone: getVal('.p-repo-clone'),
                    tests: getVal('.p-repo-tests')
                },

                // 3. Project Links
                links: {
                    project_page: getVal('.p-link-page'),
                    homepage: getVal('.p-link-home-page'),
                    documentation: getVal('.p-link-docs'),
                    demo: getVal('.p-link-demo'),
                    releases: getVal('.p-link-releases'),
                    community: getVal('.p-link-community'),
                    metadata: getVal('.p-link-openapi') ? {
                        openapi: getVal('.p-link-openapi')
                    } : undefined
                },

                // 4. Participate
                participate: {
                    issues: getVal('.p-part-issues'),
                    good_first_issues: getVal('.p-part-good-first-issues'),
                    chat: getVal('.p-part-chat'),
                    docs: getVal('.p-part-docs')
                },

                // 5. Governance
                governance: (maint || owner) ? {
                    maintainers: maint,
                    codeowners: owner
                } : undefined,

                // 6. Release
                release: {
                    changelog: getVal('.p-part-changelog'),
                    security_policy: getVal('.p-part-security-policy')
                },

                // 7. Tags
                tags: getBadgeArray(projectId, 'tags')
            };

            // 8. Custom Attributes (Section 8)
            const customContainer = document.getElementById(`custom-container-project-attr-${projectId}`);
            if (customContainer) {
                customContainer.querySelectorAll('.custom-field-input').forEach(input => {
                    const key = input.getAttribute('data-key');
                    const val = input.value.trim();
                    if (key && val !== "") {
                        projectObj[key] = val;
                    }
                });
            }

            return projectObj;
        }),
        open_data: Array.from(document.querySelectorAll('#data-list .card-item')).map(el => ({
            name: el.querySelector('.d-name').value,
            license: el.querySelector('.d-license').value,
            formats: el.querySelector('.d-formats').value ? el.querySelector('.d-formats').value.split(',').map(f => f.trim()) : undefined,
            urls: { landing_page: el.querySelector('.d-url').value }
        })),
        open_standards: Array.from(document.querySelectorAll('#standards-list .card-item')).map(el => ({
            body: el.querySelector('.s-body').value,
            contributions: [{
                title: el.querySelector('.s-title').value,
                type: "participation",
                url: el.querySelector('.s-url').value
            }]
        }))
    };

    /** * CLEANUP & EXPORT 
     **/

    // Remove empty contacts object if no contacts were provided
    if (ocd.contacts && !ocd.contacts.opensource && !ocd.contacts.security && !ocd.contacts.community) {
        delete ocd.contacts;
    }

    const blob = new Blob([JSON.stringify(ocd, null, 2)], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `ocd-${ocd.organization.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();

    URL.revokeObjectURL(blobUrl);
}