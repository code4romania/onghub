// The API key value from Postman environment variables
const apiKey = pm.environment.get("api_key");
// The secret value from Postman environment variables
const secret = pm.environment.get('secret_key');

const method = pm.request.method.toUpperCase();
const path = pm.request.url.getPath();
const body = pm.request.body.raw;

// List of accepted headers for canonicalization
const headerWhitelist = [
  'authorization',
  'timestamp',
  'date',
  'content-length',
  'content-type'
];

let query = pm.request.url.query;

if (query === undefined || query === null || typeof query !== 'object') {
    query = {};
}

pm.request.headers.add({
    key: 'authorization', 
    value: `apiKey ${apiKey}`
});

pm.request.headers.add({
    key: 'timestamp',
    value: new Date().toUTCString()
});

// Create the queryString if the request has query params
const keys = query.map((item) => item.key).sort();
let queryString = '';
keys.forEach((key, index) => {
    let value = query.find((item) => item.key === key).value;

    if ([ 'string', 'number', 'boolean' ].includes(typeof value)) {
        value = String(value);
    } else {
        try {
            value = JSON.stringify(value);
        } catch (err) {
            return;
        }
    }

    value = encodeURIComponent(value);
    key = encodeURIComponent(key);

    queryString += `${key}=${value}`;

    if (index !== (keys.length - 1)) {
        queryString += '&';
    }
});

// Get the bodyData if the request has a body and set header if body is json
let bodyData;
if(body !== '' && body !== undefined) {
    try {
        bodyData = body;
        pm.request.headers.add({key: 'content-length', value: String(Buffer.byteLength(bodyData))});

        if(pm.request.body.options.raw.language === 'json') {
            pm.request.headers.add({key: 'content-type', value: 'application/json'});
        }
    } catch (e) {
        //if exception, then there is no json body in the request
        console.log(e);
    }
}

// Canonicalize the request and sign
if (secret !== undefined) {
    const canonical = canonicalize(method, path, queryString, pm.request.getHeaders(), bodyData);
    const signature = sign(canonical, secret);
    pm.request.headers.add({key: 'signature', value: `simple-hmac-auth sha256 ${signature}`});
}

// Call the request
//------------------------------------

//HELPERS
//1. Canonicalization function
function canonicalize(method, uri, queryString, headers, data) {
    if (queryString === undefined || queryString === null) {
        queryString = '';
    }

    if (data === undefined || data === null) {
        data = '';
    }

    const cleanHeaders = {};
    for (let [ key, value ] of Object.entries(headers)) {
        key = key.toLowerCase();
        if (!headerWhitelist.includes(key)) {
        continue;
        }
        if (key === 'content-length' && value === '0') {
        continue;
        }
        cleanHeaders[key] = value;
    }

    const headerKeys = Object.keys(cleanHeaders);
    // Sort the header keys alphabetically
    headerKeys.sort();

    // Create a string of all headers, arranged alphabetically, separated by newlines
    let headerString = '';

    for (const [ index, key ] of headerKeys.entries()) {
        let value = cleanHeaders[key];
        // Make sure our value is a string, so we can trim it
        if (typeof value !== 'string') {
        value = `${value}`;
        }
        headerString += `${key}:${value.trim()}`;
        if (index !== (headerKeys.length - 1)) {
        headerString += '\n';
        }
    }

    const dataHash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

    let string = '';
    string += `${method}\n`;
    string += `${uri}\n`;
    string += `${queryString}\n`;
    string += `${headerString}\n`;
    string += dataHash;

    return string;
}


//2. signing function
function sign(canonical, secret) {
  return CryptoJS.HmacSHA256(canonical, secret).toString(CryptoJS.enc.Hex);
}
