frappe.pages['production-scheduler-board'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Production Scheduler Board',
        single_column: true
    });

    page.main.html(`
        <div class="production-board">
            <h3>Production Scheduler Board</h3>
            <div id="scheduler-area">
                Loading production schedule...
            </div>
        </div>
    `);

    frappe.call({
        method: "production_scheduler.api.get_queue_data",
        callback: function (r) {
            if (r.message) {
                let html = "<ul>";
                r.message.forEach(row => {
                    html += `<li>
                        <b>${row.work_order}</b> |
                        ${row.party} |
                        ${row.quality} |
                        ${row.date}
                    </li>`;
                });
                html += "</ul>";

                document.getElementById("scheduler-area").innerHTML = html;
            }
        }
    });
};
