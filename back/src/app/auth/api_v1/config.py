from passlib.context import CryptContext

myctx = CryptContext(schemes=["sha256_crypt", "des_crypt"], deprecated="auto")
