import re

from flask import current_app, got_request_exception
from flask_restful import Api, http_status_message
from werkzeug.datastructures import Headers
from werkzeug.exceptions import HTTPException


class ExternalApi(Api):
    def handle_error(self, e):
        got_request_exception.send(current_app, exception=e)

        headers = Headers()
        if isinstance(e, HTTPException):
            if e.response is not None:
                res = e.get_response()
                return res

            status_code = e.code
            default_data = {
                "code": re.sub(r"(?<!^)(?=[A-Z])", "_", type(e).__name__).lower(),
                "message": getattr(e, "description", http_status_message(status_code)),
                "status": status_code,
            }

            headers = e.get_response().headers

        elif isinstance(e, ValueError):
            status_code = 400
            default_data = {
                "code": "invalid_param",
                "message": str(e),
                "status": status_code,
            }

        else:
            status_code = 500
            default_data = {
                "message": http_status_message(status_code),
            }

        # Werkzeug exceptions generate a content-length header which is added
        # to the response in addition to the actual content-length header
        # https://github.com/flask-restful/flask-restful/issues/534

        headers_to_remove = ("Content-Length", "content-length")
        for header in headers_to_remove:
            headers.pop(header, None)

        data = getattr(e, "data", default_data)

        if status_code == 400:
            if isinstance(data.get("message"), dict):
                param_key, param_value = list(data.get("message", {}).items())[0]
                data = {
                    "code": "invalid_param",
                    "message": param_value,
                    "params": param_key,
                }
            else:
                if "code" not in data:
                    data["code"] = "unknown"
            response = self.make_response(data, status_code, headers)

        else:
            if "code" not in data:
                data["code"] = "unknown"
            response = self.make_response(data, status_code, headers)

        if status_code == 401:
            response = self.unauthorized(response)

        return response
