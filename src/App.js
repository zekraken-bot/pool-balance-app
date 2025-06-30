import React, { useState, useEffect } from "react";

function App() {
  const [imbalanceConstraint, setImbalanceConstraint] = useState(35);
  const [numTokens, setNumTokens] = useState(3);
  const [medianValue, setMedianValue] = useState(21.67);

  // Helper functions (no changes)
  const calculateMinMedian = (constraint, tokens) =>
    (100 * (1 - constraint / 100)) / (tokens + 1);
  const calculateOptimalDistribution = (constraint, tokens) => {
    const minMedian = calculateMinMedian(constraint, tokens);
    const values = new Array(tokens).fill(minMedian);
    values[tokens - 1] = 100 - (tokens - 1) * minMedian;
    return values;
  };
  const calculateCurrentDistribution = (median, tokens) => {
    const values = new Array(tokens - 1).fill(median);
    const lastToken = 100 - (tokens - 1) * median;
    values.push(lastToken);
    return values.sort((a, b) => a - b);
  };
  const calculateImbalance = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[Math.floor(sorted.length / 2) - 1] +
            sorted[Math.floor(sorted.length / 2)]) /
          2
        : sorted[Math.floor(sorted.length / 2)];
    const totalDiff = values.reduce(
      (sum, val) => sum + Math.abs(val - median),
      0
    );
    return totalDiff / 100;
  };

  useEffect(() => {
    const minMedian = calculateMinMedian(imbalanceConstraint, numTokens);
    if (medianValue < minMedian) {
      setMedianValue(minMedian);
    }
  }, [imbalanceConstraint, numTokens, medianValue]);

  // Derived State
  const tokenValues = calculateCurrentDistribution(medianValue, numTokens);
  const minMedian = calculateMinMedian(imbalanceConstraint, numTokens);
  const currentImbalance = calculateImbalance(tokenValues);
  const isValidDistribution = currentImbalance <= imbalanceConstraint / 100;
  const optimalDistribution = calculateOptimalDistribution(
    imbalanceConstraint,
    numTokens
  );

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
            }
          }

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
            }
          }

          .fade-in-up {
            animation: fadeInUp 0.8s ease-out;
          }

          .card {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            transition: all 0.3s ease;
          }

          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-color: rgba(255, 255, 255, 0.2);
          }

          .card-interactive:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }

          .input-field {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;
            outline: none;
          }

          .input-field:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
            background: rgba(255, 255, 255, 0.15);
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);
            border-radius: 4px;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .progress-fill::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 2s infinite;
          }

          .status-valid {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
            border: 1px solid rgba(34, 197, 94, 0.4);
            animation: glow 3s ease-in-out infinite;
          }

          .status-invalid {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 127, 0.2));
            border: 1px solid rgba(239, 68, 68, 0.4);
          }

          .metric-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .metric-card:hover {
            transform: translateY(-3px) scale(1.02);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
            animation: pulse 2s infinite;
          }

          .token-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            flex: 1;
            min-width: 140px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
          }

          .token-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.6s ease;
          }

          .token-card:hover::before {
            left: 100%;
          }

          .token-card:hover {
            transform: translateY(-5px) scale(1.05);
            border-color: rgba(96, 165, 250, 0.5);
            box-shadow: 0 10px 30px rgba(96, 165, 250, 0.2);
          }

          .optimal-item {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            margin-bottom: 8px;
          }

          .optimal-item:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateX(5px);
          }
        `}
      </style>

      <div style={styles.content}>
        <div className="card fade-in-up" style={styles.mainCard}>
          <h1 style={styles.title}>
            <span style={styles.emoji}>🎯</span>
            Multi-Token Pool Balance Calculator
          </h1>

          {/* Input Section */}
          <div style={styles.inputGrid}>
            <div className="card card-interactive" style={styles.inputCard}>
              <label style={styles.label}>Imbalance Constraint (%)</label>
              <input
                type="number"
                value={imbalanceConstraint}
                onChange={(e) =>
                  setImbalanceConstraint(parseFloat(e.target.value) || 0)
                }
                className="input-field"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="card card-interactive" style={styles.inputCard}>
              <label style={styles.label}>Number of Tokens</label>
              <select
                value={numTokens}
                onChange={(e) => setNumTokens(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={3}>3 Tokens</option>
                <option value={4}>4 Tokens</option>
                <option value={5}>5 Tokens</option>
              </select>
            </div>

            <div className="card card-interactive" style={styles.inputCard}>
              <label style={styles.label}>Median Value (%)</label>
              <input
                type="number"
                value={medianValue.toFixed(2)}
                onChange={(e) =>
                  setMedianValue(parseFloat(e.target.value) || 0)
                }
                className="input-field"
                min={minMedian.toFixed(2)}
                max="50"
                step="0.01"
              />
              <p style={styles.helperText}>Min: {minMedian.toFixed(2)}%</p>
            </div>
          </div>

          {/* Results Section */}
          <div style={styles.metricsGrid}>
            <div className="metric-card">
              <div style={styles.metricLabel}>Minimum Median</div>
              <div style={{ ...styles.metricValue, color: "#fcd34d" }}>
                {minMedian.toFixed(2)}%
              </div>
            </div>
            <div className="metric-card">
              <div style={styles.metricLabel}>Current Imbalance</div>
              <div
                style={{
                  ...styles.metricValue,
                  color: isValidDistribution ? "#86efac" : "#fca5a5",
                }}
              >
                {(currentImbalance * 100).toFixed(2)}%
              </div>
            </div>
            <div className="metric-card">
              <div style={styles.metricLabel}>Min Token</div>
              <div style={{ ...styles.metricValue, color: "#7dd3fc" }}>
                {Math.min(...tokenValues).toFixed(2)}%
              </div>
            </div>
            <div className="metric-card">
              <div style={styles.metricLabel}>Max Token</div>
              <div style={{ ...styles.metricValue, color: "#f0abfc" }}>
                {Math.max(...tokenValues).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Token Distribution Display */}
          <div className="card" style={styles.distributionCard}>
            <h3 style={styles.sectionTitle}>Current Token Distribution</h3>
            <div style={styles.tokenGrid}>
              {tokenValues.map((value, index) => (
                <div key={index} className="token-card">
                  <div style={styles.tokenLabel}>
                    Token {String.fromCharCode(65 + index)}
                  </div>
                  <div style={styles.tokenValue}>{value.toFixed(2)}%</div>
                  <div className="progress-bar" style={{ marginTop: "12px" }}>
                    <div
                      className="progress-fill"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.bottomGrid}>
            <div className="card" style={styles.statusCard}>
              <h3 style={styles.sectionTitle}>Status</h3>
              <div
                className={
                  isValidDistribution ? "status-valid" : "status-invalid"
                }
                style={styles.statusContent}
              >
                <div style={styles.statusRow}>
                  <span style={styles.statusIcon}>
                    {isValidDistribution ? "✅" : "❌"}
                  </span>
                  <div>
                    <div style={styles.statusTitle}>
                      {isValidDistribution
                        ? "Valid Distribution"
                        : "Constraint Violated"}
                    </div>
                    <div style={styles.statusDesc}>
                      {isValidDistribution
                        ? "Pool meets imbalance constraint"
                        : `Exceeds ${imbalanceConstraint}% constraint by ${(
                            currentImbalance * 100 -
                            imbalanceConstraint
                          ).toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={styles.optimalCard}>
              <h3 style={styles.sectionTitle}>Optimal Distribution</h3>
              <div>
                {optimalDistribution.map((value, index) => (
                  <div key={index} className="optimal-item">
                    <div style={styles.optimalRow}>
                      <span style={styles.optimalToken}>
                        Token {String.fromCharCode(65 + index)}
                      </span>
                      <span style={styles.optimalValue}>
                        {value.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
                <div style={styles.optimalNote}>
                  Achieves exactly {imbalanceConstraint}% imbalance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #1e40af 100%)",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  mainCard: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    margin: "20px 0",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: "40px",
    background: "linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.02em",
  },
  emoji: {
    display: "inline-block",
    marginRight: "15px",
    fontSize: "3rem",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  inputCard: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "24px",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "12px",
    fontSize: "1.1rem",
    color: "rgba(255, 255, 255, 0.9)",
  },
  helperText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
    marginTop: "8px",
    textAlign: "center",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  metricLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
    marginBottom: "8px",
  },
  metricValue: {
    fontSize: "2.5rem",
    fontWeight: "700",
    lineHeight: "1",
  },
  distributionCard: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "32px",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "white",
    marginBottom: "24px",
    textAlign: "center",
  },
  tokenGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "16px",
  },
  tokenLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
    marginBottom: "8px",
  },
  tokenValue: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "white",
    marginBottom: "12px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  statusCard: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "24px",
  },
  statusContent: {
    padding: "20px",
    borderRadius: "16px",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statusIcon: {
    fontSize: "2rem",
  },
  statusTitle: {
    fontWeight: "600",
    color: "white",
    fontSize: "1.1rem",
    marginBottom: "4px",
  },
  statusDesc: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
  },
  optimalCard: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "24px",
  },
  optimalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optimalToken: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  optimalValue: {
    fontWeight: "600",
    color: "white",
  },
  optimalNote: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
    marginTop: "16px",
    fontStyle: "italic",
  },
};

export default App;
