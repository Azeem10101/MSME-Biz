import os
from dotenv import load_dotenv

load_dotenv()
import json
import google.generativeai as genai
from pydantic import ValidationError
from typing import Dict, Any
from schemas import (
    SaleEntry, ExpenseEntry, InventoryUpdate, 
    SummaryQuery, InsightQuery, GeneralQuery, InventoryQuery, StockPurchase, UnknownIntent,
    AssistantResponse
)

SYSTEM_PROMPT = """You are BizAssist, a professional AI business assistant for Indian MSMEs (Micro, Small, and Medium Enterprises). You help business owners track sales, expenses, inventory, and provide insights.

## YOUR CAPABILITIES
1. **Record Sales**: When user mentions selling products with prices
2. **Record Expenses**: When user mentions spending money on business costs
3. **Update Inventory**: When user mentions using/consuming items (no price mentioned)
4. **Restock Inventory**: When user mentions buying stock for the business
5. **Answer Queries**: About business performance, analytics, inventory levels
6. **General Help**: Answer business-related questions

## INTENT CLASSIFICATION RULES

### SALE_ENTRY - Use when:
- User mentions selling WITH price (e.g., "Sold 5 notebooks for 500", "Becha 10 packet doodh 600 mein")
- Keywords: sold, sale, becha, bikri, earned, revenue + price

### EXPENSE_ENTRY - Use when:
- User mentions spending money on business (e.g., "Paid 2000 for electricity", "Bijli bill 1500")
- Keywords: paid, spent, expense, kharcha, bill + amount

### INVENTORY_UPDATE - Use when:
- User mentions using/consuming items WITHOUT price (e.g., "Used 5 packets", "10 notebooks khatam")
- This is for DEDUCTING stock (quantity should be NEGATIVE)
- Keywords: used, consumed, khatam, finished, broken

### STOCK_PURCHASE - Use when:
- User mentions BUYING stock FOR the business (e.g., "Bought 50 milk for 2000", "Restocked notebooks")
- This ADDS to inventory AND records as expense
- Keywords: bought, purchased, restocked, refilled, liya

### INVENTORY_QUERY - Use when:
- User asks about current stock levels (e.g., "How much milk?", "Kitna stock hai?", "Check inventory")
- Keywords: how much, stock, inventory, kitna, available

### SUMMARY_QUERY - Use when:
- User asks about business performance (e.g., "How am I doing?", "Show profits", "Aaj ki kamai")
- Keywords: profit, revenue, performance, summary, analytics, numbers, kamai, munafa

### INSIGHT_QUERY - Use when:
- User asks for specific insights (e.g., "Best selling product?", "Top customer?")
- Keywords: best, top, highest, trending, popular

### GENERAL_QUERY - Use when:
- User asks general business questions (e.g., "How to price products?", "What can you do?")
- Provide helpful, professional advice

### UNKNOWN - Use when:
- Cannot understand the request or missing critical information
- ALWAYS provide a helpful message suggesting what the user can try

## FEW-SHOT EXAMPLES

Input: "sold 5 notebooks for 500 to ramesh"
Output: {{"intent": "SALE_ENTRY", "date": "{current_date}", "items": [{{"product_name": "notebooks", "quantity": 5, "unit_price": 100}}], "total": 500, "customer_name": "ramesh"}}

Input: "bijli bill 1500 bhara"
Output: {{"intent": "EXPENSE_ENTRY", "date": "{current_date}", "category": "Utilities", "amount": 1500, "description": "Electricity bill payment"}}

Input: "used 3 packets milk"
Output: {{"intent": "INVENTORY_UPDATE", "date": "{current_date}", "item": "milk", "quantity_change": -3}}

Input: "bought 100 notebooks for 5000"
Output: {{"intent": "STOCK_PURCHASE", "date": "{current_date}", "item_name": "notebooks", "quantity": 100, "total_cost": 5000}}

Input: "kitna milk bacha hai"
Output: {{"intent": "INVENTORY_QUERY", "item_name": "milk"}}

Input: "aaj ki kamai dikhao"
Output: {{"intent": "SUMMARY_QUERY", "metric": "daily_summary", "start_date": "{current_date}", "end_date": "{current_date}", "answer": "Fetching your daily summary...", "stats": {{}}}}

Input: "sabse zyada kya bikta hai"
Output: {{"intent": "INSIGHT_QUERY", "insight_type": "top_product", "answer": "Analyzing your best sellers...", "stats": {{}}}}

Input: "what can you help me with"
Output: {{"intent": "GENERAL_QUERY", "answer": "I can help you with:\\n\\n📊 **Track Sales**: Tell me what you sold and for how much\\n💰 **Record Expenses**: Log your business costs\\n📦 **Manage Inventory**: Update stock levels\\n📈 **Analytics**: View your business performance\\n\\nTry saying: \\"Sold 5 notebooks for 500\\" or \\"Show my analytics\\""}}

## CRITICAL RULES
1. **Output ONLY valid JSON** - No explanations, no markdown, just the JSON object
2. **Use {current_date} for today's date** unless user specifies another date
3. **Preserve original language** in product names and descriptions
4. **Calculate totals correctly**: total = sum of (quantity × unit_price) for each item
5. **For INVENTORY_UPDATE, quantity_change should be NEGATIVE** (items are being removed)
6. **Always provide helpful answers** - Never leave users confused

Current Date: {current_date}
"""

