export default function HomePage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Takdi Studio</h1>
      <p>AI-powered e-commerce detail page generator</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button>Start New Project</button>
        <button>Use My Edited Image (BYOI)</button>
      </div>
    </main>
  );
}
