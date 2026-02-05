import frappe

def execute(filters=None):
    columns = [
        "Schedule Date:Date:100",
        "Customer:Data:150",
        "Item:Link/Item:120",
        "Quality:Data:100",
        "Colour:Data:100",
        "GSM:Data:80",
        "Planned Weight:Float:120",
        "Actual Production:Float:120",
        "Machine Status:Data:120",
        "Dispatch Status:Data:120",
    ]

    data = frappe.call(
        "production_scheduler.api.get_scheduler_queue"
    )

    return columns, data
