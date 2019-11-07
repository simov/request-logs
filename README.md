
# request-logs

> _HTTP debug logs for **[request-compose]**_

```bash
$ DEBUG=req,res,json node app.js
```

## req

Prints out the request `method`, `url`, and `headers`:

```
req GET http://localhost:3000/
    authorization:  Bearer token
    content-length: 2
    Host:           localhost:3000
```

## res

Prints out the response `statusCode`, `statusMessage`, and `headers`:

```
res 200 OK
    content-type:      application/json
    date:              Sun, 04 Feb 2018 13:42:15 GMT
    connection:        close
    transfer-encoding: chunked

```

## body

Prints out the raw request and response body:

```
body
{"hey":"hi"}
```

## json

Prints out the parsed request and response body:

```
json
    hey: hi
```

## nocolor

Disable all colors


  [request-compose]: https://github.com/simov/request-compose
