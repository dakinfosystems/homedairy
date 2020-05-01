var mysql = require('mysql');
const mysqlx = require('@mysql/xdevapi');

var config = {
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  schema        : process.env.DB_NAME
}

//var pool  = mysql.createPool(config);
var pool = mysqlx.getClient(config, {
  pooling: {
    enabled: true,
    maxSize: parseInt(process.env.DB_CONNECTION_LIMIT)
  }
})
exports.pool = pool;