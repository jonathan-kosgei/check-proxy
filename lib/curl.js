'use strict';
var Curl = require('node-libcurl').Curl;
var Promise = require('bluebird');
var querystring = require('querystring');

function get(url, options) {
  //console.log('curl');
  //console.log(url);
  //console.log(options);

  var curl = new Curl();
  curl.setOpt('URL', url);
  curl.setOpt('HTTPHEADER', options.header);
  curl.setOpt('COOKIE', options.cookie);

  curl.setOpt('FOLLOWLOCATION', true);
  curl.setOpt('HEADER', false);

  curl.setOpt('AUTOREFERER', true);
  curl.setOpt('SSL_VERIFYHOST', false);
  curl.setOpt('SSL_VERIFYPEER', false);
  if(options.proxy) {
    curl.setOpt('PROXY', options.proxy);
  }
  if(options.data) {
    curl.setOpt('POSTFIELDS', options.data);
  }

  curl.setOpt('CONNECTTIMEOUT', options.connectTimeout || 6);
  curl.setOpt('TIMEOUT', options.timeout || 10); //
  //curl.setOpt('USERAGENT', 'Mozilla/5.0 (Windows; U; Windows NT 5.0; en; rv:1.9.0.4) Gecko/2009011913 Firefox/3.0.6');
  return new Promise(function(resolve, reject) {
    curl.on('end', function( statusCode, body, headers ) {
      this.close();
      resolve({
        payload: body,
        stats: {}
      });
    });

    curl.on('error', (err) => {
      curl.close.bind(curl);
      if(options.kipErrors) {
        console.log('curl error', err);
        console.log('skip');
        return resolve({
          payload: '',
          stats: {}
        });
      }
      reject(err);
    });
    curl.perform();
  });

}

module.exports.get = get;