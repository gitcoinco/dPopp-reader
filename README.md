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

Firstly we need to import the bundle/library and construct a `PassportReader` instance, passing in a ceramic node URL and a networkId
```
// import the bundle
<script src="./dist/reader.bundle.js" type="script/javascript"/>

// or import as a module
import PassportReader from '@dpopp/passport-reader'

...
// create a new instance point at the community clay node on mainnet
const reader = new PassportReader('https://ceramic-clay.3boxlabs.com', '1')
```

<br/>

The `PassportReader` instance exposes read-only methods to get the content of a dPopp Passport/Ceramic account:

<br/>


- `getDID` - pass in a wallet address and get back a ceramic DID
```
reader.getDID(address: string): string | false
```

- `getAccounts` - pass in a DID and read back all addresses which have control of it
```
reader.getAccounts(did: string): string[]
```

- `getPassport` - pass in a ceramic DID and get back a fully hydrated Passport record
```
reader.getPassport(did: string): CeramicPassport | CeramicCredentialPassport | false
```

- `getAccountsStream` - pass in a DID and read back the raw stream record of addresses which have control of it
```
reader.getAccounts(did: string): Record<string, string>
```

- `getPassportStream` - pass in a ceramic DID and get back a raw Passport stream record *note that this is a shallow copy of the passport (and needs to have its stamps hydrated)
```
reader.getPassportStream(did: string): CeramicPassport | false
``` 
