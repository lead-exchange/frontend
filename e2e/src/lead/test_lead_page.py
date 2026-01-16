from playwright.sync_api import Page, expect

from pages.index_page import IndexPage
from lead_data import LeadData
from pages.lead_page import LeadPage


def test_create_lead(page: Page):    
    lead_page = LeadPage(page)

    lead = LeadData(
        name="Лид 123",
        commission_share=20,
        property_type="flat",
        renovation_type="COSMETIC_REPAIR",
        min_price=5000000,
        max_price=10000000,
        min_area=30,
        max_area=50,
        min_kitchen_area=5,
        max_kitchen_area=15,
        locations="Ленинградская область",
        bedrooms=2,
        description="Очень длинное описание")

    lead_page.fill_creation_form(lead)

    lead_page.submit_creation_form()

    lead_page.assert_lead(lead)

    lead_page.delete_lead()

    IndexPage(page).assert_is_index_page()
