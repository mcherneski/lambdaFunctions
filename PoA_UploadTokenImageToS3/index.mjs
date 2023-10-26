// Todo: Upload token image to S3 and return the url for input to dynamodb
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
        latitude: event.locationLat,
        longitude: event.locationLng
      }
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({
        results: data
      })
    }
  } catch (error) {
    console.log(error);

    return { 
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Service Error'
      })
    }
  }
};
