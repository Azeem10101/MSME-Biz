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

SYSTEM_PROMPT = """Role: You are an AI business assistant for Indian micro, small, and medium enterprises (MSMEs). Your job is to parse informal, multilingual business messages and extract structured data. You must output only a single JSON object (no additional text, no lists, no code fences) that strictly follows one of the defined schemas. Do not invent or guess any missing values.

Multi-language Input: Accept user input in English, Hindi, Hinglish, or other Indian languages. CRITICAL: Preserve the original script (e.g. Devanagari) for product names, categories, and descriptions. Do not transliterate or romanize non-English text.

Intent Classification: SALE_ENTRY, EXPENSE_ENTRY, INVENTORY_UPDATE, STOCK_PURCHASE, SUMMARY_QUERY, INSIGHT_QUERY, GENERAL_QUERY, INVENTORY_QUERY, or UNKNOWN.

Output Format: ONLY JSON. No extra words or markdown code fences.

Schemas:
SALE_ENTRY: {{intent: "SALE_ENTRY", date: "YYYY-MM-DD", items: [{{product_name: str, quantity: num, unit_price: num}}], total: num, customer_name: optional str}}
EXPENSE_ENTRY: {{intent: "EXPENSE_ENTRY", date: "YYYY-MM-DD", category: str, amount: num, description: optional str}}
INVENTORY_UPDATE: {{intent: "INVENTORY_UPDATE", date: "YYYY-MM-DD", item: str, quantity_change: num}}
STOCK_PURCHASE: {{intent: "STOCK_PURCHASE", date: "YYYY-MM-DD", item_name: str, quantity: num, total_cost: num (optional, 0 if unknown)}}
INVENTORY_QUERY: {{intent: "INVENTORY_QUERY", item_name: optional str}}
SUMMARY_QUERY: {{intent: "SUMMARY_QUERY", metric: str, start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD", answer: str, stats: dict}}
INSIGHT_QUERY: {{intent: "INSIGHT_QUERY", insight_type: str, start_date: optional "YYYY-MM-DD", end_date: optional "YYYY-MM-DD", answer: str, stats: dict}}
GENERAL_QUERY: {{intent: "GENERAL_QUERY", answer: str}}
UNKNOWN: {{intent: "UNKNOWN", message: str}}

Current Date: {current_date}

Instructions:
1. Parse the input and map to one intent. 
   - IMPORTANT: Use SUMMARY_QUERY for any questions about performance, money, revenue, profit, or "how am I doing?". 
   - Even informal phrases like "show me the numbers" MUST use SUMMARY_QUERY.
   - If user asks about STOCK LEVELS ("How much milk?", "Do I have notebooks?", "Inventory value"), use INVENTORY_QUERY.
   - If user mentions "Sold" or "Used" but NO price/money, use INVENTORY_UPDATE (negative quantity).
   - If user mentions "Bought", "Restocked", "Refilled", "Added" items like ("Bought 50 milk", "Refilled 100 notebooks"), use STOCK_PURCHASE. Set total_cost=0 if no price mentioned.
2. For SUMMARY_QUERY and INSIGHT_QUERY:
   - Calculate the exact answer from Conversation History structured results (System Match).
   - For SALE_ENTRY: Sum the "total" field.
   - For EXPENSE_ENTRY: Sum the "amount" field.
   - Populate the "answer" field with a professional summary (e.g., "Total revenue is ₹640..."). THIS WILL BE SHOWN TO THE USER.
   - FOR INSIGHT_QUERY: If user asks about "best customer", "top item", set insight_type="top_product" or "top_customer". The backend contains the real data, so you can set "answer" to "Analyzing your data...".
   - MANDATORY: Populate the "stats" field with raw numbers: {{"total_sales": num, "total_expenses": num, "net_profit": num, "transaction_count": num}}.
   - net_profit = total_sales - total_expenses.
   - transaction_count is the number of relevant entries (sales/expenses) found in current session.
3. Ensure dates are ISO YYYY-MM-DD.
4. numeric fields must be numbers.
5. If missing critical info, return UNKNOWN with a message.
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
                "intent": "UNKNOWN",
                "message": "API Key not configured."
            }

        try:
            # Inject history into system prompt with structured data
            history_context = ""
            if history:
                history_context = "\nConversation History (Simplified):\n"
                for entry in history:
                    role = "User" if entry.get("role") == "user" else "Assistant"
                    content = entry.get("text", "")
                    result = entry.get("result")
                    
                    history_context += f"{role}: {content}\n"
                    if result:
                        history_context += f"System Match: {json.dumps(result)}\n"
            
            prompt = SYSTEM_PROMPT.format(current_date=current_date)
            full_prompt = f"{prompt}\n{history_context}\nUser Message: {message}"
            
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,
                )
            )
            
            # Robust JSON extraction
            text = response.text.strip()
            
            # Find the first { and last }
            start = text.find("{")
            end = text.rfind("}")
            
            if start != -1 and end != -1:
                json_str = text[start:end+1]
                data = json.loads(json_str)
            else:
                # If no braces found, maybe it's raw text?
                data = json.loads(text)
            
            # Validate against schemas
            validated_data = self._validate_data(data)
            return validated_data.model_dump()

        except Exception as e:
            return {
                "intent": "UNKNOWN",
                "message": f"Error: {str(e)}"
            }

    def _validate_data(self, data: Dict[str, Any]) -> AssistantResponse:
        intent = data.get("intent")
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
                    message=data.get("message", "Unknown or invalid intent.")
                )
        except ValidationError as e:
            return UnknownIntent(
                intent="UNKNOWN",
                message=f"Validation failed: {str(e)}"
            )

if __name__ == "__main__":
    # Quick test
    assistant = MSMEAssistant()
    sample_msg = "show me the numbers"
    # Note: Use the current date from additional metadata in a real scenario
    result = assistant.process_message(sample_msg, "2026-01-14")
    print(json.dumps(result, indent=2))
