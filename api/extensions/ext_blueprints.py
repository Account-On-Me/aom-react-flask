from aom_app import AomApp
from configs import aom_config


def init_app(app: AomApp):
    # register blueprints
    from flask_cors import CORS

    from controllers.console import bp as console_bp

    CORS(
        console_bp,
        resources={r"/*": {"origins": aom_config.CONSOLE_API_CORS_ALLOW_ORIGINS}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-App-Code"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        expose_headers=["X-Version", "X-Env"],
    )
    app.register_blueprint(console_bp)
