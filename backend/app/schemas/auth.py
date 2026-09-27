from pydantic import BaseModel, Field

class AdminLoginRequest(BaseModel):
    username: str = Field(..., description="Admin username")
    password: str = Field(..., description="Admin password")

class AdminTokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    username: str
