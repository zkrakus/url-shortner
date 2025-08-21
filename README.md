# url-shortner
## Overview
Basic url shortner built using node js and express.

### Example 
Given URL: https://api.example.com/v3/chat/system/logged-in?userId=789&session=abc123
The service should return the alias https://tinyrl.com/abcd-1234

- **Traffic Volume:** 1 x 10^8 URLs generated per day.
- **URL Length:** Optimize to minumum.
- **Character Encoding:** alphanumeric
- **URL Expiration**: 1 year.
Read / Write ratio: 10:1.
Average URL Length: 100
How long will this service be expected to run: Indefinite. (**We need a lowerbound for an URL eviction method given current use.**)

### BotE
Writes per second: 1 * 10^8 / 24 / 3600 ~= 1 * 10^3 
Reads per second: 1 * 10^4

### HLD: HTTP Contracts
#### Write
POST: FQDN/api/v1/url/shorten
Request Payload:
{
    longUrl: "https://api.example.com/v3/chat/system/logged-in?userId=789&session=abc123"
}

HTTP Status Code: 301 / 302?
Response Payload:
{
    shortUrl: "https://tinyrl.com/abcd-1234"
}

#### Read
HTTP Status Code: 301? / 302? / 200?
GET: FQDN/api/v1/url/{shortUrl}
{
    longUrl: "https://api.example.com/v3/chat/system/logged-in?userId=789&session=abc123"
}

## Requirements

| Functional Requirements                             | Non-Functional Requirements                              |
|-----------------------------------------------------|----------------------------------------------------------|
| Accept a long URL and return a short version        | Scale to handle high concurrency (horizontal scalability) |
| Redirect users from short URL to original URL       | Minimize latency during redirection (fast response time) |
| Track usage analytics for each short URL            | Remain available during failure (redundancy, failover)         |
| Automatically expire URLs after a set duration      | Log redirects, errors, and system events                 |
| Ensure unique short codes (handle collisions)       | Sanitize and validate all incoming URLs (security)   (**Bonus**)     |
| Provide a health check endpoint for monitoring      | Remain stable under failure conditions (fault tolerance) |




## ToDo
Add a persistent db.
Add docker file and docker compose for running this locally.
Add a cache that scales.
