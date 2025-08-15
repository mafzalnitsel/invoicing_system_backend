import { configDotenv } from "dotenv";
configDotenv();

const SAP_URI = process.env.SAP_URI;
const SAP_USER = process.env.SAP_USER;
const SAP_PASSWORD = process.env.SAP_PASSWORD;
const SAP_COMPANY = process.env.SAP_COMPANY;

export async function loginToSAP() {
  const res = await fetch(`${SAP_URI}/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      UserName: SAP_USER,
      Password: SAP_PASSWORD,
      CompanyDB: SAP_COMPANY,
    }),
  });

  if (!res.ok) {
    throw new Error(`SAP Login failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data["SessionId"];
}
