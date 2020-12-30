aws dynamodb delete-table --table-name Defects --endpoint-url http://localhost:8000
aws dynamodb create-table --table-name Defects --attribute-definitions AttributeName=CVSS,AttributeType=S --key-schema AttributeName=CVSS,KeyType=HASH --billing-mode=PAY_PER_REQUEST --endpoint-url http://localhost:8000
 