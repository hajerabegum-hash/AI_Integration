import { useEffect, useMemo, useState } from "react";
import "./App.css";

const fallbackFormulaGroups = [
  {
    title: "Mathematics",
    formulas: [
      {
        name: "Pythagoras Theorem",
        formula: "a² + b² = c²",
        definition:
          "In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides.",
        use: "Used to find a missing side in right-angle triangles.",
        example: "If the legs are 3 m and 4 m, then c = √(3² + 4²) = 5 m.",
      },
      {
        name: "Area of Rectangle",
        formula: "A = l × w",
        definition: "Area is the product of length and width.",
        use: "Used to measure the surface area of a flat shape.",
        example: "A room 6 m long and 4 m wide has an area of 24 m².",
      },
      {
        name: "Quadratic Formula",
        formula: "x = (-b ± √(b² - 4ac)) / 2a",
        definition: "It finds the values of x that solve a quadratic equation.",
        use: "Used to solve equations of the form ax² + bx + c = 0.",
        example: "For x² - 5x + 6 = 0, the solutions are x = 2 and x = 3.",
      },
    ],
  },
  {
    title: "Algebra",
    formulas: [
      {
        name: "Slope",
        formula: "m = (y₂ - y₁) / (x₂ - x₁)",
        definition: "Slope measures the steepness of a straight line.",
        use: "Used to understand how quickly a quantity changes.",
        example:
          "If a line goes from (1, 2) to (3, 8), then m = (8 - 2) / (3 - 1) = 3.",
      },
      {
        name: "Distance Formula",
        formula: "d = √((x₂ - x₁)² + (y₂ - y₁)²)",
        definition:
          "Distance between two points is found using the Pythagorean idea.",
        use: "Used in coordinate geometry to find the length between points.",
        example:
          "Between (1, 1) and (4, 5), the distance is √((3)² + (4)²) = 5.",
      },
      {
        name: "Linear Equation",
        formula: "y = mx + c",
        definition: "A line can be written using its slope and intercept.",
        use: "Used to model straight-line relationships in graphs.",
        example: "If y = 2x + 3, then when x = 4, y = 11.",
      },
    ],
  },
  {
    title: "Trigonometry",
    formulas: [
      {
        name: "Sine",
        formula: "sin θ = opposite / hypotenuse",
        definition: "Sine is the ratio of the opposite side to the hypotenuse.",
        use: "Used to find angles and lengths in right triangles.",
        example:
          "If the opposite side is 5 and the hypotenuse is 10, then sin θ = 0.5.",
      },
      {
        name: "Cosine",
        formula: "cos θ = adjacent / hypotenuse",
        definition:
          "Cosine is the ratio of the adjacent side to the hypotenuse.",
        use: "Used in wave and triangle calculations.",
        example:
          "If the adjacent side is 8 and the hypotenuse is 10, then cos θ = 0.8.",
      },
      {
        name: "Tangent",
        formula: "tan θ = opposite / adjacent",
        definition: "Tangent compares the opposite side to the adjacent side.",
        use: "Used to find an angle when two sides of a right triangle are known.",
        example:
          "If the opposite side is 6 and the adjacent side is 8, then tan θ = 0.75.",
      },
    ],
  },
  {
    title: "Motion",
    formulas: [
      {
        name: "Speed",
        formula: "v = d / t",
        definition: "Speed is the distance covered per unit time.",
        use: "Used to calculate how fast an object is moving.",
        example: "If a car travels 120 km in 2 hours, its speed is 60 km/h.",
      },
      {
        name: "Velocity",
        formula: "v = u + at",
        definition:
          "Final velocity depends on initial velocity, acceleration, and time.",
        use: "Used to calculate motion under constant acceleration.",
        example: "If u = 10 m/s, a = 2 m/s², and t = 3 s, then v = 16 m/s.",
      },
      {
        name: "Displacement",
        formula: "s = ut + ½at²",
        definition:
          "Displacement is the distance covered in a given time under acceleration.",
        use: "Used in kinematics to predict positions of moving objects.",
        example: "If u = 5 m/s, a = 2 m/s², and t = 4 s, then s = 52 m.",
      },
    ],
  },
  {
    title: "Electricity",
    formulas: [
      {
        name: "Ohm's Law",
        formula: "V = I × R",
        definition: "Voltage is equal to current multiplied by resistance.",
        use: "Used in electrical circuits to calculate current, voltage, or resistance.",
        example: "If I = 2 A and R = 5 Ω, then V = 10 V.",
      },
      {
        name: "Power",
        formula: "P = V × I",
        definition: "Power is the rate of energy transfer in a circuit.",
        use: "Used to measure how much electrical energy is consumed.",
        example: "If V = 12 V and I = 3 A, then P = 36 W.",
      },
      {
        name: "Resistance",
        formula: "R = V / I",
        definition:
          "Resistance is the opposition to the flow of electric current.",
        use: "Used to design safe and efficient electrical systems.",
        example: "If V = 24 V and I = 4 A, then R = 6 Ω.",
      },
    ],
  },
  {
    title: "Optics",
    formulas: [
      {
        name: "Refractive Index",
        formula: "n = c / v",
        definition:
          "Refractive index compares the speed of light in air to its speed in a medium.",
        use: "Used to study how light bends in different materials.",
        example: "If light travels at 2 × 10⁸ m/s in a medium, then n = 1.5.",
      },
      {
        name: "Lens Formula",
        formula: "1/f = 1/u + 1/v",
        definition:
          "Relates the focal length of a lens to object and image distances.",
        use: "Used in camera and eyeglass calculations.",
        example: "If u = 20 cm and v = 10 cm, then f = 6.67 cm approximately.",
      },
      {
        name: "Magnification",
        formula: "m = hᵢ / hₒ",
        definition: "Magnification compares image height to object height.",
        use: "Used to describe how much larger or smaller an image appears.",
        example:
          "If the image height is 8 cm and the object height is 4 cm, then m = 2.",
      },
    ],
  },
];

