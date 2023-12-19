# API Client HMAC Authentication

To perform client API Authentication we use the basic HMAC Authentication scheme in which the request is signed with a **secret key** and sent along with the **api key** to the server.

Each request requires three headers: `authorization`, `signature` and either `date` or `timestamp` (but we will use `timestamp` further). If the HTTP request contains a body, the `content-length` and `content-type` headers are also required.

## Prerequisites

- **API key** - the API key
- **Client secret** - the secret used by the client to sign the request

## Steps to create the request

1.  Get the uppercase value of the request method type (GET, POST, PUT etc)
2.  Add `"authorization": "apiKey ${apiKeyValue}"` header to the request
3.  Add `"timestamp": "${timeStampValue}"` header to the request, where **timeStampValue** represents the date of the request, formatted as UTC String (e.g. 2022-10-10T13:31:38.506Z)
4.  Get the query value from the request ( = { } if undefined || null || typeof != 'object' )
    If query != { } ( meaning that the request has query params ) then generate the **queryString** as:

        a) sort the query params by key
        b) stringify each query param value
        c) encode the key and the value
        d) concatenate the key value pair to form the queryString by joining the key - value pair with **=** and multiple pairs with **&**

        Example. For request `https://onghub/api/users?max=3000&active=true&search=Ana Maria` the **queryString** will be `active=true&max=3000&search=Ana%20Maria`.

        If the request does not have any query values, then **queryString = ''** (empty string).

5.  Get the body value from the request.
    If the request body is present, add the `"content-length": ${bodyBufferByteLength}` header to the request, where **bodyBufferByteLength** is the size in bytes of the body content.

    If the request body is a JSON format, add `"content-type": "application/json"` header to the request

    If the request does not have a body, then **bodyData = ''** (empty string)

6.  [Canonicalize](#canonicalize-the-request) the request to obtain the string to sign.
7.  Sign the canonical resulting value with **client secret** by applying the HMAC SHA256 algorithm and get the result encoded as string hex value.
8.  Add the `"signature": "simple-hmac-auth sha256 ${signature}"` header to the request, where **signature** is the one obtained at point 7.

---

### Canonicalize the request

To canonicalize the request, you would need:

1. the uppercase method value obtained at point 1.
2. the encoded URI of the request (e.q. for request `https://onghub/api/users?max=3000&active=true&search=Ana Maria` the URI is `api/users`
3. the queryString obtained at point 4.
4. the request headers
5. the request body obtained at point 5.

**Steps:**

1. Lowercase the request headers and extract only those included in the following list:
   - authorization
   - timestamp
   - date
   - content-length (\* don't add this if value = 0)
   - content-type (\* don't add this if request does not have a body)
2. Sort the obtained header list alphabetically by key
3. Take each key - value header pair, make sure the value is a string to trim it, then create the **headerString** by joining the key and trimmed value with **:** . Each key-value pair is separated by **\n** .
4. Hash the body data with SHA256 and the result as string hex value.
5. Generate the canonicalized string as:
   ```
   let  string  =  '';
   string  +=  `${method}\n`;
   string  +=  `${uri}\n`;
   string  +=  `${queryString}\n`;
   string  +=  `${headerString}\n`;
   string  +=  dataHash;
   ```

#### Example

For a `POST` request
of `https://onghub/api/users?max=3000&active=true&search=Ana Maria`
with body `{ "userId": "123" }`
timestamp `Tue, 11 Oct 2022 07:24:10 GMT`
API key `ABC.5ec6a9320444e748e3944adf0a7e3caa`
Secret `iamD2s7IPoPqCfcsabcdQvgdFfD08RlefUUUVNh5XaI=`

the canonicalized result is:

```
POST
/api/users
active=true&max=3000&search=Ana%20Maria
authorization:apiKey ABC.5ec6a9320444e748e3944adf0a7e3caa
content-length:23
content-type:application/json
timestamp:Tue, 11 Oct 2022 07:24:10 GMT
88086e099e776844c285c85abab66ffea3ed996220158b1a3b22834036654fcb
```

If no query params are provided, then the canonicalized string will look like:

```
POST
/api/users

authorization:apiKey ABC.5ec6a9320444e748e3944adf0a7e3caa
content-length:23
content-type:application/json
timestamp:Tue, 11 Oct 2022 07:24:10 GMT
88086e099e776844c285c85abab66ffea3ed996220158b1a3b22834036654fcb
```

If there is no body in the request, the **dataHash** will be the hash of an empty string. `content-type` and `content-length` headers will not be included:

```
POST
/api/users

authorization:apiKey ABC.5ec6a9320444e748e3944adf0a7e3caa
timestamp:Tue, 11 Oct 2022 07:24:10 GMT
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```
