# app/models/enums.py
from enum import Enum

class LogTypeEnum(str, Enum):
    prompt = "prompt"
    completion = "completion"
    error = "error"
    info = "info"

class AlertChannelEnum(str, Enum):
    email = "email"
    slack = "slack"
    webhook = "webhook"
