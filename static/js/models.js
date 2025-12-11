document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('models-container');
    if (!container) return;

    fetch("../static/data/models.json")
        .then(response => response.json())
        .then(models => {
            models.forEach(model => {
                const section = document.createElement('div');
                
                // H2
                const h2 = document.createElement('h2');
                h2.id = model.id;
                h2.textContent = model.name;
                section.appendChild(h2);

                // Repository
                const pRepo = document.createElement('p');
                const bRepo = document.createElement('b');
                bRepo.textContent = 'Repository: ';
                pRepo.appendChild(bRepo);
                
                const aRepo = document.createElement('a');
                aRepo.href = model.repo;
                aRepo.target = '_blank';
                // Format repo text like hf.co/...
                aRepo.textContent = model.repo.replace('https://huggingface.co/', 'hf.co/');
                pRepo.appendChild(aRepo);
                section.appendChild(pRepo);

                // Details Header
                const h3Details = document.createElement('h3');
                h3Details.textContent = 'Details';
                section.appendChild(h3Details);

                // Table
                const table = document.createElement('table');
                const tbody = document.createElement('tbody');
                
                // Header row
                const trHead = document.createElement('tr');
                const thProp = document.createElement('th');
                thProp.textContent = 'Property';
                thProp.style.width = '50%';
                const thVal = document.createElement('th');
                thVal.textContent = 'Value';
                thVal.style.width = '50%';
                trHead.appendChild(thProp);
                trHead.appendChild(thVal);
                tbody.appendChild(trHead);

                // Data rows
                const keys = ["Model Size", "Architecture", "Quantization", "License"];
                keys.forEach(key => {
                    if (model.details[key]) {
                        const tr = document.createElement('tr');
                        const tdKey = document.createElement('td');
                        tdKey.textContent = key;
                        const tdVal = document.createElement('td');
                        tdVal.textContent = model.details[key];
                        tr.appendChild(tdKey);
                        tr.appendChild(tdVal);
                        tbody.appendChild(tr);
                    }
                });
                table.appendChild(tbody);
                section.appendChild(table);

                // Files Header
                const h3Files = document.createElement('h3');
                h3Files.textContent = 'Available Model Files';
                section.appendChild(h3Files);

                // Pre block
                const pre = document.createElement('pre');
                pre.textContent = model.files.join('\n');
                section.appendChild(pre);

                container.appendChild(section);
            });

            // Re-apply Coming Soon logic if available
            if (window.markComingSoon) {
                window.markComingSoon();
            }

            // Re-apply New logic if available
            if (window.markNew) {
                window.markNew();
            }
        })
        .catch(error => console.error("Error loading models:", error));
});
