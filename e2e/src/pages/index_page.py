from pages.base_page import BasePage

class IndexPage(BasePage):
    def assert_is_index_page(self):
        self.expect_text_visible(['Лиды', 'Объекты', 'Создать лида'], exact=True)
