from beanie import Link
from pydantic import BaseModel, Field

from models.account import Account


class Paycheck(BaseModel):
    candidate: list[Link[Account]]
    should_pay: float = Field(..., description="Amount to pay", alias="shouldPay")
