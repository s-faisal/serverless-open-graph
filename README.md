# serverless-open-graph-parser

A serverless project that can fetch the raw open graph tags of a given URL.

## Modules Used

- open-graph-scraper
- cheerio

You can install following libraries and other dev dependencies using below command.

```bash
npm install
```

## Usage

Run the serverless project locally.

```bash
serverless offline
```
OR
```bash
sls offline
```

It will generate a **POST URL** for you. Something like this.
```bash
http://localhost:3000/dev/fetchMetadata 
```

You can use below request to test the API.
```bash
{
    url: "https://npmjs.com/package/str2bin"
}
```

Output
```bash
{ 
    title: 'str2bin',
    description: 'This will convert string to binary code and vice-versa.',
    images:[ 
        'https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png' 
    ] 
}
```