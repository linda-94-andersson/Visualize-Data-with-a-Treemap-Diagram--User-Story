import { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  // Fetch data from the provided JSON file
  useEffect(() => {
    axios
      .get(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
      )
      .then((response) => setData(response.data));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // D3 code to create the treemap
  const treemap = d3.treemap().size([800, 500]);
  const root = d3.hierarchy(data).sum((d) => d.value);
  treemap(root);

  // Define different fill colors
  const blueShades = [
    "#6baed6",
    "#4292c6",
    "#2171b5",
    "#08519c",
    "#08306b",
  ].reverse();

  const greenShades = [
    "#74c476",
    "#41ab5d",
    "#238b45",
    "#006d2c",
    "#00441b",
  ].reverse();

  const purpleShades = [
    "#9e9ac8",
    "#807dba",
    "#6a51a3",
    "#54278f",
    "#3f007d",
  ].reverse();

  const grayShades = ["#737373", "#525252", "#252525", "#000000"].reverse();

  // Create a separate scale for the legend
  const legendColors = d3
    .scaleOrdinal()
    .domain(root.children.map((child) => child.data.name))
    .range([...blueShades, ...greenShades, ...purpleShades, ...grayShades]);

  const handleMouseEnter = (event, leaf) => {
    const tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = `
      <p>${leaf.data.name}</p>
      <p>Category: ${leaf.data.category}</p>
      <p>Value: ${leaf.data.value}</p>
    `;
    tooltip.style.display = "block";
    tooltip.style.left = event.pageX + "px";
    tooltip.style.top = event.pageY + "px";
    tooltip.setAttribute("data-value", leaf.data.value);
  };

  const handleMouseLeave = () => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  };

  return (
    <>
      <div id="title">Treemap Diagram Title</div>
      <div id="description">Description about the treemap</div>
      <svg width="800" height="500">
        {root.leaves().map((leaf, i) => (
          <g
            key={`group-${i}`}
            transform={`translate(${leaf.x0},${leaf.y0})`}
            onMouseEnter={(e) => handleMouseEnter(e, leaf)}
            onMouseLeave={handleMouseLeave}
          >
            <rect
              className="tile"
              data-name={leaf.data.name}
              data-category={leaf.data.category}
              data-value={leaf.data.value}
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              fill={legendColors(leaf.data.category)} // Use different fill colors based on the category
            />
          </g>
        ))}
      </svg>
      <div
        id="legend"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {root.children.map((child, i) => (
          <div key={`legend-item-${i}`} className="legend-item">
            <svg width="10" height="10">
              <rect
                className="legend-item"
                width="10"
                height="10"
                fill={legendColors(child.data.name)} // Use different fill colors based on the category
              />
            </svg>
            <span className="legend-label">{child.data.name}</span>
          </div>
        ))}
      </div>
      <div id="tooltip" />
    </>
  );
}

export default App;
