import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: 'us-west-2'})

export const handler = async (event) => {
   const eventBody = JSON.parse(event.body)

   

}