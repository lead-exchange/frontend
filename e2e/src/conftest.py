import os

import pytest
from playwright.sync_api import Page


BASE_URL = os.getenv("APP_URL")


@pytest.fixture(scope="function", autouse=True)
def go_to_base_url(page: Page):
    page.goto(BASE_URL)
