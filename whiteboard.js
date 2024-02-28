    err: {
      "type": "ConfigurationError",
      "message": "Bulk helper invalid action: '_op_type'",
      "stack":
          ConfigurationError: Bulk helper invalid action: '_op_type'
              at iterate (C:\Users\fstarsin\code\hawkeye-bgp-sync-service\node_modules\@opensearch-project\opensearch\lib\Helpers.js:554:17)
              at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
              at async CSVToOpenSearch.bulkInsert (C:\Users\fstarsin\code\hawkeye-bgp-sync-service\build\storeBgpGenerator.js:124:28)
      "name": "ConfigurationError"
    }
