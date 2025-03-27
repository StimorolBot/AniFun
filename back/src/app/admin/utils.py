import base64


def get_base64(data) -> str:
    return base64.b64encode(data).decode()
