if(process.env.NODE_ENV == 'production'){
module.exports = {
  mongoURI: 'mongodb://skotra:Sree420@ds115360.mlab.com:15360/vidjot-prod'
}
}else{
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  } 
}
