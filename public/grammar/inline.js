async function getLesson() {
  let content;
  await fetch("/lessons", {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      content = data.first;
    })
    .catch(err => console.log(err));
  return content;
}

function loadExternalHTMLPage() {
  getLesson().then(
    cont => (document.getElementById("contentArea").innerHTML = cont)
  );
}

function toggleForm() {
  let doc = document.getElementById("grammarEdit");
  if (doc.style.display == "none") {
    doc.style.display = "block";
  } else {
    doc.style.display = "none";
  }
}

function submitForm() {
  let area = document.getElementById("grammarArea");

  const data = {};
  data.one = area.value;
  
  // POST method request to add vocab to database.
  const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
  };

  // Fetch to get the current database.
  fetch("/savelesson", options)
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
  
  // Hide the submit elements.
  //area.style.display = "none";
  area.value = "";
  document.getElementById("grammarEdit").style.display = "none";
}
