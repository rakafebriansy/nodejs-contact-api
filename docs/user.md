# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body:

```json
{
    "username": "raka",
    "password": "raka123",
    "name": "Raka Febrian Syahputra"
}
```

Response Body Success:

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian Syahputra"
    }
}
```

Response Body Error:

```json
{
    "errors": "Username already registered"
}
```

## Login User API

Endpoint: POST /api/users/login

Request Body:

```json
{
    "username": "raka",
    "password": "raka123"
}
```

Response Body Success:

```json
{
    "data": {
        "token": "unique-token"
    }
}
```

Response Body Error:

```json
{
    "errors": "Username or password wrong"
}
```

## Update User API

Endpoint: PATCH /api/users/current

Headers:
- Authorization: token

Request Body:

```json
{
    "name": "Raka Febrian Syahputra Update", //optional
    "password": "new password" //optional
}
```

Response Body Success:

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian Syahputra Update"
    }
}
```

Response Body Error:

```json
{
    "errors": "Name length max 100"
}
```

## Get User API

Endpoint: GET /api/users/current

Headers:
- Authorization: token

Response Body Success:

```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian Syahputra"
    }
}
```

Response Body Error:

```json
{
    "errors": "Unauthorized"
}
```

## Logout User API

Endpoint: DELETE /api/users/logout

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
    "errors": "Unauthorized"
}
```