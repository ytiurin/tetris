+function(document) {
  var link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = "./src/styles.css" 
  document.body.appendChild( link )
}(document)
