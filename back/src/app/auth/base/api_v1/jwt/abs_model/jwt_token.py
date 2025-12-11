from abc import ABC


class JwtTokenABC(ABC):
    def encode(self, *args, **kwargs):
        ...

    def decode(self, *args, **kwargs):
        ...

    def create(self, *args, **kwargs):
        ...

    def valid_type(self, *args, **kwargs):
        ...

    def refresh(self, *args, **kwargs):
        ...

    def create_tokens(self, *args, **kwargs):
        ...
