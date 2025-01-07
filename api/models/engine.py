import importlib
import logging
import pkgutil

from bunnet import Document, View, init_bunnet
from pymongo import MongoClient

from aom_app import AomApp
from configs import aom_config

logger = logging.getLogger(__name__)


def init_engine(app: AomApp):
    client = MongoClient(aom_config.MONGO_URI)

    # Find all Document and View models
    document_models = []
    for _, module_name, _ in pkgutil.iter_modules(["models"]):
        module = importlib.import_module(f"models.{module_name}")

        # Iterate through attributes in the module
        for attr_name in dir(module):
            attr = getattr(module, attr_name)
            # Check if the attribute is a class
            if isinstance(attr, type):
                # Check if it's a subclass of Document or View
                if issubclass(attr, Document) and attr is not Document:
                    # Debug logging
                    if aom_config.DEBUG:
                        logger.debug(f"Found Document: {attr_name} in module: {module.__name__}")
                    document_models.append(attr)
                elif issubclass(attr, View) and attr is not View:
                    # Debug logging
                    if aom_config.DEBUG:
                        logger.debug(f"Found View: {attr_name} in module: {module.__name__}")
                    document_models.append(attr)

    init_bunnet(
        database=client.db_name,
        document_models=document_models,
        recreate_views=True,
    )
