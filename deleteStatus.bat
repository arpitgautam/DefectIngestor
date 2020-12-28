aws dynamodb delete-table --table-name Status --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name Status --attribute-definitions AttributeName=Id,AttributeType=N --key-schema AttributeName=Id,KeyType=HASH --billing-mode=PAY_PER_REQUEST --endpoint-url http://localhost:8000
 