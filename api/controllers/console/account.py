import logging

from flask_restful import Resource, reqparse

from controllers.console import api
from controllers.console.errors import AccountListException, AccountNotFoundException
from services.account_service import AccountService

logger = logging.getLogger(__name__)


class AccountListApi(Resource):
    async def get(self):
        try:
            return await AccountService.get_all_accounts()
        except Exception:
            logger.exception("Error when getting account list")
            raise AccountListException()


class AccountApi(Resource):
    async def get(self, account_id):
        try:
            return await AccountService.get_account(account_id)
        except Exception:
            logger.exception("Error when getting account")
            raise AccountNotFoundException()

    async def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("data", required=True, type=AccountService.validate_account)
        args = parser.parse_args()

        try:
            account = await AccountService.create_account(args["data"])
            return account
        except Exception:
            logger.exception("Error when creating account")
            raise ValueError("Error when creating account")

    async def delete(self, account_id):
        try:
            account = await AccountService.delete_account(account_id)
            return account
        except Exception:
            logger.exception("Error when deleting account")
            raise ValueError("Error when deleting account")


api.add_resource(AccountListApi, "/account/list")
api.add_resource(AccountApi, "/account/<str:account_id>")
