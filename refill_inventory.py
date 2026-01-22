from database import update_inventory, get_all_inventory

def refill():
    print("starting refill...")
    items_to_refill = {
        'Milk': 50, 
        'Bread': 40, 
        'Butter': 100, 
        'Cheese': 50, 
        'Notebook': 200, 
        'Pen Set': 100, 
        'Rice 5kg': 20, 
        'Oil': 50
    }
    
    for item, qty in items_to_refill.items():
        print(f"Adding {qty} to {item}...")
        update_inventory(item, qty)
        
    print("\nRefill complete! New Stock Levels:")
    stock = get_all_inventory()
    for item in stock:
        print(f"{item['item']}: {item['stock']}")

if __name__ == "__main__":
    refill()
