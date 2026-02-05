frappe.pages['production-scheduler-board'].on_page_load = function(wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Production Scheduler',
        single_column: true
    });

    load_data();
};

function load_data() {
    frappe.call({
        method: 'production_scheduler.production_scheduler.api.get_queue_data',
        callback: function(r) {
            const tbody = document.getElementById('schedule-body');
            tbody.innerHTML = '';

            r.message.forEach(row => {
                const tr = document.createElement('tr');
                tr.setAttribute('draggable', true);
                tr.dataset.name = row.work_order;

                tr.innerHTML = `
                    <td>${row.date || ''}</td>
                    <td>${row.work_order}</td>
                    <td>${row.party || ''}</td>
                    <td>${row.quality || ''}</td>
                    <td>${row.colour || ''}</td>
                    <td>${row.gsm || ''}</td>
                    <td>${row.weight || 0}</td>
                    <td>${row.actual || 0}</td>
                `;

                tbody.appendChild(tr);
            });

            enable_drag_drop();
        }
    });
}

function enable_drag_drop() {
    let dragged;

    document.querySelectorAll('#schedule-body tr').forEach(row => {
        row.addEventListener('dragstart', e => {
            dragged = row;
            row.classList.add('dragging');
        });

        row.addEventListener('dragend', e => {
            row.classList.remove('dragging');
        });

        row.addEventListener('dragover', e => {
            e.preventDefault();
            const target = e.target.closest('tr');
            if (target && target !== dragged) {
                target.parentNode.insertBefore(dragged, target);
            }
        });
    });
}

document.addEventListener('click', function(e) {
    if (e.target.id === 'save-order') {
        save_order();
    }
});

function save_order() {
    const rows = [];
    document.querySelectorAll('#schedule-body tr').forEach(tr => {
        rows.push(tr.dataset.name);
    });

    frappe.call({
        method: 'production_scheduler.production_scheduler.api.update_queue_order',
        args: {
            rows: JSON.stringify(rows)
        },
        callback: function() {
            frappe.msgprint('Production order saved successfully');
        }
    });
}
