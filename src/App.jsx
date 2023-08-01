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

  return (
    <>
      <div id="title">Treemap Diagram Title</div>
      <div id="description">Description about the treemap</div>
      <svg width="800" height="500">
        {root.leaves().map((leaf, i) => (
          <g key={`group-${i}`} transform={`translate(${leaf.x0},${leaf.y0})`}>
            <rect
              className="tile"
              data-name={leaf.data.name}
              data-category={leaf.data.category}
              data-value={leaf.data.value}
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              fill={`#FFFF`} 
            />
          </g>
        ))}
      </svg>
      <div id="legend">
        {/* Create the legend here with at least 2 different fill colors */}
        {/* Customize as per your dataset and styling preference */}
      </div>
      <div id="tooltip" />
    </>
  );
}

export default App;
