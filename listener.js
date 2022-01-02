// requirement
require('make-promises-safe')
const admin = require("firebase-admin");
const { getStorage } = require('firebase-admin/storage');
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require("./token.json");
const {spawn} = require('child_process');


// Initialize firbase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-fb63e-default-rtdb.firebaseio.com/",
  storageBucket: 'test-fb63e.appspot.com'
});
// create firebase instance
const db = admin.database();
const ref = db.ref("/tweet");
const storageRef = admin.storage().bucket(`gs://test-fb63e.appspot.com/`);

// uplode firbase file function 
async function uploadFile(path, filename,pathfb) {
    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `${pathfb}/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;  
}

async function getDate() {
    const dateObject = await new Date()
    const dateTime = await dateObject.toISOString()
    return dateTime
}
let a = 0
let text =''
// fierbase relatime database listner
ref.on("child_added",async (snapshot) => {
  a++
  text = text + snapshot.val().tweet_text
  if (a==50){
        a = 0
        let text_tweet = text
        text =''
        const wc = await spawn('python', ['wordCloudGenerator.py',text_tweet,'wordcloud.png']);
        await wc.stdout.on('data',async(data)=>{
          let date = await getDate()
          await uploadFile('./wordcloud.png', `${date+(Math.floor(Math.random() *100))}.png`,'tweet wordCloud');
          await console.log('wordCloud generated')
        });
  }
  
  },
  (errorObject) => {
    console.log("The read failed: " + errorObject.name);
  }
);