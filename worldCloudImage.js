const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports = async function worldCloudImage(
  content = 'Nadhir Jerbi',
  fileName = 'wordcloud.png'
) {
  const url = "https://quickchart.io/wordcloud"
  const body = {
    'format': 'png',
    'width': 500,
    'height': 500,
    'fontScale': 15,
    'scale': 'linear',
    'removeStopwords': true,
    'minWordLength': 5,
    'text': content
  }
  const axiosConfig = {
    responseType: 'stream'
  }
  const imagePath = await path.resolve(process.cwd(), fileName)
  const writer = await  fs.createWriteStream(imagePath)

  // download handler
  const response = await axios.post(url, body, axiosConfig)

  response.data.pipe(writer)
  // await fs.rename('./wordcloud.png', './wordcloud.jpg', function(err) {
  //   if ( err ) console.log('ERROR: ' + err)});
    
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}