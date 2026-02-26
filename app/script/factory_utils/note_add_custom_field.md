## to add a custom field

**STEP 1 :** replace all TODO by the name of the section in the json !

```js
<div class="md:col-span-2 border-t pt-6 mt-4" id="group-TODO-attr">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Other
            Identifiers / Custom Attributes</h3>
        <button type="button" onclick="toggleCustomForm('TODO-attr')"
            class="text-blue-600 hover:text-blue-800 text-[10px] font-bold uppercase">
            <i class="fas fa-plus-circle"></i> Add Attribute
        </button>
    </div>

    <div id="custom-form-org-attr" class="hidden mt-4 p-4 bg-white rounded-xl border border-dashed border-slate-300 animate-fadeIn">
        <div class="flex gap-2">
            <input type="text" placeholder="Key (ex: vat_number)"
                class="custom-key-TODO-attr text-xs p-2 rounded-lg border w-1/3">
            <input type="text" placeholder="Value"
                class="custom-val-TODO-attr text-xs p-2 rounded-lg border flex-grow">
            <button type="button" onclick="addCustomField('TODO-attr', 'TODO')"
                class="bg-slate-800 text-white px-4 rounded-lg">
                <i class="fas fa-check"></i>
            </button>
        </div>
    </div>
    <div id="custom-container-TODO-attr"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>
</div>
```

**STEP 2 :** go to _/script/factory.js_ :

1. update ClearJSON ()

```js
const customContainers = [
  "custom-container-link-org",
  "custom-container-link-org-attr",
  "custom-container-link-pol",
  "custom-container-policy-attr",
  // add the custom container........
];
```

2. update fillForm(ocd)

   found the associate sections and add

```js
if (ocd.SECTION_NAME) {
  const cocInput = document.getElementById("SECTION-NAME");
  // ... all the default section

  if (cocInput) cocInput.value = ocd.SECTION_NAME.NAME || "";

  const policyStandardKeys = [
    NAME,
    // ...
  ];

  Object.keys(ocd.SECTION_NAME).forEach((pKey) => {
    if (!policyStandardKeys.includes(pKey) && ocd.SECTION_NAME[pKey]) {
      addCustomFieldWithData(
        "SECTION-attr",
        "SECTION",
        pKey,
        ocd.SECTION_NAME[pKey],
      );
    }
  });
}
```

3. update exportJSON() **! VERY IMPORTANT !**

```js
policies: (() => {
            const polObj = {
                code_of_conduct: document.getElementById('SECTION-coc').value || undefined,
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
```
