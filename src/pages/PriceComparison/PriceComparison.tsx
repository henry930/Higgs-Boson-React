import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PriceComparison.module.scss';

const PriceComparison = () => {
  const [region, setRegion] = useState('usa');
  const [juniors, setJuniors] = useState(0);
  const [midLevel, setMidLevel] = useState(1);
  const [seniors, setSeniors] = useState(0);
  const [mode, setMode] = useState('annual');

  // Cost data based on region and level
  const costData = {
    usa: {
      junior: { salary: 120000, higgs: 35000 },
      midLevel: { salary: 160000, higgs: 53000 },
      senior: { salary: 220000, higgs: 85000 }
    },
    europe: {
      junior: { salary: 80000, higgs: 32000 },
      midLevel: { salary: 110000, higgs: 48000 },
      senior: { salary: 150000, higgs: 78000 }
    },
    asia: {
      junior: { salary: 60000, higgs: 28000 },
      midLevel: { salary: 85000, higgs: 42000 },
      senior: { salary: 120000, higgs: 68000 }
    }
  };

  // Calculate additional costs for in-house developers
  const calculateInHouseCosts = (salary: number) => {
    const socialSecurity = Math.min(salary * 0.062, 10920); // 6.2% capped at $176.1K
    const unemployment = Math.min(salary * 0.006, 420); // ~0.6% capped
    const medicare = salary * 0.0145; // 1.45%
    const benefits = salary * 0.2; // 20% for benefits
    const training = 1500; // Minimum training cost
    const recruitment = salary * 0.2; // 20% recruitment fee
    
    return {
      socialSecurity,
      unemployment,
      medicare,
      benefits,
      training,
      recruitment,
      total: salary + socialSecurity + unemployment + medicare + benefits + training + recruitment
    };
  };

  // Calculate totals
  const calculateTotals = () => {
    const regionData = costData[region as keyof typeof costData];
    
    const juniorInHouse = juniors > 0 ? calculateInHouseCosts(regionData.junior.salary * juniors) : { total: 0 };
    const midLevelInHouse = midLevel > 0 ? calculateInHouseCosts(regionData.midLevel.salary * midLevel) : { total: 0 };
    const seniorInHouse = seniors > 0 ? calculateInHouseCosts(regionData.senior.salary * seniors) : { total: 0 };
    
    const juniorHiggs = juniors * regionData.junior.higgs;
    const midLevelHiggs = midLevel * regionData.midLevel.higgs;
    const seniorHiggs = seniors * regionData.senior.higgs;
    
    const totalInHouse = juniorInHouse.total + midLevelInHouse.total + seniorInHouse.total;
    const totalHiggs = juniorHiggs + midLevelHiggs + seniorHiggs;
    const totalSavings = totalInHouse - totalHiggs;
    
    return {
      inHouse: { junior: juniorInHouse, midLevel: midLevelInHouse, senior: seniorInHouse, total: totalInHouse },
      higgs: { junior: juniorHiggs, midLevel: midLevelHiggs, senior: seniorHiggs, total: totalHiggs },
      savings: { junior: juniorInHouse.total - juniorHiggs, midLevel: midLevelInHouse.total - midLevelHiggs, senior: seniorInHouse.total - seniorHiggs, total: totalSavings }
    };
  };

  const totals = calculateTotals();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(mode === 'monthly' ? amount / 12 : amount);
  };

  // Generate shareable link
  const generateShareableLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      region,
      junior: juniors.toString(),
      mid: midLevel.toString(),
      senior: seniors.toString(),
      mode
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(generateShareableLink());
    // Could add a toast notification here
  };

  // Load parameters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('region')) setRegion(urlParams.get('region') || 'usa');
    if (urlParams.get('junior')) setJuniors(parseInt(urlParams.get('junior') || '0'));
    if (urlParams.get('mid')) setMidLevel(parseInt(urlParams.get('mid') || '1'));
    if (urlParams.get('senior')) setSeniors(parseInt(urlParams.get('senior') || '0'));
    if (urlParams.get('mode')) setMode(urlParams.get('mode') || 'annual');
  }, []);

  return (
    <div className={styles.priceComparison}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>Try it now</div>
            <h1 className={styles.heroTitle}>Price Comparison Calculator</h1>
            <p className={styles.heroDescription}>
              Simply select where your team is based, and the number of developers you need. 
              Using our industry expertise and market knowledge we'll create an estimate and 
              comparison of hiring costs. Want to share your results? Simply click 'Copy shareable link' 
              to share with your team.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className={styles.calculatorSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            How much could growing your team cost?
            <span className={styles.subtitle}>In-house vs. Higgs Boson Consultancy</span>
          </h2>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Where is your development team based?*</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className={styles.select}
              >
                <option value="usa">USA</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
              </select>
            </div>

            <div className={styles.developerControls}>
              <div className={styles.developerControl}>
                <label className={styles.controlLabel}>Junior devs needed:</label>
                <input 
                  type="number" 
                  min="0" 
                  max="20"
                  value={juniors}
                  onChange={(e) => setJuniors(parseInt(e.target.value) || 0)}
                  className={styles.numberInput}
                />
              </div>

              <div className={styles.developerControl}>
                <label className={styles.controlLabel}>Mid-level devs needed:</label>
                <input 
                  type="number" 
                  min="0" 
                  max="20"
                  value={midLevel}
                  onChange={(e) => setMidLevel(parseInt(e.target.value) || 0)}
                  className={styles.numberInput}
                />
              </div>

              <div className={styles.developerControl}>
                <label className={styles.controlLabel}>Senior devs needed:</label>
                <input 
                  type="number" 
                  min="0" 
                  max="20"
                  value={seniors}
                  onChange={(e) => setSeniors(parseInt(e.target.value) || 0)}
                  className={styles.numberInput}
                />
              </div>
            </div>

            <div className={styles.modeToggle}>
              <button 
                className={`${styles.modeButton} ${mode === 'monthly' ? styles.active : ''}`}
                onClick={() => setMode('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`${styles.modeButton} ${mode === 'annual' ? styles.active : ''}`}
                onClick={() => setMode('annual')}
              >
                Annual
              </button>
            </div>
          </div>

          {/* Comparison Tables */}
          <div className={styles.comparisonTables}>
            {/* In-House Table */}
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>{region.toUpperCase()} In-House Developer</h3>
              </div>
              
              <div className={styles.comparisonTable}>
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}></div>
                  <div className={styles.tableCell}>Juniors</div>
                  <div className={styles.tableCell}>Mid-Levels</div>
                  <div className={styles.tableCell}>Seniors</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>In-house {mode} Salary</div>
                  <div className={styles.tableCell}>{formatCurrency(juniors * costData[region as keyof typeof costData].junior.salary)}</div>
                  <div className={styles.tableCell}>{formatCurrency(midLevel * costData[region as keyof typeof costData].midLevel.salary)}</div>
                  <div className={styles.tableCell}>{formatCurrency(seniors * costData[region as keyof typeof costData].senior.salary)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Social Security/FICA (6.2% on first $176.1K)</div>
                  <div className={styles.tableCell}>{formatCurrency(juniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].junior.salary * juniors).socialSecurity : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(midLevel > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].midLevel.salary * midLevel).socialSecurity : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(seniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].senior.salary * seniors).socialSecurity : 0)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Benefits (Insurance/Health/Retirement/Paid Leave)</div>
                  <div className={styles.tableCell}>{formatCurrency(juniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].junior.salary * juniors).benefits : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(midLevel > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].midLevel.salary * midLevel).benefits : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(seniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].senior.salary * seniors).benefits : 0)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Recruitment fees (20%)</div>
                  <div className={styles.tableCell}>{formatCurrency(juniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].junior.salary * juniors).recruitment : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(midLevel > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].midLevel.salary * midLevel).recruitment : 0)}</div>
                  <div className={styles.tableCell}>{formatCurrency(seniors > 0 ? calculateInHouseCosts(costData[region as keyof typeof costData].senior.salary * seniors).recruitment : 0)}</div>
                </div>

                <div className={`${styles.tableRow} ${styles.totalRow}`}>
                  <div className={styles.tableCell}><strong>In-house {mode} total</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.junior.total)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.midLevel.total)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.senior.total)}</strong></div>
                </div>
              </div>
            </div>

            {/* Higgs Boson Table */}
            <div className={styles.tableContainer}>
              <div className={`${styles.tableHeader} ${styles.higgsHeader}`}>
                <h3>Higgs Boson Consultancy</h3>
              </div>
              
              <div className={styles.comparisonTable}>
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}></div>
                  <div className={styles.tableCell}>Juniors</div>
                  <div className={styles.tableCell}>Mid-Levels</div>
                  <div className={styles.tableCell}>Seniors</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Higgs Boson {mode} cost</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.junior)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.midLevel)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.senior)}</div>
                </div>

                {/* Show dashes for included services */}
                {['Social Security/FICA', 'Benefits', 'Recruitment fees', 'Training & Expenses'].map((item, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{item}</div>
                    <div className={styles.tableCell}>-</div>
                    <div className={styles.tableCell}>-</div>
                    <div className={styles.tableCell}>-</div>
                  </div>
                ))}

                <div className={`${styles.tableRow} ${styles.totalRow}`}>
                  <div className={styles.tableCell}><strong>Higgs Boson {mode} total</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.junior)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.midLevel)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.senior)}</strong></div>
                </div>

                <div className={`${styles.tableRow} ${styles.savingsRow}`}>
                  <div className={styles.tableCell}><strong>Total {mode} savings</strong></div>
                  <div className={styles.tableCell}><strong className={styles.savingsAmount}>save {formatCurrency(totals.savings.junior)}</strong></div>
                  <div className={styles.tableCell}><strong className={styles.savingsAmount}>save {formatCurrency(totals.savings.midLevel)}</strong></div>
                  <div className={styles.tableCell}><strong className={styles.savingsAmount}>save {formatCurrency(totals.savings.senior)}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div className={styles.shareSection}>
            <button onClick={copyShareableLink} className={styles.shareButton}>
              Copy sharable link
            </button>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            <p>
              *All figures presented are estimates based on publicly available market data and 
              internal benchmarks at the time of publication. This tool is intended for 
              general informational purposes only and does not constitute a formal quote, offer, 
              financial advice, or guarantee of actual costs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Tell us who you need. We'll handle the rest.</h2>
          <p>Start hiring in 7 days. No fees, no lock-in contracts.</p>
          <div className={styles.ctaButtons}>
            <Link to="/contact" className={styles.primaryButton}>Start Hiring</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceComparison;
