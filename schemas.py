from typing import List, Optional, Union, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import date as DateType

class Intent(str, Enum):
    SALE_ENTRY = "SALE_ENTRY"
    EXPENSE_ENTRY = "EXPENSE_ENTRY"
    INVENTORY_UPDATE = "INVENTORY_UPDATE"
    SUMMARY_QUERY = "SUMMARY_QUERY"
    INSIGHT_QUERY = "INSIGHT_QUERY"
    GENERAL_QUERY = "GENERAL_QUERY"
    INVENTORY_QUERY = "INVENTORY_QUERY"
    SHARE_IMAGE = "SHARE_IMAGE"
    STOCK_PURCHASE = "STOCK_PURCHASE"
    UNKNOWN = "UNKNOWN"

class SaleItem(BaseModel):
    product_name: str
    quantity: float
    unit_price: float

class SaleEntry(BaseModel):
    intent: Intent = Intent.SALE_ENTRY
    date: str
    items: List[SaleItem]
    total: float
    customer_name: Optional[str] = None

class ExpenseEntry(BaseModel):
    intent: Intent = Intent.EXPENSE_ENTRY
    date: str
    category: str
    amount: float
    description: Optional[str] = None

class InventoryUpdate(BaseModel):
    intent: Intent = Intent.INVENTORY_UPDATE
    date: str
    item: str
    quantity_change: float

class StockPurchase(BaseModel):
    intent: Intent = Intent.STOCK_PURCHASE
    date: str
    item_name: str
    quantity: float
    total_cost: Optional[float] = 0  # Optional - if user doesn't specify price

class InventoryQuery(BaseModel):
    intent: Intent = Intent.INVENTORY_QUERY
    item_name: Optional[str] = None

class SummaryQuery(BaseModel):
    intent: Intent = Intent.SUMMARY_QUERY
    metric: str
    start_date: str
    end_date: str
    answer: str
    stats: Dict[str, Any]

class InsightQuery(BaseModel):
    intent: Intent = Intent.INSIGHT_QUERY
    insight_type: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    answer: str
    stats: Dict[str, Any]

class GeneralQuery(BaseModel):
    intent: Intent = Intent.GENERAL_QUERY
    answer: str

class UnknownIntent(BaseModel):
    intent: Intent = Intent.UNKNOWN
    message: str

# Union type for all possible outputs
AssistantResponse = Union[
    SaleEntry,
    ExpenseEntry,
    InventoryUpdate,
    StockPurchase,
    InventoryQuery,
    SummaryQuery,
    InsightQuery,
    GeneralQuery,
    UnknownIntent
]
