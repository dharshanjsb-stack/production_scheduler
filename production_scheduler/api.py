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
from frappe.utils import getdate

@frappe.whitelist()
def create_production_schedule(production_plan, schedule_date):
    plan = frappe.get_doc("Production Plan", production_plan)

    # Take first Production Plan item
    plan_item = plan.po_items[0]

    # Item master
    item = frappe.get_doc("Item", plan_item.item_code)

    doc = frappe.new_doc("Production Scheduler")
    doc.production_plan = plan.name
    doc.schedule_date = getdate(schedule_date)

    # Party details
    doc.customer = plan.customer
    doc.customer_name = frappe.db.get_value(
        "Customer", plan.customer, "customer_name"
    )

    # Product details
    doc.item = plan_item.item_code
    doc.quality = item.item_group
    doc.colour = item.get("custom_colour")
    doc.gsm = item.get("custom_gsm")

    # Quantity
    doc.planned_weight = plan_item.planned_qty
    doc.actual_production = 0
    doc.machine_status = "Running"
    doc.dispatch_status = "Pending"

    doc.insert(ignore_permissions=True)
    frappe.db.commit()

    return doc.name
