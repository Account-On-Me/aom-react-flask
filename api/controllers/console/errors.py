from flask_restful import HTTPException


class AccountListException(HTTPException):
    description = "Error when getting account list"
    code = 500


class AccountNotFoundException(HTTPException):
    description = "Account not found"
    code = 404
