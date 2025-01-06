from aom_app import AomApp
from models.engine import init_engine


async def init_app(app: AomApp):
    await init_engine(app)
