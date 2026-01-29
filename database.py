import sqlite3
import json
from datetime import datetime

DB_NAME = "cms.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Sales Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        product TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        total REAL NOT NULL,
        customer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Expenses Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Inventory Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT UNIQUE NOT NULL,
        stock REAL NOT NULL DEFAULT 0,
        unit_price REAL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

def add_sale(entry):
    """
    entry: dict matching SaleEntry schema
    """
    conn = get_db()
    cursor = conn.cursor()
    
    for item in entry.get('items', []):
        cursor.execute('''
        INSERT INTO sales (date, product, quantity, price, total, customer)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            entry['date'],
            item['product_name'],
            item['quantity'],
            item['unit_price'],
            item['quantity'] * item['unit_price'],
            entry.get('customer_name')
        ))
    
    conn.commit()
    conn.close()

def add_expense(entry):
    """
    entry: dict matching ExpenseEntry schema
    """
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
    INSERT INTO expenses (date, category, amount, description)
    VALUES (?, ?, ?, ?)
    ''', (
        entry['date'],
        entry['category'],
        entry['amount'],
        entry.get('description')
    ))
    
    conn.commit()
    conn.close()

def get_daily_stats(date_str):
    """
    Returns aggregated stats for a specific date.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        
        # Total Sales
        cursor.execute('SELECT SUM(total), COUNT(*) FROM sales WHERE date = ?', (date_str,))
        sales_res = cursor.fetchone()
        total_sales = sales_res[0] if sales_res[0] else 0
        sales_count = sales_res[1] if sales_res[1] else 0
        
        # Total Expenses
        cursor.execute('SELECT SUM(amount), COUNT(*) FROM expenses WHERE date = ?', (date_str,))
        exp_res = cursor.fetchone()
        total_expenses = exp_res[0] if exp_res[0] else 0
        exp_count = exp_res[1] if exp_res[1] else 0
        
        return {
            "total_sales": total_sales,
            "total_expenses": total_expenses,
            "net_profit": total_sales - total_expenses,
            "transaction_count": sales_count + exp_count
        }
    finally:
        conn.close()

def update_inventory(item_name: str, quantity_change: float):
    """
    Updates stock for an item. 
    If item doesn't exist, it creates it.
    quantity_change can be positive (restock) or negative (sale).
    Item names are normalized to Title Case to prevent duplicates.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    # Normalize to Title Case for consistency
    normalized_name = item_name.strip().title()
    
    # Check if exists (case-insensitive search)
    cursor.execute('SELECT stock, item_name FROM inventory WHERE LOWER(item_name) = LOWER(?)', (normalized_name,))
    row = cursor.fetchone()
    
    if row:
        new_stock = row[0] + quantity_change
        cursor.execute('UPDATE inventory SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(item_name) = LOWER(?)', (new_stock, normalized_name))
    else:
        # Create new item with normalized name
        cursor.execute('INSERT INTO inventory (item_name, stock) VALUES (?, ?)', (normalized_name, quantity_change))
        
    conn.commit()
    conn.close()

def get_inventory_stock(item_name: str) -> float:
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT stock FROM inventory WHERE item_name = ?', (item_name,))
        row = cursor.fetchone()
        return row[0] if row else 0
    finally:
        conn.close()

def get_low_stock_items(threshold: float = 5):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT item_name, stock FROM inventory WHERE stock <= ? ORDER BY stock ASC', (threshold,))
        rows = cursor.fetchall()
        return [{"item": row[0], "stock": row[1]} for row in rows]
    finally:
        conn.close()

def get_all_inventory():
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT item_name, stock FROM inventory ORDER BY item_name ASC')
        rows = cursor.fetchall()
        return [{"item": row[0], "stock": row[1]} for row in rows]
    finally:
        conn.close()

