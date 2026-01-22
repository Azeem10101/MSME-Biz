import os
from dotenv import load_dotenv

load_dotenv()
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from assistant import MSMEAssistant
import database

# Initialize DB
database.init_db()

app = FastAPI(title="MSME Assistant API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

assistant = MSMEAssistant()

class MessageRequest(BaseModel):
    message: str
    current_date: Optional[str] = None
    history: Optional[list] = None

@app.post("/process")
async def process_message(request: MessageRequest):
    print(f"DEBUG V4: Received message '{request.message}'")
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    msg_lower = request.message.lower()
    # 1. Inventory Override (Strict Priority)
    if 'inventory' in msg_lower or 'stock' in msg_lower:
        print("LOG: Inventory Override Activated")
        items = database.get_all_inventory()
        return {
            "intent": "INVENTORY_QUERY",
            "answer": "Here is your current inventory status:",
            "inventory": items,
            "view_type": "inventory_list"
        }

    # 2. History Override
    if 'history' in msg_lower or 'recent' in msg_lower or 'transactions' in msg_lower:
        print("LOG: History Override Activated")
        txs = database.get_recent_transactions(20)
        return {
            "intent": "SUMMARY_QUERY",
            "answer": "Here are your recent transactions:",
            "transactions": txs,
            "view_type": "list",
            "stats": database.get_daily_stats(datetime.now().strftime('%Y-%m-%d'))
        }

    # 3. AI Processing
    current_date = request.current_date or datetime.now().strftime("%Y-%m-%d")
    result = assistant.process_message(request.message, current_date, request.history)
    intent = result.get('intent')
    print(f"DEBUG: AI Intent {intent}")
    
    # 3. Persist Data (if applicable)
    if intent == 'SALE_ENTRY':
        database.add_sale(result)
        print(f"DB: Saved Sale {result['total']}")
        
        # AUTOMATIC STOCK DEDUCTION
        items_str = ", ".join([f"{i['quantity']}x {i['product_name']}" for i in result.get('items', [])])
        for item in result.get('items', []):
            p_name = item['product_name']
            qty = item['quantity']
            database.update_inventory(p_name, -qty)
            print(f"DB: Deducted {qty} from {p_name}")
        
        # Rich confirmation message
        customer = result.get('customer_name')
        items_str = ", ".join([f"{i['quantity']}x {i['product_name']}" for i in result.get('items', [])])
        result['answer'] = f"✅ Sale Recorded!\n\n"
        result['answer'] += f"📦 Items: {items_str}\n"
        result['answer'] += f"💰 Total: ₹{int(result['total']):,}\n"
        if customer:
            result['answer'] += f"👤 Customer: {customer}\n"
        result['answer'] += f"\nStock updated automatically"
        
    elif intent == 'EXPENSE_ENTRY':
        database.add_expense(result)
        print(f"DB: Saved Expense {result['amount']}")
        
        # Rich confirmation
        result['answer'] = f"💸 Expense Logged!\n\n"
        result['answer'] += f"📁 Category: {result.get('category', 'General')}\n"
        result['answer'] += f"💰 Amount: ₹{int(result['amount']):,}\n"
        if result.get('description'):
            result['answer'] += f"📝 Note: {result['description']}"

    elif intent == 'INVENTORY_UPDATE':
        item_name = result['item']
        qty_change = result['quantity_change']
        database.update_inventory(item_name, qty_change)
        print(f"DB: Updated Inventory {item_name} by {qty_change}")
        
        new_stock = database.get_inventory_stock(item_name)
        action = "removed from" if qty_change < 0 else "added to"
        result['answer'] = f"📦 Inventory Updated!\n\n"
        result['answer'] += f"{abs(int(qty_change))} units {action} {item_name}\n"
        result['answer'] += f"Current Stock: {int(new_stock)} units"
    
    elif intent == 'STOCK_PURCHASE':
        # 1. Update Inventory (Add stock)
        item_name = result['item_name']
        qty = result['quantity']
        database.update_inventory(item_name, qty)
        
        # 2. Add Expense
        expense_entry = {
            "date": result['date'],
            "category": "Inventory Restock",
            "amount": result['total_cost'],
            "description": f"Restock: {qty} units of {item_name}"
        }
        database.add_expense(expense_entry)
        
        # 3. Formulate Answer
        new_stock = database.get_inventory_stock(item_name)
        result['answer'] = f"✅ Restocked {item_name} (+{int(qty)}). New Stock: {int(new_stock)}.\n💸 Expense recorded: ₹{result['total_cost']}"

    # 4. Retrieve Persistent Stats (for queries)
    if intent in ['SUMMARY_QUERY', 'INSIGHT_QUERY']:
        db_stats = database.get_daily_stats(current_date)
        # OVERWRITE AI's guessed stats with real DB stats
        result['stats'] = db_stats
        print(f"DB: Injected Stats {db_stats}")
        
        if intent == 'SUMMARY_QUERY':
            # ANALYTICS MODE: Show Totals with rich formatting
            s = db_stats['total_sales']
            e = db_stats['total_expenses']
            p = db_stats['net_profit']
            c = db_stats['transaction_count']
            
            profit_emoji = "📈" if p >= 0 else "📉"
            result['answer'] = f"📊 Today's Business Summary\n\n"
            result['answer'] += f"💵 Revenue: ₹{int(s):,}\n"
            result['answer'] += f"💸 Expenses: ₹{int(e):,}\n"
            result['answer'] += f"{profit_emoji} Net Profit: ₹{int(p):,}\n\n"
            result['answer'] += f"Based on {c} transactions"
        
        elif intent == 'INSIGHT_QUERY':
            # Check what kind of insight is requested
            i_type = result.get('insight_type', '').lower()
            
            if 'product' in i_type or 'item' in i_type or 'sell' in i_type:
                top_items = database.get_top_products()
                if top_items:
                    list_str = "\n".join([f"{i+1}. {p['product']} (₹{int(p['revenue'])})" for i, p in enumerate(top_items)])
                    result['answer'] = f"🏆 **Top Selling Products**:\n\n{list_str}"
                else:
                    result['answer'] = "You haven't sold any products yet."
            
            elif 'customer' in i_type or 'buyer' in i_type:
                top_cust = database.get_top_customers()
                if top_cust:
                    list_str = "\n".join([f"{i+1}. {c['customer']} (₹{int(c['revenue'])})" for i, c in enumerate(top_cust)])
                    result['answer'] = f"💎 **Top Customers**:\n\n{list_str}"
                else:
                    result['answer'] = "No customer data available yet."
    
    elif intent == 'INVENTORY_QUERY':
        item_name = result.get('item_name')
        if item_name:
            # Specific item check
            stock_data = database.get_stock_for_item(item_name)
            if stock_data:
                # stock_data = (item_name, stock, updated_at)
                r_name = stock_data[0]
                r_stock = stock_data[1]
                result['answer'] = f"📦 **Stock Check**: {r_name}\nQuantity: **{int(r_stock)} units** available."
            else:
                result['answer'] = f"❌ Item '{item_name}' not found in inventory."
        else:
            # General valuation
            val_data = database.get_inventory_valuation()
            # val_data = {total_value, total_items, item_breakdown}
            v = val_data['total_value']
            c = val_data['total_items']
            bd = "\n".join(val_data['item_breakdown'])
            
            result['answer'] = f"💰 **Inventory Valuation**:\n\nTotal Estimated Value: **₹{int(v):,}**\nTotal Items: {int(c)}\n\n**Breakdown (Top 5)**:\n{bd}"

    # 5. Check for Low Stock (Global Check)
    low_stock_items = database.get_low_stock_items()
    if low_stock_items:
        # Create warning message
        warning = "⚠️ Low Stock Alert: " + ", ".join([f"{i['item']} ({int(i['stock'])})" for i in low_stock_items])
        
        # Append or Create 'answer' field
        if result.get('answer'):
            result['answer'] += f"\n\n{warning}"
        else:
            result['answer'] = warning

    return result

@app.get("/stats/weekly")
async def get_weekly_stats():
    try:
        data = database.get_weekly_stats()
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/top_products")
async def get_top_products_stats():
    try:
        data = database.get_top_products(10)
        return {"data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/low_stock")
async def get_low_stock_count():
    try:
        items = database.get_low_stock_items(5) # Threshold 5
        return {"count": len(items), "items": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import Response
import csv
import io

@app.get("/export/html")
async def export_html_report():
    try:
        rows = database.get_all_transactions()
        
        # Calculate totals
        total_revenue = sum(row.get('amount', 0) for row in rows if row.get('type') == 'SALE')
        total_expense = sum(row.get('amount', 0) for row in rows if row.get('type') == 'EXPENSE')
        net_balance = total_revenue - total_expense
        
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>MSME BIZ Dashboard - {datetime.now().strftime('%Y-%m-%d')}</title>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
            <style>
                :root {{
                    --black: #000000;
                    --white: #ffffff;
                    --accent-yellow: #FBFF00;
                    --accent-blue: #60a5fa;
                    --accent-green: #4ade80;
                    --border-thick: 4px solid var(--black);
                    --shadow-brutal: 8px 8px 0px var(--black);
                }}
                body {{
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f0f0;
                    padding: 60px 20px;
                    color: var(--black);
                    margin: 0;
                }}
                .report-container {{
                    width: 95%;
                    max-width: 1100px;
                    margin: 0 auto;
                    background: var(--white);
                    border: var(--border-thick);
                    box-shadow: var(--shadow-brutal);
                    padding: 50px;
                    box-sizing: border-box;
                }}
                header {{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: var(--border-thick);
                    padding-bottom: 25px;
                    margin-bottom: 40px;
                }}
                h1 {{ 
                    font-family: 'Syne', sans-serif; 
                    font-weight: 900; 
                    font-size: 3rem; 
                    margin: 0; 
                    text-transform: uppercase;
                    line-height: 1;
                }}
                .stats-grid {{
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                    margin-bottom: 50px;
                }}
                .stat-card {{
                    padding: 25px;
                    border: var(--border-thick);
                    box-shadow: 6px 6px 0px var(--black);
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-height: 120px;
                }}
                .revenue {{ background: var(--accent-green); }}
                .expense {{ background: #ff6b6b; }}
                .balance {{ background: var(--accent-blue); }}
                .stat-label {{ 
                    font-weight: 900; 
                    text-transform: uppercase; 
                    font-size: 0.9rem; 
                    display: block; 
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }}
                .stat-value {{ 
                    font-size: 2rem; 
                    font-weight: 900; 
                    word-break: break-all;
                }}
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 30px;
                }}
                th, td {{
                    border: var(--border-thick);
                    padding: 15px;
                    text-align: left;
                }}
                th {{
                    background: var(--black);
                    color: var(--white);
                    text-transform: uppercase;
                    font-weight: 900;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }}
                td {{
                    font-size: 0.95rem;
                }}
                tr:nth-child(even) {{ background: #fafafa; }}
                .no-print {{
                    position: fixed;
                    top: 20px;
                    right: 40px;
                    z-index: 1000;
                }}
                .print-btn {{
                    background: var(--accent-yellow);
                    border: var(--border-thick);
                    padding: 12px 24px;
                    font-weight: 900;
                    text-transform: uppercase;
                    cursor: pointer;
                    box-shadow: 6px 6px 0px var(--black);
                    font-family: 'Syne', sans-serif;
                    transition: all 0.2s;
                }}
                .print-btn:hover {{
                    transform: translate(-2px, -2px);
                    box-shadow: 8px 8px 0px var(--black);
                }}
                @media print {{
                    .no-print {{ display: none; }}
                    body {{ padding: 0; background: white; }}
                    .report-container {{ border: none; box-shadow: none; width: 100%; max-width: none; padding: 20px; }}
                }}
            </style>
        </head>
        <body>
            <div class="no-print">
                <button class="print-btn" onclick="window.print()">Export to PDF</button>
            </div>
            <div class="report-container">
                <header>
                    <div>
                        <h1>MSME BIZ</h1>
                        <p style="font-weight:700">Business Statement: {datetime.now().strftime('%B %d, %Y')}</p>
                    </div>
                    <div style="text-align: right; flex-shrink: 0; margin-left: 20px;">
                        <span style="font-weight: 900; background: var(--accent-yellow); padding: 5px 10px; border: 2px solid #000; white-space: nowrap; display: inline-block;">ACTIVE REPORT</span>
                    </div>
                </header>

                <div class="stats-grid">
                    <div class="stat-card revenue">
                        <span class="stat-label">Total Revenue</span>
                        <span class="stat-value">₹{total_revenue:,.2f}</span>
                    </div>
                    <div class="stat-card expense">
                        <span class="stat-label">Total Expenses</span>
                        <span class="stat-value">₹{total_expense:,.2f}</span>
                    </div>
                    <div class="stat-card balance">
                        <span class="stat-label">Net Balance</span>
                        <span class="stat-value">₹{net_balance:,.2f}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Item / Category</th>
                            <th style="text-align: right">Amount</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {"".join([f"<tr><td>{r.get('date')}</td><td><span style='font-weight:700; color:{'#10b981' if r.get('type')=='SALE' else '#ef4444'}'>{r.get('type')}</span></td><td>{r.get('item')}</td><td style='text-align: right; font-weight:700'>₹{r.get('amount', 0):,.2f}</td><td>{r.get('details')}</td></tr>" for r in rows])}
                    </tbody>
                </table>
                
                <footer style="margin-top: 60px; font-size: 0.9rem; border-top: var(--border-thick); padding-top: 30px; display: flex; justify-content: space-between; font-weight: 700;">
                    <div>
                        <span style="background: var(--black); color: var(--white); padding: 5px 10px;">MSME ASSISTANT v3.0</span>
                    </div>
                    <div style="opacity: 0.6">
                        Statement Reference: {hex(id(rows)).upper()}
                    </div>
                </footer>
            </div>
        </body>
        </html>
        """
        
        return Response(
            content=html_template,
            media_type="text/html",
            headers={
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"HTML REPORT ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export/csv")
async def export_csv():
    try:
        rows = database.get_all_transactions()
        
        # Use StringIO for CSV formatting with CRLF and QUOTE_ALL
        output = io.StringIO()
        writer = csv.writer(output, lineterminator='\r\n', quoting=csv.QUOTE_ALL)
        
        # Header
        writer.writerow(['Date', 'Type', 'Item/Category', 'Amount', 'Details'])
        
        # Data - Ensure everything is converted to string for safe CSV writing
        for row in rows:
            writer.writerow([
                str(row.get('date', '')), 
                str(row.get('type', '')), 
                str(row.get('item', '')), 
                str(row.get('amount', '')), 
                str(row.get('details', ''))
            ])
            
        csv_text = output.getvalue()
        # utf-8-sig adds the BOM which is critical for Windows Excel
        csv_bytes = csv_text.encode('utf-8-sig')
        
        return Response(
            content=csv_bytes,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=report.csv",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"CRITICAL EXPORT ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "gemini-2.0-flash"}

if __name__ == "__main__":
    import uvicorn
    # Enable reload=True for better development experience
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
