import http from "k6/http";
import { check, group, fail } from "k6";
import { b64encode } from "k6/encoding";

export const options = {

  scenarios: { 
    create_natural_user: {
      executor: 'shared-iterations',
      gracefulstop: "5s",
      vus: 100,
      iterations: 10000,
      maxDuration: "30s",
    }
  }
};

function randomString(length, charset = "") {
  if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
  let res = "";
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

const EMAIL = `${randomString(10)}@example.com`;
const clientId = "";
const apiKey = "";
const auth = b64encode(`${clientId}:${apiKey}`);

const BASE_URL = "";

export function setup() {
  const authRes = http.post(
    ``,
    {
      grant_type: "client_credentials",
    },
    {
      headers: {
        "Content-Type": "x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const response = authRes.json();
  console.log(`Got auth token response: ${response}`);
  console.log(`Got auth access token: ${response.access_token}`);

  return response.access_token;
}

export default (authToken) => {
  const requestConfigWithTag = (tag) => ({
    headers: {
      Authorization: `Bearer ${authToken}`,
      "content-type": "application/json",
      Accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      connection: "keep-alive",
    },
    tags: Object.assign(
      {},
      {
        name: "User Creation",
      },
      tag
    ),
  });

  let URL = `${BASE_URL}/users/natural`;

  group("01. Create a new user", () => {
    const payload = {
      FirstName: "Test",
      LastName: "LastName",
      Email: EMAIL,
      Address: {
        AddressLine1: "Street 1",
        AddressLine2: "Street 2",
        City: "Paris",
        Region: "Ile-de-France",
        PostalCode: "75001",
        Country: "FR",
      },
      UserCategory: "PAYER",
      TermsAndConditionsAccepted: false,
      Tag: "Created using Mangopay API Postman Collection",
    };

    const stuff = requestConfigWithTag({ name: "Create" });

    const res = http.post(URL, JSON.stringify(payload), stuff);
    console.log(`Created user: ${res.status} ${res.body}`);

    if (check(res, { "User created correctly": (r) => r.status === 200 })) {
      URL = `${URL}${res.json("id")}/`;
    } else {
      console.log(`Unable to create an User ${res.status} ${res.body}`);
      return;
    }
  });
};
