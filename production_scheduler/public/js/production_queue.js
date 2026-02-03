frappe.pages['production-queue'].on_page_load = function(wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Production Order Queue',
        single_column: true
    });

    // Add a Save button to the page head
    page.set_primary_action('Save Order', () => save_new_order());

    $(wrapper).find('.layout-main-section').append(`
        <div class="table-responsive">
            <table class="table table-bordered" id="queue-table">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="width: 40px;"></th> <th>Date</th><th>Party Name</th><th>Quality</th>
                        <th>Colour</th><th>GSM</th><th>Weight</th><th>Actual</th>
                    </tr>
                </thead>
                <tbody id="sortable-body"></tbody>
            </table>
        </div>
    `);

    refresh_queue(wrapper);
};

function refresh_queue(wrapper) {
    frappe.call({
        method: 'production_scheduler.api.get_queue_data',
        callback: function(r) {
            let tbody = $(wrapper).find('#sortable-body').empty();
            r.message.forEach(row => {
                // Color rows based on status (Green for finished, Red for pending)
                let row_class = row.status === "Completed" ? "table-success" : "table-danger";
                
                tbody.append(`
                    <tr class="${row_class}" data-name="${row.work_order}">
                        <td class="handle" style="cursor: grab;">☰</td>
                        <td>${row.date}</td>
                        <td>${row.party || ''}</td>
                        <td>${row.quality}</td>
                        <td>${row.colour || ''}</td>
                        <td>${row.gsm || ''}</td>
                        <td>${row.weight}</td>
                        <td><b>${row.actual || 0}</b></td>
                    </tr>
                `);
            });

            // Initialize the Drag and Drop
            new Sortable(document.getElementById('sortable-body'), {
                handle: '.handle', 
                animation: 150,
                ghostClass: 'bg-light'
            });
        }
    });
}

function save_new_order() {
    let order = [];
    $('#sortable-body tr').each(function() {
        order.push($(this).data('name'));
    });

    frappe.call({
        method: 'production_scheduler.api.update_queue_order',
        args: { rows: JSON.stringify(order) },
        callback: function() {
            frappe.show_alert({message: __('Queue Order Saved'), indicator: 'green'});
        }
    });
}