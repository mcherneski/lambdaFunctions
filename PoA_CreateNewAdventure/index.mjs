import { GeoDataManagerConfiguration, GeoDataManager } from 'dynamodb-geo-v3'
import { DynamoDB } from '@aws-sdk/client-dynamodb'

import crypto from 'crypto'

const ddb = new DynamoDB()
const geoConfig = new GeoDataManagerConfiguration(ddb, 'ProofOfAdventure_Locations')
const geoTableManager = new GeoDataManager(geoConfig)

export const handler = async (event, callback) => {
  console.log(event)
  const rangeKey = crypto.randomUUID().toString().replace(/-/g, '')

  try {
    const res = await geoTableManager.putPoint({
      RangeKeyValue: { S: rangeKey },
      GeoPoint: {
        longitude: event.locationLng,
        latitude: event.locationLat
      },
      PutItemInput: {
        Item: {
          adventureName: { S: event.adventureName },
          locationName: { S: event.locationName },
          adventureType: { S: event.adventureType },
          tokenImage: { S: event.tokenImage },
        }
      }
    })
    console.log("Response Received")
    console.log(res)

    return {
      statusCode: 200,
      body: JSON.stringify('Item added to table!')
    }
    
  } catch (err) {
    callback("[InternalServerError] Server error, adventure not added.")
  }

  return {
    statusCode: 200,
    body: JSON.stringify(res)
  }
}