<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Status</title>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .runningIcon {
        display: inline-block;
        animation: spin 1s linear infinite;
        color: gold;
      }
      .sleepingIcon {
        display: inline-block;
        color: grey;
      }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>
      $(document).ready(function() {
        setInterval(function() {
          $.get('/status', function(data) {
            $('#status').empty();
            for (const [task, info] of Object.entries(data)) {
              const icon = info.status === 'running' ? 
                `<span class="runningIcon">★</span>` : 
                `<span class="sleepingIcon">★</span>`;
              $('#status').append(`<p>${icon} ${task}: ${info.status} (${info.count} runs)</p>`);
            }
          });
        }, 1000);
      });
    </script>
</head>
<body>
    <h1>Task Status Dashboard</h1>
    <div id="status"></div>
</body>
</html>
