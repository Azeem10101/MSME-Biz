from database import update_inventory, get_low_stock_items, get_inventory_stock

def debug_db():
    item = "debug_milk"
    
    # 1. Init/Restock
    print(f"Current Stock: {get_inventory_stock(item)}")
    update_inventory(item, 20)
    print(f"After +20: {get_inventory_stock(item)}")
    
    # 2. Sell
    update_inventory(item, -5)
    print(f"After -5: {get_inventory_stock(item)}")
    
    # 3. Low Stock Check
    low = get_low_stock_items()
    print(f"Low Stock Items (Threshold 5): {low}")
    
    # 4. Sell to Low
    update_inventory(item, -12)
    print(f"After -12: {get_inventory_stock(item)}")
    
    low = get_low_stock_items()
    print(f"Low Stock Items (Threshold 5): {low}")
    
    found = any(i['item'] == item for i in low)
    if found:
        print("SUCCESS: Item found in low stock.")
    else:
        print("FAILURE: Item NOT found in low stock.")

if __name__ == "__main__":
    debug_db()
