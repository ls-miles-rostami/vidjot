if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://miles:miles@ds031531.mlab.com:31531/vidjot-prod'
  }
}else{
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  }
}