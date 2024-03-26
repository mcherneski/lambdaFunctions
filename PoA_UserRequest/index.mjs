import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as crypto from 'crypto';

const client = new DynamoDBClient({});

export const handler = async (event) => {
   const eventBody = await JSON.parse(event.body)
   let response
   const {Name, Type, Location, Latitude, Longitude, Altitude} = eventBody.newRequestData
   console.log(eventBody.newRequestData)
   const UUID = crypto.randomUUID()
   const base64UUID = Buffer.from(UUID).toString('base64')
   
   try{
      console.log('UUID is: ', base64UUID)
      const command = new PutItemCommand({
         TableName: 'proof-of-adventure_UserRequests',
         Item: {
            requestId: { S: base64UUID },
            adventureName: { S: Name },
            adventureType: { S: Type },
            locationName: { S: Location },
            Latitude: { N: String(Latitude) },
            Longitude: { N: String(Longitude) },
            Altitude: { N: String(Altitude) }
         }
      })

      const data = await client.send(command)
      console.log('PutItemCommand output:', data)

      response = {
         statusCode: 200,
         headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
         },
         body: JSON.stringify(data)
      }

   } catch (error) {
      console.log(error)

      response = {
         statusCode: 500,
         headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
         },
         body: JSON.stringify('You done fucked up.')
      }
   }

   return response;
}



