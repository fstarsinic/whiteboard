function bulkInsert(data) {
    return new Promise((resolve, reject) => {
        // Example using Elasticsearch/OpenSearch client
        // Replace with your actual bulk insert logic
        esClient.bulk({ body: data }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}




async function processGeneratorAsync(generator) {
    return new Promise(async (resolve, reject) => {
        const iterator = generator();

        const processNext = async (result) => {
            if (result.done) {
                resolve(); // Resolve the promise when generator is done
            } else {
                try {
                    // Await the asynchronous bulk insert operation
                    await bulkInsert(result.value); // Assume result.value is the data for bulk insert
                    console.log('Bulk insert complete for a chunk');

                    // Proceed to the next item
                    processNext(iterator.next());
                } catch (error) {
                    reject(error); // Reject the promise on error
                }
            }
        };

        // Start processing
        processNext(iterator.next());
    });
}



function* myDataGenerator() {
    // Yield data chunks for bulk insert
    yield [...]; // Replace [...] with your actual data chunk
    // Yield more data as needed
}

processGeneratorAsync(myDataGenerator)
    .then(() => console.log('All bulk inserts complete'))
    .catch(error => console.error('Bulk insert failed:', error));


