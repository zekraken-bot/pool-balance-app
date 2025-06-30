import { useState, useEffect } from "react";

function App() {
  const [imbalanceConstraint, setImbalanceConstraint] = useState(35);
  const [numTokens, setNumTokens] = useState(3);
  const [medianValue, setMedianValue] = useState(21.67);
  const [medianInput, setMedianInput] = useState("21.67");

  // Custom balance calculator state
  const [customBalances, setCustomBalances] = useState([
    "33.33",
    "33.33",
    "33.34",
  ]);

  // Helper functions
  const calculateMinMedian = (constraint, tokens) => {
    return (100 - constraint) / tokens;
  };

  const calculateMaxMedian = (constraint, tokens) => {
    return (100 + constraint) / tokens;
  };

  const calculateCurrentDistribution = (median, tokens) => {
    const values = new Array(tokens - 1).fill(median);
    const lastToken = 100 - (tokens - 1) * median;
    values.push(lastToken);
    return values.sort((a, b) => a - b);
  };

  const calculateTokenBoundaries = (median, tokens, constraint) => {
    if (tokens === 3) {
      const minA = Math.max(0, (100 - median - constraint) / 2);
      const maxC = Math.min(100, (100 - median + constraint) / 2);
      return { minToken: minA, maxToken: maxC };
    }
    const dist = calculateCurrentDistribution(median, tokens);
    return { minToken: Math.min(...dist), maxToken: Math.max(...dist) };
  };

  const calculateImbalance = (values) => {
    const numericValues = values.map((v) => parseFloat(v) || 0);
    const sorted = [...numericValues].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[Math.floor(sorted.length / 2) - 1] +
            sorted[Math.floor(sorted.length / 2)]) /
          2
        : sorted[Math.floor(sorted.length / 2)];
    const totalDiff = numericValues.reduce(
      (sum, val) => sum + Math.abs(val - median),
      0
    );
    return totalDiff / 100;
  };

  // This runs ONLY when the constraints (imbalance or token count) change.
  useEffect(() => {
    const minMedian = calculateMinMedian(imbalanceConstraint, numTokens);
    const maxMedian = calculateMaxMedian(imbalanceConstraint, numTokens);

    if (medianValue < minMedian) {
      setMedianValue(minMedian);
      setMedianInput(minMedian.toFixed(2));
    } else if (medianValue > maxMedian) {
      setMedianValue(maxMedian);
      setMedianInput(maxMedian.toFixed(2));
    }
  }, [imbalanceConstraint, numTokens, medianValue]);

  // This runs ONLY when numTokens changes.
  useEffect(() => {
    // Create an array with the new number of tokens, evenly split.
    const evenSplit = (100 / numTokens).toFixed(2);
    const newBalances = Array(numTokens - 1).fill(evenSplit);

    // Calculate the sum precisely and set the last token to the remainder.
    const sumOfFirst = newBalances.reduce(
      (acc, val) => acc + parseFloat(val),
      0
    );
    newBalances.push((100 - sumOfFirst).toFixed(2));

    setCustomBalances(newBalances);
  }, [numTokens]);

  // Handle median input submission
  const handleMedianSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const value = parseFloat(medianInput);
    if (!isNaN(value)) {
      const minMedian = calculateMinMedian(imbalanceConstraint, numTokens);
      const maxMedian = calculateMaxMedian(imbalanceConstraint, numTokens);
      const clampedValue = Math.max(minMedian, Math.min(maxMedian, value));
      setMedianValue(clampedValue);
      setMedianInput(clampedValue.toFixed(2));
    }
  };

  // Handle custom balance changes
  const handleCustomBalanceChange = (index, value) => {
    const newBalances = [...customBalances];
    newBalances[index] = value;

    // If it's not the last token, auto-calculate the last token
    if (index < numTokens - 1) {
      const sum = newBalances
        .slice(0, -1)
        .reduce((acc, val) => acc + parseFloat(val || 0), 0);
      newBalances[numTokens - 1] = (100 - sum).toFixed(2);
    }

    setCustomBalances(newBalances);
  };

  // Derived State
  const tokenValues = calculateCurrentDistribution(medianValue, numTokens);
  const minMedian = calculateMinMedian(imbalanceConstraint, numTokens);
  const maxMedian = calculateMaxMedian(imbalanceConstraint, numTokens);
  const currentImbalance = calculateImbalance(
    tokenValues.map((v) => v.toString())
  );
  const isValidDistribution = currentImbalance <= imbalanceConstraint / 100;

  // Calculate token boundaries for the current median
  const tokenBoundaries = calculateTokenBoundaries(
    medianValue,
    numTokens,
    imbalanceConstraint
  );

  // Custom balance calculations
  const customTokenValues = customBalances.map((val) => parseFloat(val) || 0);
  const customImbalance = calculateImbalance(customBalances);
  const customIsValid = customImbalance <= imbalanceConstraint / 100;
  const customSum = customTokenValues.reduce((acc, val) => acc + val, 0);

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
            box-sizing: border-box;
          }

          .submit-btn {
            width: 100%;
            padding: 10px 16px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
          }

          .input-field:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
            background: rgba(255, 255, 255, 0.15);
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .input-field option {
            background: #1e293b;
            color: white;
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

          .custom-balance-input {
            width: 100%;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
            box-sizing: border-box;
            text-align: center;
          }

          .custom-balance-input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
            background: rgba(255, 255, 255, 0.15);
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
            Multi-Token Surge Pool Balance Calculator
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
                value={medianInput}
                onChange={(e) => setMedianInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleMedianSubmit(e);
                  }
                }}
                className="input-field"
                step="0.01"
                placeholder="Enter median value"
              />
              <button onClick={handleMedianSubmit} className="submit-btn">
                Update
              </button>
              <p style={styles.helperText}>
                Min: {minMedian.toFixed(2)}% | Max: {maxMedian.toFixed(2)}%
              </p>
            </div>

            {/* Custom Balance Calculator */}
            <div className="card" style={styles.customCard}>
              <h3 style={styles.sectionTitle}>Custom Balance Calculator</h3>

              <div className="balance-grid">
                {customBalances.slice(0, numTokens).map((balance, index) => (
                  <div key={index} style={styles.balanceInputGroup}>
                    <label style={styles.balanceLabel}>
                      Token {String.fromCharCode(65 + index)}
                    </label>
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) =>
                        handleCustomBalanceChange(index, e.target.value)
                      }
                      className="custom-balance-input"
                      step="0.01"
                      min="0"
                      max="100"
                      disabled={index === numTokens - 1} // Last token is auto-calculated
                    />
                  </div>
                ))}
              </div>

              <div style={styles.customResults}>
                <div style={styles.customResultRow}>
                  <span style={styles.customResultLabel}>Total: </span>
                  <span
                    style={{
                      ...styles.customResultValue,
                      color:
                        Math.abs(customSum - 100) < 0.01
                          ? "#86efac"
                          : "#fca5a5",
                    }}
                  >
                    {customSum.toFixed(2)}%
                  </span>
                </div>

                <div style={styles.customResultRow}>
                  <span style={styles.customResultLabel}>Imbalance: </span>
                  <span
                    style={{
                      ...styles.customResultValue,
                      color: customIsValid ? "#86efac" : "#fca5a5",
                    }}
                  >
                    {(customImbalance * 100).toFixed(2)}%
                  </span>
                </div>

                <div style={styles.customResultRow}>
                  <span style={styles.customResultLabel}>Status: </span>
                  <span
                    style={{
                      ...styles.customResultValue,
                      color:
                        customIsValid && Math.abs(customSum - 100) < 0.01
                          ? "#86efac"
                          : "#fca5a5",
                    }}
                  >
                    {customIsValid && Math.abs(customSum - 100) < 0.01
                      ? "✅ Valid"
                      : Math.abs(customSum - 100) >= 0.01
                      ? "❌ Total ≠ 100%"
                      : `❌ Exceeds ${imbalanceConstraint}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div style={styles.metricsGrid}>
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
              <div style={styles.metricLabel}>Min Token Possible</div>
              <div style={{ ...styles.metricValue, color: "#7dd3fc" }}>
                {tokenBoundaries.minToken.toFixed(2)}%
              </div>
            </div>
            <div className="metric-card">
              <div style={styles.metricLabel}>Max Token Possible</div>
              <div style={{ ...styles.metricValue, color: "#f0abfc" }}>
                {tokenBoundaries.maxToken.toFixed(2)}%
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
  customCard: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "20px",
  },
  customTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "white",
    marginBottom: "16px",
    textAlign: "center",
  },
  customResults: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: "12px",
  },
  customResultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  customResultLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  customResultValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  balanceInputGroup: {
    textAlign: "center",
  },
  balanceLabel: {
    display: "block",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.8rem",
    marginBottom: "6px",
    fontWeight: "500",
  },
};

export default App;
