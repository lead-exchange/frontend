from lead.lead_data import LeadData
from pages.base_page import BasePage

class LeadPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        page.get_by_text("Создать лида", exact=True).click()

    def submit_creation_form(self):
        self.page.get_by_text("Создать лида").click()
    
    def delete_lead(self):
        self.page.get_by_text("Удалить").click()
    
    def assert_lead(self, lead: LeadData):
        self.expect_text_visible([
            lead.name,
            f'{lead.bedrooms}-комн.',
            f'{lead.min_price // 1_000_000} млн',
            f'{lead.max_price // 1_000_000} млн',
            f'{lead.min_area} - {lead.max_area}',
            f'{lead.min_kitchen_area} - {lead.max_kitchen_area}',
            lead.locations,
            lead.description,
            f'Агент покупателя: {lead.commission_share}%',
            f'Агент продавца: {100 - lead.commission_share}%',
        ])
    
    def fill_creation_form(self, lead: LeadData):
        self.get_by_name("name").fill(lead.name)

        self.get_by_name("commissionShare").fill(str(lead.commission_share))

        self.get_by_name("propertyType").select_option(lead.property_type)
        
        self.get_by_name("renovationType").select_option(lead.renovation_type)
        
        self.get_by_name("minPrice").fill(str(lead.min_price))

        self.get_by_name("maxPrice").fill(str(lead.max_price))
        
        self.get_by_name("minArea").fill(str(lead.min_area))
        
        self.get_by_name("maxArea").fill(str(lead.max_area))

        self.get_by_name("minKitchenArea").fill(str(lead.min_kitchen_area))
        
        self.get_by_name("maxKitchenArea").fill(str(lead.max_kitchen_area))
        
        self.get_by_name("locations").fill(lead.locations)
        
        self.get_by_name("bedrooms").fill(str(lead.bedrooms))
        
        self.get_by_name("description").fill(lead.description)
