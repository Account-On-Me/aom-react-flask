import logging
import time

from aom_app import AomApp
from configs import aom_config


def create_app_with_config() -> AomApp:
    aom_app = AomApp(__name__)
    aom_app.config.from_mapping(aom_config.model_dump())

    return aom_app


def create_app() -> AomApp:
    start_time = time.perf_counter()
    app = create_app_with_config()

    # initialize extensions
    initialize_extensions(app)

    end_time = time.perf_counter()
    if aom_config.DEBUG:
        logging.debug(f"create_app() took {end_time - start_time} seconds")
    return app


def initialize_extensions(app: AomApp):
    start_time = time.perf_counter()

    # initialize extensions
    from extensions import (
        ext_commands,
        ext_mongodb,
    )

    extensions = [
        ext_mongodb,
        ext_commands,
    ]

    for ext in extensions:
        short_name = ext.__name__.split(".")[-1]
        is_enabled = ext.is_enabled() if hasattr(ext, "is_enabled") else True
        if is_enabled:
            if aom_config.DEBUG:
                logging.debug(f"Initializing extension: {short_name}")
            ext.init_app(app)
        else:
            if aom_config.DEBUG:
                logging.debug(f"Skipping extension: {short_name}")

    end_time = time.perf_counter()
    if aom_config.DEBUG:
        logging.debug(f"initialize_extensions() took {end_time - start_time} seconds")
    return app
