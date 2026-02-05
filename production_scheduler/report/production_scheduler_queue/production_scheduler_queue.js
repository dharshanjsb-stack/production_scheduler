frappe.query_reports["Production Scheduler Queue"] = {
    onload: function(report) {
        report.page.add_inner_button("Save Order", function() {
            let data = report.data;
            frappe.call({
                method: "production_scheduler.api.update_scheduler_order",
                args: {
                    rows: JSON.stringify(data)
                },
                callback: function() {
                    frappe.msgprint("Order saved successfully");
                }
            });
        });
    },

    formatter: function(value, row, column, data, default_formatter) {
        return default_formatter(value, row, column, data);
    },

    tree: false,
    initial_depth: 0,
    row_drag_and_drop: true
};
