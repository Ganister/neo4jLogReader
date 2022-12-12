async function readLogFile() {
  // retrieve the fileInput
  const fileInput = document.getElementById('fileInput');
  const zipFileBlob = fileInput.files[0];

  // Creates a BlobReader object used to read `zipFileBlob`.
  const zipFileReader = new zip.BlobReader(zipFileBlob);

  const logWriter = new zip.TextWriter();

  const zipReader = new zip.ZipReader(zipFileReader);
  const firstEntry = (await zipReader.getEntries()).shift();
  const logText = await firstEntry.getData(logWriter);
  await zipReader.close();


  // parse logText into JSON
  const logJSON = JSON.parse(logText);

  const columnDefs = [
    { field: "elapsedTimeMs", sort: "desc" },
    { field: "query", width: 500 },
    { field: "time" },
    { field: "allocatedBytes" },
    { field: "dbid" },
    { field: "event" },
    { field: "executingUser" },
    { field: "pageFaults" },
    { field: "pageHits" },
    { field: "runtime" },
    { field: "type" },
  ];


  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs: columnDefs,
    rowData: logJSON,
    defaultColDef: { sortable: true, filter: true },
    animateRows: true, // have rows animate to new positions when sorted
    rangeSelection: true, // allow range selection
  };

  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // on click copy the query to the clipboard
  gridDiv.addEventListener('click', function (event) {
    const selectedRow = gridOptions.api.getSelectedRows()[0];
    navigator.clipboard.writeText(selectedRow.query);

  });

}

