import { GeoDataManagerConfiguration, GeoDataManager } from 'dynamodb-geo-v3'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

const ddb = new DynamoDB()
const geoConfig = new GeoDataManagerConfiguration(ddb, 'ProofOfAdventure_Locations')
const geoTableManager = new GeoDataManager(geoConfig)

export const handler = async (event) => {
  console.log(event)
  try {
    const body = JSON.parse(event.body)
    const { Longitude, Latitude } = body
    
    let response = await geoTableManager.queryRadius({
      RadiusInMeter: 1000,
      CenterPoint: {
        latitude: Latitude,
        longitude: Longitude
      }
    })
    console.log(response)

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    }
  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({message: error.message})
    }
  }
};