class MSMEAssistant:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            self.model = None

    def process_message(self, message: str, current_date: str, history: list = None) -> Dict[str, Any]:
        if not self.model:
            return {
                "intent": "GENERAL_QUERY",
                "answer": "⚠️ AI service not configured. Please check your API key."
            }

        try:
            # Build context from recent history
            history_context = ""
            if history and len(history) > 0:
                history_context = "\n## Recent Conversation:\n"
                for entry in history[-6:]:  # Last 6 messages for context
                    role = "User" if entry.get("role") == "user" else "Assistant"
                    content = entry.get("text", "")[:200]  # Truncate long messages
                    history_context += f"{role}: {content}\n"
            
            prompt = SYSTEM_PROMPT.format(current_date=current_date)
            full_prompt = f"{prompt}\n{history_context}\n## Current User Message:\n{message}\n\n## Your JSON Response:"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.05,  # Lower temperature for more consistent outputs
                )
            )
            
            # Robust JSON extraction
            text = response.text.strip()
            
            # Remove any markdown code fences
            if text.startswith("```"):
                lines = text.split("\n")
                text = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
            
            # Find JSON object
            start = text.find("{")
            end = text.rfind("}")
            
            if start != -1 and end != -1 and end > start:
                json_str = text[start:end+1]
                data = json.loads(json_str)
            else:
                # Fallback: try parsing the whole text
                data = json.loads(text)
            
            # Validate and return
            validated_data = self._validate_data(data)
            return validated_data.model_dump()

        except json.JSONDecodeError as e:
            return {
                "intent": "GENERAL_QUERY",
                "answer": f"I understood your request but had trouble processing it. Could you try rephrasing? For example:\n\n• \"Sold 5 items for 500\"\n• \"Show my analytics\"\n• \"Check inventory\""
            }
        except Exception as e:
            return {
                "intent": "GENERAL_QUERY", 
                "answer": f"I'm having trouble understanding. Try saying something like:\n\n📊 \"Show my analytics\"\n💰 \"Sold 10 notebooks for 1000\"\n📦 \"Check inventory\""
            }

    def _validate_data(self, data: Dict[str, Any]) -> AssistantResponse:
        intent = data.get("intent", "UNKNOWN")
        try:
            if intent == "SALE_ENTRY":
                return SaleEntry(**data)
            elif intent == "EXPENSE_ENTRY":
                return ExpenseEntry(**data)
            elif intent == "INVENTORY_UPDATE":
                return InventoryUpdate(**data)
            elif intent == "SUMMARY_QUERY":
                return SummaryQuery(**data)
            elif intent == "INSIGHT_QUERY":
                return InsightQuery(**data)
            elif intent == "GENERAL_QUERY":
                return GeneralQuery(**data)
            elif intent == "INVENTORY_QUERY":
                return InventoryQuery(**data)
            elif intent == "STOCK_PURCHASE":
                return StockPurchase(**data)
            else:
                return UnknownIntent(
                    intent="UNKNOWN",
                    message=data.get("message", "I didn't understand that. Try: 'Sold 5 items for 500' or 'Show analytics'")
                )
        except ValidationError as e:
            # Convert validation errors to helpful messages
            return GeneralQuery(
                intent="GENERAL_QUERY",
                answer="I understood your intent but some details were unclear. Could you provide more specific information like quantities and prices?"
            )

if __name__ == "__main__":
    assistant = MSMEAssistant()
    test_cases = [
        "sold 5 notebooks for 500",
        "kitna milk hai",
        "aaj ki kamai",
        "what can you do",
        "bijli bill 1500"
    ]
    for msg in test_cases:
        print(f"\nInput: {msg}")
        result = assistant.process_message(msg, "2026-01-22")
        print(f"Output: {json.dumps(result, indent=2)}")
