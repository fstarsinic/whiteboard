[28-02-2024 09:28:01] INFO:
    0: {
      "index": {
        "_index": "bgp-data-test"
      }
    }
    1: {
      "_op_type": "create",
      "_index": "bgp-data-test",
      "cidr": "1.0.0.0/24",
      "startip": "1.0.0.0",
      "endip": "1.0.0.255",
      "startipint": 16777216,
      "endipint": 16777471,
      "origin_as": "13335",
      "peers": [
        ""
      ],
      "timestamp": "2024-02-28T09:28:01Z"
    }
[28-02-2024 09:28:01] ERROR: Bulk helper invalid action: '0'
    err: {
      "type": "ConfigurationError",
      "message": "Bulk helper invalid action: '0'",
      "stack":
          ConfigurationError: Bulk helper invalid action: '0'
              at iterate (C:\Users\fstarsin\code\hawkeye-bgp-sync-service\node_modules\@opensearch-project\opensearch\lib\Helpers.js:554:17)
              at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
              at async CSVToOpenSearch.bulkInsert (C:\Users\fstarsin\code\hawkeye-bgp-sync-service\build\storeBgpGenerator.js:123:28)
      "name": "ConfigurationError"
    }
