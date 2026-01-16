from dataclasses import dataclass


@dataclass
class LeadData:
    name: str
    commission_share: int
    property_type: str
    renovation_type: str
    min_price: int
    max_price: int
    min_area: int
    max_area: int
    min_kitchen_area: int
    max_kitchen_area: int
    locations: str
    bedrooms: int
    description: str
