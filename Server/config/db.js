var getDBAddr = () => {
  if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    //openshift上的db
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
    return connection_string;
  }
  else{
    //本地的DB
    return 'mongodb://localhost:27017/ISFinal';
	  //return 'mongodb://192.168.1.5:27017/battlemaster';
  }
}

module.exports = {
  'url' : getDBAddr()
};