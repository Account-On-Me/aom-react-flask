import importlib
import inspect
import logging
import pkgutil

from beanie import Document, View, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from aom_app import AomApp
from configs import aom_config

logger = logging.getLogger(__name__)


async def init_engine(app: AomApp):
    client = AsyncIOMotorClient(aom_config.MONGO_URI)

    # find all DocumentModel
    document_models = []
    for _, module_name, _ in pkgutil.iter_modules(["models"]):
        module = importlib.import_module(f"models.{module_name}")
        for name, obj in inspect.getmembers(module):
            if aom_config.DEBUG:
                logger.debug(f"Found document: {name}")
            if inspect.isclass(obj) and issubclass(obj, Document) and obj is not Document:
                document_models.append(obj)
            if inspect.isclass(obj) and issubclass(obj, View) and obj is not View:
                document_models.append(obj)

    await init_beanie(
        database=client.db_name,
        document_models=document_models,
        recreate_views=True,
    )
