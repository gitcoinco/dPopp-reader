/* eslint-disable @typescript-eslint/unbound-method */
import PassportReader from "./reader";

jest.mock("@self.id/core");

test("Can get DID from wallet address", async () => {
  const reader = new PassportReader();
  reader._core.getAccountDID = jest.fn();

  await reader.getDID("0x0");

  expect(reader._core.getAccountDID).toBeCalledWith("0x0@eip155:1");
});

test("Can get getPassportStream from DID", async () => {
  const reader = new PassportReader();
  reader._core.get = jest.fn();

  await reader.getPassportStream("did:3:bafy...");

  expect(reader._core.get).toBeCalledWith("Passport", "did:3:bafy...");
});

test("Can get Passport and all stamps from their streamId", async () => {
  const mockGet = jest.fn();
  mockGet.mockReturnValueOnce({
    issuanceDate: "2022-05-13T02:34:35.341Z",
    expiryDate: "2022-05-13T02:34:35.341Z",
    stamps: [
      {
        provider: "Simple",
        credential: "ceramic://kjzl6c...",
      },
    ],
  });

  const mockLoadStream = jest.fn();
  mockLoadStream.mockReturnValueOnce({
    content: {
      type: ["VerifiableCredential"],
    },
  });

  const reader = new PassportReader();

  reader._core.get = mockGet;
  reader._core._ceramic.loadStream = mockLoadStream;

  const passport = await reader.getPassport("did:3:bafy...");

  expect(reader._core.get).toBeCalledWith("Passport", "did:3:bafy...");
  expect(reader._core._ceramic.loadStream).toBeCalledWith(
    "ceramic://kjzl6c..."
  );

  expect(passport).toStrictEqual({
    issuanceDate: "2022-05-13T02:34:35.341Z",
    expiryDate: "2022-05-13T02:34:35.341Z",
    stamps: [
      {
        provider: "Simple",
        credential: {
          type: ["VerifiableCredential"],
        },
      },
    ],
  });
});
