// ---- Tulons exposes a simple interface to read from Ceramic
import { Tulons } from "tulons";

// ---- Define Typings for dPassport
export type CeramicStreams = Record<string, string | false>;
export type CeramicAccounts = Record<string, string>;

// Raw Stamp stream as pulled from Ceramic
export type CeramicStampStream = {
  provider: string;
  credential: string;
};
// Hydrated Stamp stream
export type CeramicStampRecord = {
  provider: string;
  credential: VerifiableCredential;
};

// Raw Passport stream as pulled from Ceramic
export type CeramicPassportStream = {
  issuanceDate: string;
  expiryDate: string;
  stamps: CeramicStampStream[];
};
// Hydrated Passport stream
export type CeramicPassportRecord = {
  issuanceDate: string;
  expiryDate: string;
  stamps: CeramicStampRecord[];
};

// Each Stamp holds a VerifiableCredential that describes the authentication method being attested to
export type VerifiableCredential = {
  "@context": string[];
  type: string[];
  credentialSubject: {
    id: string;
    "@context": { [key: string]: string }[];
    root?: string;
    address?: string;
    challenge?: string;
  };
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  proof: {
    type: string;
    proofPurpose: string;
    verificationMethod: string;
    created: string;
    jws: string;
  };
};

// ---- Define PassportReader class (Returns Passport/Account data via Tulons)
export class PassportReader {
  _tulons: Tulons;

  _ceramic_passport_stream_id: string;
  _ceramic_crypto_accounts_stream_id: string;

  constructor(url?: string, network?: string | number) {
    // create a tulons instance
    this._tulons = new Tulons(url, network);
    // ceramic definition keys to get streamIds from genesis record
    this._ceramic_crypto_accounts_stream_id =
      "kjzl6cwe1jw149z4rvwzi56mjjukafta30kojzktd9dsrgqdgz4wlnceu59f95f";
    this._ceramic_passport_stream_id =
      "kjzl6cwe1jw14b5pv8zucigpz0sc2lh9z5l0ztdrvqw5y1xt2tvz8cjt34bkub9";
  }

  async getDID(address: string): Promise<string | false> {
    let did: string | false;

    // attempt to get the associated DID for the given account
    try {
      did = await this._tulons.getDID(address);
    } catch {
      did = false;
    }

    return did;
  }

  async getAccounts(did: string, streams?: CeramicStreams): Promise<string[]> {
    const stream = await this.getAccountsStream(did, streams);

    // clean up the addresses we retrieve
    if (stream) {
      return Object.keys(stream).map((address) =>
        this._tulons.getCleanAddress(address)
      );
    }

    return [];
  }

  async getPassport(
    did: string,
    streams?: CeramicStreams
  ): Promise<CeramicPassportStream | CeramicPassportRecord | false> {
    const passport = await this.getPassportStream(did, streams);

    // hydrate the ceramic:// uris in the passport
    if (passport) {
      return (await this._tulons.getHydrated(
        passport
      )) as CeramicPassportRecord;
    }

    return passport;
  }

  async getAccountsStream(
    did: string,
    streams?: CeramicStreams
  ): Promise<CeramicAccounts> {
    let accounts: CeramicAccounts = {};

    try {
      // get the genesis link to pull ids from
      const genesis = this._tulons.getGenesisHash(did);
      // pull pointer from did to passport stream
      streams =
        streams && streams[this._ceramic_crypto_accounts_stream_id]
          ? streams
          : await this._tulons.getGenesisStreams(genesis, [
              this._ceramic_crypto_accounts_stream_id,
            ]);
      // pull the passport from the discovered stream
      accounts = (await this._tulons.getStream(
        streams[this._ceramic_crypto_accounts_stream_id] as string
      )) as CeramicAccounts;
    } catch {
      accounts = {};
    }

    return accounts;
  }

  async getPassportStream(
    did: string,
    streams?: CeramicStreams
  ): Promise<CeramicPassportStream | false> {
    let passport: CeramicPassportStream | false;

    try {
      // pull pointer from did to passport stream
      streams =
        streams && streams[this._ceramic_passport_stream_id]
          ? streams
          : // get the genesis link and pull streams from it
            await this._tulons.getGenesisStreams(
              this._tulons.getGenesisHash(did),
              [this._ceramic_passport_stream_id]
            );
      // pull the passport from the discovered stream
      passport = (await this._tulons.getStream(
        streams[this._ceramic_passport_stream_id] as string
      )) as CeramicPassportStream;
    } catch {
      passport = false;
    }

    return passport;
  }
}
