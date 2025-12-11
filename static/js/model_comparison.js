document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.querySelector("#comparison-table tbody");
    if (!tableBody) return;

    fetch("../static/data/model_comparison.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const tr = document.createElement("tr");
                
                // Map JSON properties to table columns: Model, Params, Format, Quant, Size
                const values = [item.model, item.params, item.format, item.quant, item.size];

                values.forEach(text => {
                    const td = document.createElement("td");
                    td.textContent = text;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error loading comparison data:", error));
});