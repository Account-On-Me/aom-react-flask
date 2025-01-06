from pydantic import Field
from pydantic_settings import BaseSettings


class BasicConfig(BaseSettings):
    DEBUG: bool = Field(
        description="Enable debug mode",
        default=False,
    )

    PORT: int = Field(
        description="Port number",
        default=5001,
    )

    CONSOLE_API_CORS_ALLOW_ORIGINS: str = Field(
        description="CORS allow origins for console api",
        default="*",
    )
