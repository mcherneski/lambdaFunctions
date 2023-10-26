import { GeoDataManagerConfiguration, GeoDataManager } from 'dynamodb-geo-v3'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

const ddb = new DynamoDB()
const geoConfig = new GeoDataManagerConfiguration(ddb, 'ProofOfAdventure_Locations')
const geoTableManager = new GeoDataManager(geoConfig)

export const handler = async (event) => {
  console.log(event)
  try {
    const data = await geoTableManager.queryRadius({
      RadiusInMeter: 1000,
      CenterPoint: {
        latitude: event.Latitude,
        longitude: event.Longitude
      }
    })

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({results: data})
    }
  } catch (error) {
    console.error(error);
    return { 
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({message: error.message})
    }
  }
};
