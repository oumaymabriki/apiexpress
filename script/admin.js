//make oumayma briki with mail: oumaymabriki.dev@gmail.com a user with an admin role
const {MongoClient} = require('mongodb')
const url= 'mongodb://localhost:27017';
const dbName = 'basic';
const client = new MongoClient (url);
async function  dbConnect (){
    let res = await client.connect();
    db = res.db(dbName);
    return db.collection('users');
}
const insertAdmin = async() =>{
    let user = await dbConnect();  //password 'admin+123' 
    let result = await user.insert({
        fullName: 'OUMAYMA BRIKI', email :'oumaymabriki.dev@gmail.com', password :'$2y$08$b/B9kgOoMTxS5z0ZNG7aTOVJGrC.HZJUPXTcdCU7jsCa8rceZaTCu', isAdmin: true, phoneNumber:'+21628807623', photo: 'null'
    })
        console.log(result);
        if (result.acknowledged){
            console.warn("admin is inserted");  
        }
}
insertAdmin()