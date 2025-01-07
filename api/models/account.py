from datetime import datetime
from typing import Optional

from bunnet import Document, Link
from pydantic import Field


class PaymentRecord(Document):
    amount: float
    date: datetime
    to: Link["Account"]


class Account(Document):
    name: str
    avatar: Optional[str] = None
    email: Optional[str] = Field(None, description="Email address")
    remaining_paychecks: list["Paycheck"] = Field([], alias="remainingPaychecks")
    payment_records: list[Link["PaymentRecord"]] = Field([], alias="paymentRecords")

    def get_total_remaining_pay(self) -> float:
        return sum(p.should_pay for p in self.remaining_paychecks)
