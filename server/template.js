import serialize from "serialize-javascript";

export default function template(body, initialData, userData) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://apis.google.com/js/api:client.js" async defer></script>
      <title>Issue Tracker</title>
      <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
      <style>
          table.table-hover tr {cursor: pointer;}
          .panel-title a {display: block; width: 100%; cursor: pointer;}
      </style>
  </head>
  <body>
    <!-- Page generated from template -->
    <div id="content">${body}</div>
  <script>window.__INITIAL_DATA__ = ${serialize(initialData)}</script>
  <script>window.__USER_DATA__ = ${serialize(userData)}</script>
  <script src="/env.js"></script>
  <script src="/vendor.bundle.js"></script>
  <script src="/app.bundle.js"></script>
  </body>
  </html>`;
}
