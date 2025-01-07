from bunnet import Link
from pydantic import BaseModel, Field


class Paycheck(BaseModel):
    candidate: list[Link["Account"]]
    should_pay: float = Field(..., description="Amount to pay", alias="shouldPay")
