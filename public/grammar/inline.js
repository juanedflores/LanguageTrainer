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
      console.log(data.first);
      content=data.first;
    })
    .catch(err => console.log(err));
  return content;
}
//getLesson();

function loadExternalHTMLPage() {
  getLesson().then((cont) => document.getElementById("contentArea").innerHTML = cont);
}
