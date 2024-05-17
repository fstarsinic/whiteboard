interface Executor {
    initialize(args: any): void;
    execute(): Promise<void>;
}

class RESTMain implements Executor {
    private url: string;
    private method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    private headers: HeadersInit;
    private body: any;
    private username: string;
    private password: string;

    initialize(args: { url: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE'; headers?: HeadersInit; body?: any; username?: string; password?: string }): void {
        this.url = args.url;
        this.method = args.method;
        this.headers = args.headers || {};
        this.body = args.body || null;
        this.username = args.username || '';
        this.password = args.password || '';

        if (this.username && this.password) {
            const encodedCredentials = btoa(`${this.username}:${this.password}`);
            this.headers = {
                ...this.headers,
                'Authorization': `Basic ${encodedCredentials}`
            };
        }
    }

    async execute(): Promise<void> {
        try {
            let response: Response;

            const requestOptions: RequestInit = {
                method: this.method,
                headers: this.headers,
                body: this.body ? JSON.stringify(this.body) : null,
            };

            response = await fetch(this.url, requestOptions);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            // Display the results (for now)
            console.log(data);
        } catch (error) {
            console.error('Error executing request:', error);
        }
    }
}

// Example usage:
const executor: Executor = new RESTMain();
executor.initialize({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
    username: 'myUsername',
    password: 'myPassword'
});
executor.execute();
