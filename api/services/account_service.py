import logging

from bunnet import DeleteRules

from models.account import Account


class AccountService:
    @staticmethod
    def get_all_accounts():
        return Account.find_all(fetch_links=True).to_list()

    @staticmethod
    def get_account(account_id):
        return Account.find_one(account_id, fetch_links=True).run()

    @staticmethod
    def create_account(data: Account):
        # save account
        account = Account.save(data)
        return account

    @staticmethod
    def delete_account(account_id: str):
        account = Account.find_one(Account.id == account_id).run()
        if account:
            account.delete(DeleteRules.DELETE_LINKS)

    @staticmethod
    def validate_account(data):
        try:
            account = Account.model_validate(data)
            return account
        except Exception:
            logging.exception("Error when validating account")
            raise ValueError("Invalid account data")
