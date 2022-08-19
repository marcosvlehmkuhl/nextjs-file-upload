import fs from 'fs'
import path from 'path'
import { differenceInMinutes } from 'date-fns'

const TIME_LIMIT_MINUTS = 2

const handler = (req, res) => {
  const { id } = req.query

  const data = fs.readFileSync(path.resolve('./records.json'))
  const fileRecords = JSON.parse(data)
  const { filepath, creationDate } = fileRecords[id]

  const isExpired = differenceInMinutes(new Date(), new Date(creationDate)) > TIME_LIMIT_MINUTS
  if (isExpired) return res.status(500).send()

  const image = fs.readFileSync(filepath)

  res.writeHead(200,{'Content-type':'image/jpg'});
  return res.end(image)
}

export default handler