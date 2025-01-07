from pydantic import Field
from pydantic_settings import BaseSettings


class MongoConfig(BaseSettings):
    MONGO_URI: str = Field(
        description="MongoDB URI",
    )


class MiddlewareConfig(
    MongoConfig,
):
    pass
