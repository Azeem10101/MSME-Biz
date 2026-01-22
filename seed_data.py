
import sqlite3
import random
from datetime import datetime, timedelta

def seed_db():
    conn = sqlite3.connect('cms.db')
    cursor = conn.cursor()
    
    # Clear existing data (optional, but good for clean slate)
    # cursor.execute("DELETE FROM sales")
    # cursor.execute("DELETE FROM expenses")
    
    products = [
        ('Milk', 60), ('Bread', 40), ('Butter', 550), ('Cheese', 120), 
        ('Notebook', 50), ('Pen Set', 120), ('Rice 5kg', 400), ('Oil', 180)
    ]
    
    customers = ['Rohan', 'Priya', 'Amit', 'Sneha', 'Rahul', 'Vikram', 'Anjali', 'Kiran']
    
    expense_cats = ['Rent', 'Electricity', 'Tea/Snacks', 'Transport', 'Internet', 'Wages']
    
    # Generate data for last 7 days
    for i in range(7):
        day = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        
        # 3-6 Sales per day
        for _ in range(random.randint(3, 6)):
            prod, price = random.choice(products)
            qty = random.randint(1, 5)
            total = price * qty
            cust = random.choice(customers) if random.random() > 0.3 else None
            
            cursor.execute("INSERT INTO sales (date, product, quantity, price, total, customer) VALUES (?, ?, ?, ?, ?, ?)",
                           (day, prod, qty, price, total, cust))
            
        # 1-2 Expenses per day
        for _ in range(random.randint(1, 2)):
            cat = random.choice(expense_cats)
            amount = random.randint(50, 2000)
            desc = "Auto-generated expense"
            
            cursor.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)",
                           (day, cat, amount, desc))
            
    conn.commit()
    conn.close()
    print("Database seeded with rich data! 🌱")

if __name__ == "__main__":
    seed_db()
