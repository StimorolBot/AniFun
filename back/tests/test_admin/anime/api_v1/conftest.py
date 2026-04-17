import pytest

from main import app
from src.app.admin.utils import check_access


@pytest.fixture(scope="module", autouse=True)
def override_admin_check_access():
    app.dependency_overrides[check_access] = lambda: True
    yield
    app.dependency_overrides.pop(check_access, None)
