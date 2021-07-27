
## Install dependencies
```
npm i
```

## Run application
```
node index.js
```

## Test producer
```
curl -H "Content-Type: application/json" -X POST 'http://localhost:3000/producer' \
-d '{
    "id": 123456789,
    "name": "Nestle",
    "qty": 13,
    "status": "Reserved"
}'
```