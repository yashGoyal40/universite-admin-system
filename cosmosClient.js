import { CosmosClient }  from '@azure/cosmos'

const endpoint = process.env.DATABASE_URI
const key = process.env.DATABASE_PK
const client = new CosmosClient({ endpoint, key });

const databaseId = process.env.DATABASE_ID
const studentContainerId = process.env.studentContainerId
const teacherContainerId = process.env.teacherContainerId

export {client,databaseId,studentContainerId,teacherContainerId}