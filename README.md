# dPoPP Passport-Reader

## Compiling a browser bundle 

> Install deps

```bash
yarn install
```

> Build...

```bash
yarn run build
```

## Usage

Firstly we need to import the bundle/library and construct a `PassportReader` instance, passing in a ceramic node URL
```
// import the bundle
<script src="./dist/reader.bundle.js" type="script/javascript"/>

// or import as a module
import PassportReader from '@dpopp/passport-reader'

...

const reader = new PassportReader('https://ceramic-clay.3boxlabs.com')
```

<br/>

The `PassportReader` instance exposes 5 methods to help read the content of a dPopp Passport:

<br/>


- `getDID` - pass in a wallet address and get back a ceramic DID
```
reader.getDID(address: string): string | false
```

- `getPassport` - pass in a ceramic DID and get back a fully hydrated Passport record
```
reader.getPassport(did: string): CeramicPassport | CeramicCredentialPassport | false
```

- `getStamps` - pass in a Passport and get back all the stamps as an array (after hydrating each stamps streamID)
```
reader.getStamps(record: CeramicPassport): (CeramicStamp | CeramicCredentialStamp | false)[]
``` 

- `getPassportStream` - pass in a ceramic DID and get back a Passport stream record *note that this is a shallow copy of the passport (and needs to have its stamps hydrated)
```
reader.getPassportStream(did: string): CeramicPassport | false
``` 

- `getStampStream` - pass in a stamps CeramicStamp record and get back a fully hydrated CeramicCredentialStamp based on the `credential` streamID
```
reader.getStampStream(stamp: CeramicStamp): CeramicCredentialStamp | false
``` 


