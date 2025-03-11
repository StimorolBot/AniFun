from authlib.integrations.starlette_client import OAuth
from .config import settings

oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.CLIENT_ID,
    authorization_url = settings.AUTH_URI,
    client_secret=settings.CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    redirect_uri= settings.REDIRECT_URIS,
    client_kwargs={
        'scope': 'openid email profile',
        "redirect_url": settings.REDIRECT_URIS
    }
)


TOKEN_URI: str
AUTH_PROVIDER_X509_CERT_URL: str