function App() {
  const [formulaGroups, setFormulaGroups] = useState(fallbackFormulaGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormulaData = async () => {
      try {
        const response = await fetch("/api/formulas");

        if (!response.ok) {
          throw new Error("Failed to fetch formulas");
        }

        const result = await response.json();

        if (Array.isArray(result?.data) && result.data.length > 0) {
          setFormulaGroups(result.data);
        }
      } catch (error) {
        setFormulaGroups(fallbackFormulaGroups);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulaData();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(formulaGroups.map((group) => group.title))],
    [formulaGroups],
  );

  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return formulaGroups
      .map((group) => {
        const filteredFormulas = group.formulas.filter((item) => {
          const matchesCategory =
            selectedCategory === "All" || group.title === selectedCategory;

          const matchesSearch =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.formula.toLowerCase().includes(query) ||
            item.definition.toLowerCase().includes(query) ||
            item.use.toLowerCase().includes(query);

          return matchesCategory && matchesSearch;
        });

        return { ...group, formulas: filteredFormulas };
      })
      .filter((group) => group.formulas.length > 0);
  }, [formulaGroups, searchTerm, selectedCategory]);

  return (
    <main className="page-shell">
      <div className="app-panel">
        <header className="app-topbar">
          <div className="brand-wrap">
            <div className="brand-mark">∑</div>
            <div>
              <p className="brand-tag">StudyHub</p>
              <h1>Formula Desk</h1>
            </div>
          </div>
          <span className="status-pill">Live data</span>
        </header>

        <section className="hero-bar">
          <div>
            <p className="eyebrow">STUDENT REFERENCE</p>
            <h2>Math &amp; Science Formula Library</h2>
          </div>

          <label className="search-box" htmlFor="formula-search">
            <span>⌕</span>
            <input
              id="formula-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search formula, topic or concept"
            />
          </label>
        </section>

        <nav className="category-bar" aria-label="Formula categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "category-chip active"
                  : "category-chip"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="loading-state">Loading formula data...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="empty-state">
            No formulas found for your search. Try another keyword.
          </div>
        ) : (
          <section className="formula-grid">
            {filteredGroups.map((group) => (
              <div key={group.title} className="formula-group">
                <div className="group-header">
                  <h3>{group.title}</h3>
                  <span>{group.formulas.length} formulas</span>
                </div>

                <div className="cards">
                  {group.formulas.map((item) => (
                    <article key={item.name} className="formula-card">
                      <div className="formula-title-row">
                        <h4>{item.name}</h4>
                        <span className="formula-tag">Formula</span>
                      </div>

                      <p className="formula-text">{item.formula}</p>

                      <div className="info-block">
                        <strong>Definition</strong>
                        <span>{item.definition}</span>
                      </div>

                      <div className="info-block">
                        <strong>Use</strong>
                        <span>{item.use}</span>
                      </div>

                      <div className="info-block example-block">
                        <strong>Example</strong>
                        <span>{item.example}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
