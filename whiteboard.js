class MyClass {
    async method1() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate an operation that might fail
                    const operation = () => {
                        // Simulate condition for success or failure
                        const success = true; // Change to false to simulate an error
                        if (!success) {
                            throw new Error('Operation failed in Method 1');
                        }
                        return 'Result of successful operation in Method 1';
                    };

                    // Assuming the operation is successful
                    const result = operation();
                    console.log('Method 1 completed');
                    resolve(result);
                } catch (error) {
                    console.log('Method 1 encountered an error');
                    reject(error.message);
                }
            }, 1000); // Simulate async work with a delay
        });
    }

    async method2() {
        // Existing implementation...
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = true; // Change to false to simulate failure
                if (success) {
                    console.log('Method 2 completed');
                    resolve('Result of Method 2');
                } else {
                    reject('Method 2 failed');
                }
            }, 1000); // Wait for 1 second
        });
    }

    async method3() {
        // Existing implementation...
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = true; // Change to false to simulate failure
                if (success) {
                    console.log('Method 3 completed');
                    resolve('Result of Method 3');
                } else {
                    reject('Method 3 failed');
                }
            }, 1000); // Wait for 1 second
        });
    }
}

// Main execution function with try/catch block as previously shown
async function main() {
    const myClassInstance = new MyClass();
    
    try {
        const result1 = await myClassInstance.method1();
        console.log(result1); // Logs the result of method1

        const result2 = await myClassInstance.method2();
        console.log(result2); // Logs the result of method2

        const result3 = await myClassInstance.method3();
        console.log(result3); // Logs the result of method3
    } catch (error) {
        // Handle any errors/rejections here
        console.error('An error occurred:', error);
    }
}

// Call the main function to execute
main();

