import json
from unittest.mock import AsyncMock, MagicMock

class MockCollection:
    def __init__(self, data=None):
        self.data = data or []

    async def insert_one(self, document):
        self.data.append(document)
        return MagicMock(inserted_id=document.get('_id', 'mock_id'))

    def find(self, query=None, projection=None):
        mock_cursor = MagicMock()

        # Simple filtering for search
        filtered_data = self.data
        if query and '$or' in query:
            search_terms = []
            for condition in query['$or']:
                for field, val in condition.items():
                    if isinstance(val, dict) and '$regex' in val:
                        search_terms.append((field, val['$regex'].lower()))

            filtered_data = [
                item for item in self.data
                if any(term[1] in str(item.get(term[0], '')).lower() for term in search_terms)
            ]
        elif query and 'brand' in query:
             # simple brand filter
             brand_val = query['brand']
             if isinstance(brand_val, dict) and '$regex' in brand_val:
                 brand_regex = brand_val['$regex'].replace('^', '').replace('$', '').lower()
                 filtered_data = [item for item in self.data if brand_regex in str(item.get('brand', '')).lower()]

        self.last_filtered_data = filtered_data

        mock_cursor.sort.return_value = mock_cursor
        mock_cursor.skip.return_value = mock_cursor
        mock_cursor.limit.return_value = mock_cursor

        async def to_list(length=None):
            return filtered_data[:length] if length else filtered_data

        mock_cursor.to_list = to_list
        return mock_cursor

    async def count_documents(self, query):
        if hasattr(self, 'last_filtered_data') and query:
            return len(self.last_filtered_data)
        return len(self.data)

    async def find_one(self, query, projection=None):
        for item in self.data:
            if all(item.get(k) == v for k, v in query.items() if not k.startswith('$')):
                return item
        return None

class MockDB:
    def __init__(self):
        self.featured_deals = MockCollection()
        self.lots = MockCollection()
        self.lease_programs_parsed = MockCollection()
        self.users = MockCollection()
