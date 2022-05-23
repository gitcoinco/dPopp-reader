
/* eslint-disable @typescript-eslint/unbound-method */
import { PassportReader } from "../src/reader";

test("Can get DID from wallet address", async () => {
  const reader = new PassportReader();

  const mockGetDID = jest.fn();
  mockGetDID.mockReturnValueOnce("mocked-did");

  reader._tulons.getDID = mockGetDID;

  const did = await reader.getDID("0x0");

  expect(reader._tulons.getDID).toBeCalledWith("0x0");
  expect(did).toBe("mocked-did");
});

test("Can get Account Stream from DID", async () => {
  const reader = new PassportReader();

  const mockGetGenesisHash = jest.fn();
  mockGetGenesisHash.mockReturnValueOnce("genesis-hash");

  const mockGetGenesisStreams = jest.fn();
  mockGetGenesisStreams.mockReturnValueOnce({
    [reader._ceramic_crypto_accounts_stream_id]: "test",
  });

  reader._tulons.getStream = jest.fn();
  reader._tulons.getGenesisHash = mockGetGenesisHash;
  reader._tulons.getGenesisStreams = mockGetGenesisStreams;

  await reader.getAccountsStream("did:3:bafy...");

  expect(reader._tulons.getGenesisHash).toBeCalledWith("did:3:bafy...");
  expect(reader._tulons.getGenesisStreams).toBeCalledWith("genesis-hash", [
    reader._ceramic_crypto_accounts_stream_id,
  ]);
  expect(reader._tulons.getStream).toBeCalledWith("test");
});

test("Can get Account Stream from DID and return a clean array", async () => {
  const reader = new PassportReader();

  const mockGetStream = jest.fn();
  mockGetStream
    .mockReturnValueOnce({
      "account1@eip155:1":"link1",
      "account2@eip155:1":"link2",
      "account3@eip155:1":"link3",
    })

  const mockGetGenesisHash = jest.fn();
  mockGetGenesisHash.mockReturnValueOnce("genesis-hash");

  const mockGetGenesisStreams = jest.fn();
  mockGetGenesisStreams.mockReturnValueOnce({
    [reader._ceramic_crypto_accounts_stream_id]: "test",
  });

  reader._tulons.getStream = mockGetStream;
  reader._tulons.getGenesisHash = mockGetGenesisHash;
  reader._tulons.getGenesisStreams = mockGetGenesisStreams;

  const accounts = await reader.getAccounts("did:3:bafy...");

  expect(reader._tulons.getGenesisHash).toBeCalledWith("did:3:bafy...");
  expect(reader._tulons.getGenesisStreams).toBeCalledWith("genesis-hash", [
    reader._ceramic_crypto_accounts_stream_id,
  ]);
  expect(reader._tulons.getStream).toBeCalledWith("test");

  expect(accounts).toStrictEqual(["account1", "account2", "account3"])
});

test("Can get Passport Stream from DID", async () => {
  const reader = new PassportReader();

  const mockGetGenesisHash = jest.fn();
  mockGetGenesisHash.mockReturnValueOnce("genesis-hash");

  const mockGetGenesisStreams = jest.fn();
  mockGetGenesisStreams.mockReturnValueOnce({
    [reader._ceramic_passport_stream_id]: "test",
  });

  reader._tulons.getStream = jest.fn();
  reader._tulons.getGenesisHash = mockGetGenesisHash;
  reader._tulons.getGenesisStreams = mockGetGenesisStreams;

  await reader.getPassportStream("did:3:bafy...");

  expect(reader._tulons.getGenesisHash).toBeCalledWith("did:3:bafy...");
  expect(reader._tulons.getGenesisStreams).toBeCalledWith("genesis-hash", [
    reader._ceramic_passport_stream_id,
  ]);
  expect(reader._tulons.getStream).toBeCalledWith("test");
});

test("Can get Passport and hydrate all Stamps from ceramic:// links", async () => {
  const reader = new PassportReader();

  const mockGetGenesisHash = jest.fn();
  mockGetGenesisHash.mockReturnValueOnce("genesis-hash");

  const mockGetGenesisStreams = jest.fn();
  mockGetGenesisStreams.mockReturnValueOnce({
    [reader._ceramic_passport_stream_id]: "test",
  });

  const mockGetStream = jest.fn();
  mockGetStream
    .mockReturnValueOnce({
      "issuanceDate": "2022-05-13T02:34:35.341Z",
      "expiryDate": "2022-05-13T02:34:35.341Z",
      "stamps": [
        {
          "provider": "Simple",
          "credential": "ceramic://kjzl6c...",
        },
      ],
    })

  const mockGetStreams = jest.fn();
  mockGetStreams
      .mockReturnValueOnce({
        "kjzl6c...": {
          "type": ["VerifiableCredential"],
        }
      })
  
  reader._tulons.getGenesisHash = mockGetGenesisHash;
  reader._tulons.getGenesisStreams = mockGetGenesisStreams;
  reader._tulons.getStream = mockGetStream;
  reader._tulons.getStreams = mockGetStreams;

  const passport = await reader.getPassport("did:3:bafy...");

  expect(reader._tulons.getStream).toBeCalledWith("test");
  expect(reader._tulons.getStreams).toBeCalledWith(["ceramic://kjzl6c..."]);

  expect(passport).toStrictEqual({
    "issuanceDate": "2022-05-13T02:34:35.341Z",
    "expiryDate": "2022-05-13T02:34:35.341Z",
    "stamps": [
      {
        "provider": "Simple",
        "credential": {
          "type": ["VerifiableCredential"],
        },
      },
    ],
  });
});
