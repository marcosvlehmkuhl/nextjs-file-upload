import path from 'path'
import fs from 'fs'
import formidable from 'formidable'
import { v4 as uuidv4 } from 'uuid';

const getUploadDir = () => {
  const pathDir = path.resolve('./uploads')
  try {
    fs.mkdirSync(pathDir);
    return pathDir
  }
  catch(e) {
    if (e.code === 'EEXIST') return pathDir
    throw e
  }
}

const getRecords = () => {
  let records
  const recordsFile = path.resolve('./records.json')
  fs.stat(recordsFile, (err, file) => {
    if (!file) fs.writeFile(recordsFile, "{}", (err) => {
      if (err) throw err
      records = fs.readFileSync(path.resolve('./records.json'))
    })
  })

  return records
}

const uploadDir = getUploadDir()
const records = getRecords()

const handler = (req, res) => {
  console.log({ uploadDir })
  const form = formidable({ uploadDir })
  
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      res.end(String(err));
      return;
    }

    const fileData = fs.readFileSync(files.avatar.filepath)
    var newPath = path.resolve('./public', files.avatar.originalFilename)

    fs.writeFile(newPath, fileData, (err) => {
      if(err) return res.status(500)
      
      const filehash = uuidv4()
      const newRecords = {
        [filehash]: {
          filepath: newPath,
          creationDate: new Date()
        },
        ...records
      }


      fs.writeFile(path.resolve('./records.json'), JSON.stringify(newRecords), (err) => {
        if(err) return res.status(500);
      })

      const link = `/api/file?id=${filehash}`

      return res.send(`<a href=${link}>${filehash}</a>`)
    })
  })
}

export default handler

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};