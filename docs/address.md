# Address API Spec

## Create Address API

Endpoint: POST /api/contacts/:contactId/addresses

Headers:
- Authorization: Token

Request Body:
```json
{
    "street": "Jalan Mastrip no. 10",
    "city": "Jember",
    "province": "Jawa Timur",
    "country": "Indonesia",
    "postal_code": "69414"
}
```

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip no. 10",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69414"
    }
}
```

Response Body Error:
```json
{
    "errors": "Country is required"
}
```

## Update Address API

Endpoint: PUT /api/contacts/:contactId/addresses/:addressId 

Headers:
- Authorization: Token

Request Body:
```json
{
    "id": 1,
    "street": "Jalan Mastrip no. 10",
    "city": "Jember",
    "province": "Jawa Timur",
    "country": "Indonesia",
    "postal_code": "69414"
}
```

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip no. 10",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69414"
    }
}
```

Response Body Error:
```json
{
    "errors": "Contact is not found"
}
```

## Get Address API

Endpoint: GET /api/contacts/:contactId/addresses/:addressId

Headers:
- Authorization: Token

Response Body Success:
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip no. 10",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69414"
    }
}
```

Response Body Error:
```json
{
    "errors": "Contact is not found"
}
```

## List Address API

Endpoint: GET /api/contacts/:contactId/addresses

Headers:
- Authorization: Token

Response Body Success:
```json
{
    "data": [
        {
            "id": 1,
            "street": "Jalan Mastrip no. 10",
            "city": "Jember",
            "province": "Jawa Timur",
            "country": "Indonesia",
            "postal_code": "69414"
        },
        {
            "id": 2,
            "street": "Jalan Kaliurang no. 57",
            "city": "Jember",
            "province": "Jawa Timur",
            "country": "Indonesia",
            "postal_code": "69421"
        }
    ]
}
```

Response Body Error:
```json
{
    "errors": "There is no data"
}
```

## Remove Address API

Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId

Headers:
- Authorization: Token

Response Body Success:
```json
{
    "data": "OK"
}
```

Response Body Error:
```json
{
    "errors": "Contact is not found"
}
```
