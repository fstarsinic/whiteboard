function processVcards(vcards: any[]): any[][] {
  // Filter out the 'vcard' strings to get only the vcard arrays
  const filteredVcards: VCard[] = vcards.filter((item, index) => index % 2 !== 0) as VCard[];

  // Find all unique keys (assuming the first element in each entry is the key)
  const allKeys = new Set<string>();
  filteredVcards.forEach(vcard => {
    vcard.forEach(([key]) => allKeys.add(key));
  });

  // Convert Set to array for headers
  const headers = Array.from(allKeys);

  // Initialize result with headers
  const result: any[][] = [headers];

  // Process each vcard to create rows
  filteredVcards.forEach(vcard => {
    const row: (string | string[])[] = new Array(headers.length).fill('');

    vcard.forEach(([key, , , value]) => {
      const columnIndex = headers.indexOf(key);
      if (row[columnIndex] === '') {
        // First entry for this key
        row[columnIndex] = typeof value === 'string' ? value : JSON.stringify(value);
      } else {
        // Subsequent entry, handle as array or concatenate
        if (Array.isArray(row[columnIndex])) {
          row[columnIndex].push(typeof value === 'string' ? value : JSON.stringify(value));
        } else {
          // Convert to array
          row[columnIndex] = [row[columnIndex], typeof value === 'string' ? value : JSON.stringify(value)];
        }
      }
    });

    result.push(row);
  });

  return result;
}