def get_weekly_stats():
    """
    Returns last 7 days of sales and expenses.
    """
    conn = get_db()
    cursor = conn.cursor()
    
    # We need a list of last 7 dates. 
    # For simplicity, we'll query all data and aggregate in python, OR use a GROUP BY query.
    # Given SQLite, let's just pull the totals grouped by date for the last 7 entries.
    
    # Sales by Date
    cursor.execute('''
        SELECT date, SUM(total) 
        FROM sales 
        GROUP BY date 
        ORDER BY date DESC 
        LIMIT 7
    ''')
    sales_rows = cursor.fetchall()
    
    # Expenses by Date
    cursor.execute('''
        SELECT date, SUM(amount) 
        FROM expenses 
        GROUP BY date 
        ORDER BY date DESC 
        LIMIT 7
    ''')
    exp_rows = cursor.fetchall()
    conn.close()
    
    # Merge into a dict {date: {sales: 0, expenses: 0}}
    data = {}
    for r in sales_rows:
        d = r[0]
        if d not in data: data[d] = {"sales": 0, "expenses": 0}
        data[d]["sales"] = r[1]
        
    for r in exp_rows:
        d = r[0]
        if d not in data: data[d] = {"sales": 0, "expenses": 0}
        data[d]["expenses"] = r[1]
        
    # Convert to list sorted by date
    result = []
    # If no data, return empty list or maybe a dummy entry for today?
    # Let's just return what we have, sorted.
    for d in sorted(data.keys()):
        result.append({
            "date": d,
            "sales": data[d]["sales"],
            "expenses": data[d]["expenses"]
        })
        
    return result

def get_all_transactions():
    """
    Returns all transactions (sales + expenses) sorted by date DESC for CSV export.
    Format: date, type, item, amount, details
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        query = '''
            SELECT id, date, 'SALE' as type, product as item, total as amount, 'Customer: ' || COALESCE(customer, 'N/A') as details 
            FROM sales
            UNION ALL
            SELECT id, date, 'EXPENSE' as type, category as item, amount as amount, description as details 
            FROM expenses
            ORDER BY date DESC, id DESC
        '''
        cursor.execute(query)
        rows = cursor.fetchall()
        # Convert to dict while connection is still open
        return [dict(row) for row in rows]
    finally:
        conn.close()

def get_recent_transactions(limit=5):
    """
    Returns last N transaction strings for chat history.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        
        query = '''
            SELECT id, date, 'SALE' as type, product as item, total as amount, customer, quantity
            FROM sales
            UNION ALL
            SELECT id, date, 'EXPENSE' as type, category as item, amount as amount, NULL as customer, 0 as quantity
            FROM expenses
            ORDER BY date DESC, id DESC
            LIMIT ?
        '''
        
        cursor.execute(query, (limit,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def get_top_products(limit=5):
    """
    Returns top N products by total revenue.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT product, SUM(total) as revenue, SUM(quantity) as units
            FROM sales
            GROUP BY product
            ORDER BY revenue DESC
            LIMIT ?
        ''', (limit,))
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def get_top_customers(limit=5):
    """
    Returns top N customers by total revenue.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT customer, SUM(total) as revenue, COUNT(*) as visits
            FROM sales
            WHERE customer IS NOT NULL AND customer != ''
            GROUP BY customer
            ORDER BY revenue DESC
            LIMIT ?
        ''', (limit,))
        return [dict(row) for row in cursor.fetchall()]
    finally:
        conn.close()

def get_stock_for_item(item_name: str):
    """
    Returns (stock_count, last_updated) for a specific item.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        # Case insensitive partial match
        cursor.execute("SELECT item_name, stock, updated_at FROM inventory WHERE item_name LIKE ? LIMIT 1", (f"%{item_name}%",))
        return cursor.fetchone()
    finally:
        conn.close()

def get_inventory_valuation():
    """
    Returns estimated value of all inventory.
    Strategy: 
    1. Get all inventory items and stocks.
    2. For each item, find the average sale price from 'sales' table.
    3. Value = Sale Price * Stock.
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        
        # Get all inventory
        cursor.execute("SELECT item_name, stock FROM inventory WHERE stock > 0")
        inventory_items = cursor.fetchall()
        
        total_value = 0
        item_count = 0
        details = []
        
        for item_name, stock in inventory_items:
            # Get avg price for this item from sales history
            # Fuzzy match is tricky in SQL join, do subquery or separate query
            cursor.execute("SELECT AVG(price) FROM sales WHERE product LIKE ?", (f"%{item_name}%",))
            price_row = cursor.fetchone()
            
            # Default to 0 if no sales history
            avg_price = price_row[0] if price_row and price_row[0] else 0
            
            if avg_price > 0:
                value = stock * avg_price
                total_value += value
                details.append(f"{item_name}: {int(stock)} x ₹{int(avg_price)}")
            else:
                # If no price, we can't value it, but count it
                details.append(f"{item_name}: {int(stock)} (No Price History)")
                
            item_count += stock

        return {
            "total_value": total_value,
            "total_items": item_count,
            "item_breakdown": details[:5] # Top 5 for brevity
        }
    finally:
        conn.close()
