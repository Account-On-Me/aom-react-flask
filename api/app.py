from app_factory import create_app
from configs import aom_config

if not aom_config.DEBUG:
    from gevent import monkey

    monkey.patch_all()

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=aom_config.PORT)
