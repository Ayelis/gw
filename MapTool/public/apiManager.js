export const saveMap = async (territories) => {
  const response = await fetch("/api/maps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(territories),
  });

  if (response.ok) {
    console.log("Map saved to database!");
  } else {
    console.error("Failed to save map:", await response.text());
  }
};