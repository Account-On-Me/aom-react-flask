from aom_app import AomApp
from models.engine import init_engine


def init_app(app: AomApp):
    init_engine(app)
