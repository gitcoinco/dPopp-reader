// ---- Self.id core entry point
import { Core } from "@self.id/core";

// ---- Typings for dPoPP passport reader
import {
  CeramicCredentialStamp,
  CeramicCredentialPassport,
  CeramicPassport,
  CeramicStamp,
  ModelTypes,
  VerifiableCredential,
} from "./types";

/**
 * Pull all stamps for a given address...
 *
 * const reader = new PassportReader("https://ceramic-clay.3boxlabs.com")
 * const address = "0x0..."
 * const did = await reader.getDID(address)
 * const passport = await reader.getPassport(did)
 *
 **/

export default class PassportReader {
  _core: Core<ModelTypes>;

  constructor(url?: string) {
    this._core = new Core<ModelTypes>({
      ceramic: url ?? "https://ceramic-clay.3boxlabs.com",
      aliases: {
        definitions: {
          Passport:
            "kjzl6cwe1jw14b5pv8zucigpz0sc2lh9z5l0ztdrvqw5y1xt2tvz8cjt34bkub9",
          VerifiableCredential:
            "kjzl6cwe1jw147bsnnxvupgywgr0tyi7tesgle7e4427hw2dn8sp9dnsltvey1n",
        },
        schemas: {
          Passport:
            "ceramic://k3y52l7qbv1frygm3lu9o9qra3nid11t6vuj0mas2m1mmlywh0fop5tgrxf060000",
          VerifiableCredential:
            "ceramic://k3y52l7qbv1frxunk7h39a05iup0s5sheycsgi8ozxme1s3tl37modhalv38d05q8",
        },
        tiles: {},
      },
    });
  }

  async getDID(address: string): Promise<string | false> {
    let did: string | false;
    try {
      did = await this._core.getAccountDID(`${address}@eip155:1`);
    } catch {
      did = false;
    }

    return did;
  }

  async getPassport(
    did: string
  ): Promise<CeramicPassport | CeramicCredentialPassport | false> {
    const passport = await this.getPassportStream(did);

    if (passport) {
      const stamps = await this.getStamps(passport);

      return {
        issuanceDate: passport.issuanceDate,
        expiryDate: passport.expiryDate,
        stamps: stamps as CeramicCredentialStamp[],
      };
    }

    return passport;
  }

  async getStamps(
    record: CeramicPassport
  ): Promise<(CeramicStamp | CeramicCredentialStamp | false)[]> {
    const stamps = record?.stamps || [];

    return await Promise.all(
      stamps.map(async (stamp) => {
        return await this.getStampStream(stamp);
      })
    );
  }

  async getPassportStream(did: string): Promise<CeramicPassport | false> {
    let passport: CeramicPassport | false;
    try {
      passport = await this._core.get("Passport", did);
    } catch {
      passport = false;
    }

    return passport;
  }

  async getStampStream(
    stamp: CeramicStamp
  ): Promise<CeramicStamp | CeramicCredentialStamp | false> {
    let hydratedStamp: CeramicStamp | CeramicCredentialStamp | false;
    try {
      hydratedStamp = {
        provider: stamp.provider,
        credential: (await (
          await this._core._ceramic.loadStream(stamp.credential)
        ).content) as VerifiableCredential,
      } as CeramicCredentialStamp;
    } catch {
      hydratedStamp = false;
    }

    return hydratedStamp;
  }
}
