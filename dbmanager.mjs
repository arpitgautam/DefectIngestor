import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

class DBManager {

    constructor(reg, ep) {
        const config = {
            region: reg
        };

        if (ep) {
            config.endpoint = ep;
        }
        this._client = new DynamoDBClient(config);
    }

    async _send(command) {
        return await this._client.send(command);
    }

    async putItems(items) {
        var params = {
            RequestItems: {
                "Defects": [
                    {
                        PutRequest: {
                            Item: {
                                'CVSS': { S: 'XYZ123' },
                                'Product': { S: 'JBoss' },
                                'Number': { S: '123455' },
                                'Description': { S: 'dummy' },
                            }
                        }
                    }
                ]
            }
        };

        //break them in batches of 20, dont know how
        params.RequestItems.Defects = [];
        items.forEach(item => {
            let record = {
                PutRequest: {
                    'Item': {
                        'CVSS': { S: item.cvss },
                        'Product': { S: item.product },
                        'Number': { S: item.number },
                        'Description': { S: item.description },
                    }
                }
            }
            params.RequestItems.Defects.push(record);
        });

        const command = new BatchWriteItemCommand(params);
        const data = await this._send(command);
    }

}

export default DBManager;