from pydantic import Field, computed_field
from pydantic_settings import BaseSettings


class MongoConfig(BaseSettings):
    MONGO_HOST: str = Field(
        description="MongoDB host",
    )

    MONGO_USER: str = Field(
        description="MongoDB user",
    )

    MONGO_PASSWORD: str = Field(
        description="MongoDB password",
    )

    MONGO_PORT: str = Field(
        description="MongoDB port",
    )

    MONGO_DB: str = Field(
        description="MongoDB database",
    )

    MONGO_SRV_URI: str = Field(
        description="MongoDB SRV URI",
    )

    @computed_field
    def MONGO_URI(self) -> str:
        if self.MONGO_SRV_URI:
            return self.MONGO_SRV_URI
        return f"mongodb://{self.MONGO_USER}:{self.MONGO_PASSWORD}@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DB}"


class MiddlewareConfig(
    MongoConfig,
):
    pass
