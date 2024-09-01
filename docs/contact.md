# Contact API Spec

## Create Contact API

Endpoint: POST /api/contacts

Headers:
- Authorization: token

Request Body:

```json
{
    "first_name": "Raka",
    "last_name": "Febrian",
    "email": "raka@gmail.com",
    "phone": "081234567890"
}
```

Response Body Success:

```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@gmail.com",
        "phone": "081234567890"
    }
}
```

Response Body Error:

```json
{
    "errors": "Email is not valid"
}
```

## Update Contact API

Endpoint: PUT /api/contacts/:id

Headers:
- Authorization: token

Request Body:

```json
{
    "first_name": "Raka",
    "last_name": "Febrian",
    "email": "raka@gmail.com",
    "phone": "081234567890"
}
```

Response Body Success:

```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@gmail.com",
        "phone": "081234567890"
    }
}
```

Response Body Error:

```json
{
    "errors": "Email is not valid"
}
```

## Get Contact API

Endpoint: GET /api/contacts/:id

Headers:
- Authorization: token

Response Body Success:

```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@gmail.com",
        "phone": "081234567890" 
    }
}
```

Response Body Error:

```json
{
    "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint: GET /api/contacts

Headers:
- Authorization: token

Query params:
- name: Search by first_name or last_name, using like, optional
- email: Search by email, using like, optional
- phone: Search by phone, using like, optional
- page: number of page, default 1
- size: size per page, default 10

Response Body Success:

```json
{
    {
    "data": [
        {
            "id": 1,
            "first_name": "Raka",
            "last_name": "Febrian",
            "email": "raka@gmail.com",
            "phone": "081234567890" 
        },
        {
            "id": 2,
            "first_name": "Azizi",
            "last_name": "Asadel",
            "email": "zee@gmail.com",
            "phone": "082233557890" 
        }
    ],
    "paging": {
        "page": 1,
        "total_page": 1,
        "total_item": 2
    }
}
}
```

Response Body Error:

```json
{
    "errors": "There is no data"
}
```

## Remove Contact API

Endpoint: DELETE /api/contacts/:id

Headers:
- Authorization: token

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
