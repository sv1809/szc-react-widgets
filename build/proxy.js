var assert = require('assert');
var util = require('util');
var url = require('url');
var http = require('http');
var https = require('https');
var getRawBody = require('raw-body');
var isError = require('lodash.iserror');

module.exports = function proxy(options) {
  return function handleProxy(req, res, next) {
    var reqUrl = url.parse(decodeURIComponent(req.url)).query;
    var startParamsIndex = reqUrl.indexOf('?'),
      andParamIndex = reqUrl.indexOf('&');
    if ((startParamsIndex == -1 && andParamIndex != -1) || (andParamIndex != -1 && andParamIndex < startParamsIndex)) {
      reqUrl = reqUrl.replace('&', '?');
      var paramsStart = reqUrl.indexOf('?');
      if (paramsStart != -1) {
        var params = reqUrl.substring(paramsStart + 1);
        reqUrl = reqUrl.substring(0, paramsStart + 1) + encodeURIComponent(params);
      }
    }
    var parsedUrl = url.parse(reqUrl);
    var ishttps = parsedUrl.protocol === 'https:';
    var module = ishttps ? https : http;

    options = options || {};
    var headers = options.headers || {};
    var limit = options.limit || '1mb';

    var skipHdrs = ['connection', 'content-length'];

    var hds = extend(headers, req.headers, skipHdrs);
    hds.host = parsedUrl.host;
    hds.connection = 'close';

    if (isError(parsedUrl))
      next(parsedUrl);

    // var hasRequestBody = 'content-type' in req.headers || 'transfer-encoding' in req.headers;
    // Support for body-parser or other modules which already consume the req and store the result in req.body
    if (req.body) {
      runProxy(null, req.body);
    } else {
      getRawBody(req, {
        length: req.headers['content-length'],
        limit: limit,
        encoding: 'utf-8'
      }, runProxy);
    }

    function runProxy(err, bodyContent) {
      var params;
      if(parsedUrl.query) {
        params = parsedUrl.query.split('&').map(item => {
          var param = item.split('=');
          param[1] = decodeURIComponent(param[1]);
          param[1] = encodeURIComponent(param[1]);
          return param.join('=');
        }).join('&');
      }
      var reqOpt = {
        auth: parsedUrl.auth,
        hostname: parsedUrl.hostname,
        port: options.port || parsedUrl.port,
        headers: hds,
        method: req.method,
        path: parsedUrl.pathname + (params ? `?${params}` : ''),
        bodyContent: bodyContent,
        params: req.params
      };

      bodyContent = reqOpt.bodyContent;
      delete reqOpt.bodyContent;
      delete reqOpt.params;

      if (err && !bodyContent) return next(err);

      if (typeof bodyContent == 'string')
        reqOpt.headers['content-length'] = Buffer.byteLength(bodyContent);
      else if (Buffer.isBuffer(bodyContent)) // Buffer
        reqOpt.headers['content-length'] = bodyContent.length;

      var chunks = [];
      var realRequest = module.request(reqOpt, function (rsp) {
        var rspData = null;
        rsp.on('data', function (chunk) {
          chunks.push(chunk);
        });

        rsp.on('end', function () {
          var totalLength = chunks.reduce(function (len, buf) {
            return len + buf.length;
          }, 0);

          var rspData = Buffer.concat(chunks, totalLength);

          res.send(rspData);
        });

        rsp.on('error', function (e) {
          next(e);
        });


        if (!res.headersSent) { // if header is not set yet
          res.status(rsp.statusCode);
          for (var p in rsp.headers) {
            if (p == 'transfer-encoding')
              continue;
            res.set(p, rsp.headers[p]);
          }
        }

      });

      realRequest.on('error', function (e) {
        next(e);
      });

      if (bodyContent.length) {
        realRequest.write(bodyContent);
      }

      realRequest.end();
    }
  }
};

function extend(obj, source, skips) {
  if (!source) return obj;

  for (var prop in source) {
    if (!skips || skips.indexOf(prop) == -1)
      obj[prop] = source[prop];
  }

  return obj;
}
