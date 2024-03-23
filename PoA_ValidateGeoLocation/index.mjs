import { GeoDataManagerConfiguration, GeoDataManager } from 'dynamodb-geo-v3'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

const ddb = new DynamoDB()
const geoConfig = new GeoDataManagerConfiguration(ddb, 'ProofOfAdventure_Locations')
const geoTableManager = new GeoDataManager(geoConfig)

export const handler = async (event) => {
  const eventBody = JSON.parse(event.body)
  let responseBody;
  let statusCode;

  const {Longitude, Latitude} = eventBody
  console.log(Latitude, Longitude)

  try{
    const data = await geoTableManager.queryRadius({
      RadiusInMeter: 10000,
      CenterPoint: {
        latitude: Latitude,
        longitude: Longitude
      }
    })

    console.log(data)

    if (data.length > 0) {
      console.log('GeoLocation found for specified image!')
      responseBody = {
        message: 'Location found.',
        results: data[0]
      }
      statusCode = 200
    } else {
      responseBody = {
        message: 'Location not found.',
        results: []
      }
      statusCode = 200
    }
  } catch {
    responseBody = {
      message: 'Error calling API.',
      results: []
    }
    statusCode = 500
  }
  
  const response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(responseBody)
  }
  return response;
};
