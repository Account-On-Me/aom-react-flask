import logging

from pydantic_settings import SettingsConfigDict

from configs.middleware import MiddlewareConfig

from .basic import BasicConfig

logger = logging.getLogger(__name__)


class AomConfig(
    BasicConfig,
    MiddlewareConfig,
):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
