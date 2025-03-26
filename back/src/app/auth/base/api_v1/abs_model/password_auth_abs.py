from abc import ABC


class PasswordAuthABC(ABC):
    def verify_password(self, *args, **kwargs):
        ...

    def get_hash_password(self, *args, **kwargs):
        ...
