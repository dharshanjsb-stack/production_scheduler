import frappe

def execute():
    if not frappe.db.exists("Page", "production-scheduler-board"):
        page = frappe.get_doc({
            "doctype": "Page",
            "name": "production-scheduler-board",
            "page_name": "production-scheduler-board",
            "title": "Production Scheduler Board",
            "module": "Production Scheduler",
            "standard": 1
        })
        page.insert(ignore_permissions=True)
