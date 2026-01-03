from pydantic import BaseModel

class PredictionRequest(BaseModel):
    amount: float
    hour: int
    velocity_10min: int
    avg_amount: float
    account_age_days: int
    is_new_recipient: int
    is_new_device: int
    is_new_ip: int
    rural_high_amount_flag: int

