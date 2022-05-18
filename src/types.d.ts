import type { ModelTypeAliases } from "@glazed/types";

export type CeramicCredentialStamp = {
  provider: string;
  credential: VerifiableCredential;
};

export type CeramicCredentialPassport = {
  issuanceDate: string;
  expiryDate: string;
  stamps: CeramicCredentialStamp[];
};

export type CeramicStamp = {
  provider: string;
  credential: string;
};

export type CeramicPassport = {
  issuanceDate: string;
  expiryDate: string;
  stamps: CeramicStamp[];
};

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

export type ModelTypes = ModelTypeAliases<
  {
    Passport: CeramicPassport;
    VerifiableCredential: VerifiableCredential;
  },
  {
    Passport: "Passport";
    VerifiableCredential: "VerifiableCredential";
  },
  Record<string, string>
>;
