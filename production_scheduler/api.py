import frappe

@frappe.whitelist()
def get_queue_data():
    # Matches your spreadsheet columns: Date, Party, Quality, Colour, GSM, Weight, Actual
    return frappe.db.sql("""
        SELECT 
            name as work_order,
            planned_start_date as date,
            customer as party,
            item_name as quality,
            custom_colour as colour,
            custom_gsm as gsm,
            qty as weight,
            produced_qty as actual,
            status,
            idx  -- This stores the manual sort order
        FROM `tabWork Order`
        ORDER BY planned_start_date ASC, idx ASC
    """, as_dict=True)

@frappe.whitelist()
def update_queue_order(rows):
    import json
    # 'rows' will be a list of Work Order IDs in their new order
    row_list = json.loads(rows)
    for i, name in enumerate(row_list):
        # Update the hidden 'idx' field to save the drag-and-drop position
        frappe.db.set_value('Work Order', name, 'idx', i)
    frappe.db.commit()