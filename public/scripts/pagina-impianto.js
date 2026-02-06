function gestisciPeriodo() {
  console.log("Cambio");
  const periodo = document.getElementById("periodo").value;
  const custom = document.getElementById("customDates");

  custom.style.display = periodo === "custom" ? "block" : "none";
}