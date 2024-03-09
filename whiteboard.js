import fetch from 'node-fetch';
import jsonata from 'jsonata';

interface RegistrantInfo {
  org?: string;
  address?: string;
  phone?: string;
}

async function queryRDAP(domain: string): Promise<RegistrantInfo> {
  const rdapUrl = `https://rdap.verisign.com/com/v1/domain/${domain}`;

  try {
    const response = await fetch(rdapUrl);
    const data = await response.json();

    // JSONata query to extract registrant information
    const expression = jsonata(`
      entities[roles='registrant'].{
        "org": legalEntity.name,
        "address": vcardArray[1][[0]='adr'].[3][][][],  // Adjust based on actual structure
        "phone": vcardArray[1][[0]='tel'].[3]
      }
    `);

    const result: RegistrantInfo = expression.evaluate(data);
    
    // Assuming single registrant and flattening the structure for simplicity
    return {
      org: result?.org,
      address: result?.address?.join(' '), // Join address parts if it's an array
      phone: result?.phone
    };

  } catch (error) {
    console.error("Error querying RDAP:", error);
    return {};
  }
}

// Example usage
queryRDAP('example.com').then(registrantInfo => {
  console.log(registrantInfo);
});
