import logging

from beanie import DeleteRules

from models.account import Account


class AccountService:
    @staticmethod
    async def get_all_accounts():
        return await Account.find_all(fetch_links=True).to_list()

    @staticmethod
    async def get_account(account_id):
        return await Account.find_one(account_id, fetch_links=True)

    @staticmethod
    async def create_account(data: Account):
        return await data.save()

    @staticmethod
    async def delete_account(account_id):
        account = await Account.find_one(account_id)
        if account:
            await account.delete(link_rule=DeleteRules.DELETE_LINKS)
            return account
        return None

    @staticmethod
    def validate_account(data):
        try:
            account = Account.model_validate(data)
            return account
        except Exception:
            logging.exception("Error when validating account")
            raise ValueError("Invalid account data")
