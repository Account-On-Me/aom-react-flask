import logging

from app_factory import create_app
from configs import aom_config

if not aom_config.DEBUG:
    from gevent import monkey

    monkey.patch_all()


class ExcludePymongoLogs(logging.Filter):
    def filter(self, record):
        return not record.name.startswith("pymongo")


logging.getLogger().addFilter(ExcludePymongoLogs())
logging.getLogger("pymongo").disabled = True
logging.getLogger("pymongo").propagate = False
logging.basicConfig(level=logging.DEBUG if aom_config.DEBUG else logging.WARNING)

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=aom_config.PORT)
