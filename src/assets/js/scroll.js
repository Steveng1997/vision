document.addEventListener("DOMContentLoaded", () => {
    // your javascript code here
    const myLink = document.getElementById("containerMenu");
    myLink.addEventListener("click", () => {
      console.log("You visited the link");
    });
  });