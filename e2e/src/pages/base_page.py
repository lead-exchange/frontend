from playwright.sync_api import Page, expect

class BasePage:
    page: Page

    def __init__(self, page: Page):
        self.page = page

    def get_by_name(self, name: str):
        return self.page.locator(f'*[name="{name}"]')
    
    def expect_text_visible(self, text: list[str], exact=False):
        for item in text:
            expect(self.page.get_by_text(item, exact=exact)).to_be_visible()
