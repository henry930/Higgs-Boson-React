import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PriceComparison.module.scss';

const PriceComparison = () => {
  const [juniors, setJuniors] = useState(0);
  const [midLevel, setMidLevel] = useState(1);
  const [seniors, setSeniors] = useState(0);
  const [mode, setMode] = useState('annual');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get available technologies for suggestions
  const getAvailableTech = () => {
    return Object.keys(techComplexity).filter(tech => 
      !techStack.includes(tech) && 
      tech.toLowerCase().includes(newTech.toLowerCase())
    ).slice(0, 8); // Show max 8 suggestions
  };

  // Technology complexity and skill requirements
  const techComplexity: Record<string, { complexity: string; multiplier: number; category: string; skillLevel: string }> = {
    // Frontend Technologies
    'React': { complexity: 'medium', multiplier: 1.0, category: 'frontend', skillLevel: 'mid' },
    'Vue.js': { complexity: 'medium', multiplier: 1.0, category: 'frontend', skillLevel: 'mid' },
    'Angular': { complexity: 'high', multiplier: 1.15, category: 'frontend', skillLevel: 'senior' },
    'Next.js': { complexity: 'high', multiplier: 1.1, category: 'frontend', skillLevel: 'mid' },
    'TypeScript': { complexity: 'medium', multiplier: 1.05, category: 'language', skillLevel: 'mid' },
    'JavaScript': { complexity: 'basic', multiplier: 1.0, category: 'language', skillLevel: 'junior' },
    
    // Backend Technologies
    'Node.js': { complexity: 'medium', multiplier: 1.0, category: 'backend', skillLevel: 'mid' },
    'Django': { complexity: 'medium', multiplier: 1.05, category: 'backend', skillLevel: 'mid' },
    'Flask': { complexity: 'basic', multiplier: 1.0, category: 'backend', skillLevel: 'junior' },
    'Express.js': { complexity: 'basic', multiplier: 1.0, category: 'backend', skillLevel: 'junior' },
    'FastAPI': { complexity: 'medium', multiplier: 1.05, category: 'backend', skillLevel: 'mid' },
    'Spring Boot': { complexity: 'high', multiplier: 1.2, category: 'backend', skillLevel: 'senior' },
    'ASP.NET': { complexity: 'high', multiplier: 1.15, category: 'backend', skillLevel: 'senior' },
    
    // Databases
    'PostgreSQL': { complexity: 'medium', multiplier: 1.0, category: 'database', skillLevel: 'mid' },
    'MySQL': { complexity: 'basic', multiplier: 1.0, category: 'database', skillLevel: 'junior' },
    'MongoDB': { complexity: 'medium', multiplier: 1.05, category: 'database', skillLevel: 'mid' },
    'Redis': { complexity: 'medium', multiplier: 1.05, category: 'database', skillLevel: 'mid' },
    'Elasticsearch': { complexity: 'high', multiplier: 1.2, category: 'database', skillLevel: 'senior' },
    
    // Cloud & DevOps
    'AWS': { complexity: 'high', multiplier: 1.25, category: 'cloud', skillLevel: 'senior' },
    'Azure': { complexity: 'high', multiplier: 1.2, category: 'cloud', skillLevel: 'senior' },
    'GCP': { complexity: 'high', multiplier: 1.2, category: 'cloud', skillLevel: 'senior' },
    'Docker': { complexity: 'medium', multiplier: 1.1, category: 'devops', skillLevel: 'mid' },
    'Kubernetes': { complexity: 'expert', multiplier: 1.4, category: 'devops', skillLevel: 'senior' },
    'Terraform': { complexity: 'high', multiplier: 1.25, category: 'devops', skillLevel: 'senior' },
    
    // Mobile
    'React Native': { complexity: 'medium', multiplier: 1.1, category: 'mobile', skillLevel: 'mid' },
    'Flutter': { complexity: 'medium', multiplier: 1.15, category: 'mobile', skillLevel: 'mid' },
    'Swift': { complexity: 'high', multiplier: 1.2, category: 'mobile', skillLevel: 'senior' },
    'Kotlin': { complexity: 'high', multiplier: 1.15, category: 'mobile', skillLevel: 'senior' },
    
    // Specialized
    'Machine Learning': { complexity: 'expert', multiplier: 1.5, category: 'ai', skillLevel: 'senior' },
    'AI/Deep Learning': { complexity: 'expert', multiplier: 1.6, category: 'ai', skillLevel: 'senior' },
    'Blockchain': { complexity: 'expert', multiplier: 1.4, category: 'blockchain', skillLevel: 'senior' },
    'GraphQL': { complexity: 'medium', multiplier: 1.1, category: 'api', skillLevel: 'mid' },
  };

  // Calculate skillset complexity multiplier
  const calculateSkillsetMultiplier = () => {
    if (techStack.length === 0) return 1.0;
    
    const multipliers = techStack.map(tech => techComplexity[tech]?.multiplier || 1.0);
    const avgMultiplier = multipliers.reduce((sum, mult) => sum + mult, 0) / multipliers.length;
    
    // Apply additional complexity for technology combination
    const categories = new Set(techStack.map(tech => techComplexity[tech]?.category).filter(Boolean));
    const categoryBonus = Math.max(0, (categories.size - 1) * 0.05); // 5% bonus per additional category
    
    return Math.min(avgMultiplier + categoryBonus, 1.8); // Cap at 80% increase
  };

  // Get required skill level for the tech stack
  const getRequiredSkillLevel = () => {
    if (techStack.length === 0) return 'mid';
    
    const skillLevels = techStack.map(tech => techComplexity[tech]?.skillLevel || 'mid');
    
    if (skillLevels.includes('senior')) return 'senior';
    if (skillLevels.includes('mid')) return 'mid';
    return 'junior';
  };

  // UK Cost data for different developer levels (annual salaries)
  const ukCostData = {
    junior: { 
      salary: 35000, // £35k average for junior UK developers
      higgs: 27375   // £175/day * 220 working days = £38,500, discounted for volume
    },
    midLevel: { 
      salary: 55000, // £55k average for mid-level UK developers
      higgs: 38500   // £175/day * 220 working days
    },
    senior: { 
      salary: 80000, // £80k average for senior UK developers
      higgs: 49500   // £175/day * 220 working days, slight premium for senior skills
    }
  };

  // Calculate UK-specific additional costs for in-house developers
  const calculateUKInHouseCosts = (salary: number) => {
    // UK-specific calculations based on 2024/25 tax year
    const employerNIC = salary > 12570 ? (salary - 12570) * 0.138 : 0; // 13.8% above £12,570
    const pensionContribution = salary * 0.03; // Minimum 3% employer pension contribution
    const benefits = salary * 0.25; // 25% for UK benefits package (insurance, sick pay, holiday, training)
    
    const totalCost = salary + employerNIC + pensionContribution + benefits;
    
    return {
      salary,
      employerNIC,
      pensionContribution,
      benefits,
      total: totalCost
    };
  };

  // Add tech stack
  const addTechStack = (tech?: string) => {
    const techToAdd = tech || newTech.trim();
    if (techToAdd && techStack.length < 3 && !techStack.includes(techToAdd)) {
      setTechStack([...techStack, techToAdd]);
      setNewTech('');
      setShowSuggestions(false);
    }
  };

  // Remove tech stack
  const removeTechStack = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  // Handle Enter key for tech stack input
  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechStack();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle input change for tech stack
  const handleTechInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTech(value);
    setShowSuggestions(value.length > 0 && techStack.length < 3);
  };

  // Calculate totals with skillset complexity (no VAT)
  const calculateTotals = () => {
    const skillsetMultiplier = calculateSkillsetMultiplier();
    const requiredSkillLevel = getRequiredSkillLevel();
    
    const juniorInHouse = juniors > 0 ? calculateUKInHouseCosts(ukCostData.junior.salary * juniors) : { total: 0, salary: 0, employerNIC: 0, pensionContribution: 0, benefits: 0 };
    const midLevelInHouse = midLevel > 0 ? calculateUKInHouseCosts(ukCostData.midLevel.salary * midLevel) : { total: 0, salary: 0, employerNIC: 0, pensionContribution: 0, benefits: 0 };
    const seniorInHouse = seniors > 0 ? calculateUKInHouseCosts(ukCostData.senior.salary * seniors) : { total: 0, salary: 0, employerNIC: 0, pensionContribution: 0, benefits: 0 };
    
    // Apply skillset multiplier to Higgs Boson rates (no VAT)
    const juniorHiggs = juniors * ukCostData.junior.higgs * skillsetMultiplier;
    const midLevelHiggs = midLevel * ukCostData.midLevel.higgs * skillsetMultiplier;
    const seniorHiggs = seniors * ukCostData.senior.higgs * skillsetMultiplier;
    
    const totalInHouse = juniorInHouse.total + midLevelInHouse.total + seniorInHouse.total;
    const totalHiggs = juniorHiggs + midLevelHiggs + seniorHiggs;
    const totalSavings = totalInHouse - totalHiggs;
    
    return {
      inHouse: { 
        junior: juniorInHouse, 
        midLevel: midLevelInHouse, 
        senior: seniorInHouse, 
        total: totalInHouse 
      },
      higgs: { 
        junior: juniorHiggs, 
        midLevel: midLevelHiggs, 
        senior: seniorHiggs, 
        total: totalHiggs
      },
      savings: { 
        junior: juniorInHouse.total - juniorHiggs, 
        midLevel: midLevelInHouse.total - midLevelHiggs, 
        senior: seniorInHouse.total - seniorHiggs, 
        total: totalSavings 
      },
      skillsetMultiplier,
      requiredSkillLevel
    };
  };

  const totals = calculateTotals();

  // Format currency for UK
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(mode === 'monthly' ? amount / 12 : amount);
  };

  // Load parameters from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('junior')) setJuniors(parseInt(urlParams.get('junior') || '0'));
    if (urlParams.get('mid')) setMidLevel(parseInt(urlParams.get('mid') || '1'));
    if (urlParams.get('senior')) setSeniors(parseInt(urlParams.get('senior') || '0'));
    if (urlParams.get('mode')) setMode(urlParams.get('mode') || 'annual');
    if (urlParams.get('tech')) {
      const techs = urlParams.get('tech')?.split(',').filter(Boolean) || [];
      setTechStack(techs.slice(0, 3)); // Max 3 tech stacks
    }
  }, []);

  return (
    <div className={styles.priceComparison}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>UK Development Team Calculator</div>
            <h1 className={styles.heroTitle}>UK Development Team Cost Comparison</h1>
            <p className={styles.heroDescription}>
              Compare the true cost of building an in-house UK development team versus partnering 
              with Higgs Boson Consultancy. Our calculator includes all UK-specific costs including 
              National Insurance, pension contributions, and comprehensive benefits packages.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className={styles.calculatorSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            UK Development Team Cost Calculator
            <span className={styles.subtitle}>In-house vs. Higgs Boson Consultancy</span>
          </h2>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.developerControls}>
              <div className={styles.developerControl}>
                <label className={styles.controlLabel}>Junior developers needed:</label>
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
                <label className={styles.controlLabel}>Mid-level developers needed:</label>
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
                <label className={styles.controlLabel}>Senior developers needed:</label>
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

            {/* Tech Stack Input */}
            <div className={styles.techStackSection}>
              <label className={styles.controlLabel}>Technology Stack (max 3):</label>
              
              <div className={styles.techStackInputContainer}>
                <input
                  type="text"
                  value={newTech}
                  onChange={handleTechInputChange}
                  onKeyPress={handleTechKeyPress}
                  onFocus={() => setShowSuggestions(newTech.length > 0 && techStack.length < 3)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter technology (e.g., React, Django, PostgreSQL)"
                  disabled={techStack.length >= 3}
                  className={styles.techStackInput}
                />
                <div className={styles.inputIcon}>🔧</div>
                
                {/* Suggestions dropdown */}
                {showSuggestions && getAvailableTech().length > 0 && (
                  <div className={styles.suggestions}>
                    {getAvailableTech().map((tech, index) => (
                      <div 
                        key={index} 
                        className={styles.suggestionItem}
                        onClick={() => addTechStack(tech)}
                      >
                        <span className={styles.techName}>{tech}</span>
                        <span className={styles.techComplexity}>
                          {techComplexity[tech].complexity === 'expert' ? '🔥 Expert' : 
                           techComplexity[tech].complexity === 'high' ? '⭐ Advanced' : 
                           techComplexity[tech].complexity === 'medium' ? '💡 Intermediate' : '✅ Basic'}
                        </span>
                        <span className={styles.techMultiplier}>
                          +{((techComplexity[tech].multiplier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.tagCounter}>
                <span>Technologies added:</span>
                <span className={`${styles.countBadge} ${techStack.length >= 3 ? styles.maxReached : ''}`}>
                  {techStack.length}/3
                </span>
              </div>

              {techStack.length > 0 ? (
                <div className={styles.techStackTags}>
                  {techStack.map((tech, index) => (
                    <div key={index} className={styles.techTag}>
                      <div className={styles.techTagIcon}>
                        {techComplexity[tech] ? (
                          techComplexity[tech].complexity === 'expert' ? '🔥' : 
                          techComplexity[tech].complexity === 'high' ? '⭐' : 
                          techComplexity[tech].complexity === 'medium' ? '💡' : '✅'
                        ) : '⚡'}
                      </div>
                      <span>{tech}</span>
                      {techComplexity[tech] && (
                        <span className={styles.multiplierBadge}>
                          +{((techComplexity[tech].multiplier - 1) * 100).toFixed(0)}%
                        </span>
                      )}
                      <button 
                        onClick={() => removeTechStack(tech)}
                        className={styles.removeTag}
                        aria-label={`Remove ${tech}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>💻</div>
                  <div className={styles.emptyText}>No technologies added yet. Start typing to add your tech stack!</div>
                </div>
              )}

              <div className={styles.techStackHelper}>
                <p className={styles.helperText}>
                  <strong>💡 Pro tip:</strong> Different technologies have different complexity levels and affect pricing. 
                  Expert-level technologies like Kubernetes, AI/ML, and cloud platforms require specialized skills and 
                  may increase costs. Choose technologies that match your project needs.
                </p>
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
            {/* UK In-House Table */}
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <h3>🇬🇧 UK In-House Developers</h3>
              </div>
              
              <div className={styles.comparisonTable}>
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}></div>
                  <div className={styles.tableCell}>Junior ({juniors})</div>
                  <div className={styles.tableCell}>Mid-Level ({midLevel})</div>
                  <div className={styles.tableCell}>Senior ({seniors})</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Annual salary (before tax)</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.junior.salary)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.midLevel.salary)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.senior.salary)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>NIC (National Insurance Contribution)</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.junior.employerNIC)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.midLevel.employerNIC)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.senior.employerNIC)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Pension contribution (3% minimum)</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.junior.pensionContribution)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.midLevel.pensionContribution)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.senior.pensionContribution)}</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Benefits (insurance, sick pay, holiday, training)</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.junior.benefits)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.midLevel.benefits)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.inHouse.senior.benefits)}</div>
                </div>

                <div className={`${styles.tableRow} ${styles.totalRow}`}>
                  <div className={styles.tableCell}><strong>Total {mode} cost</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.junior.total)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.midLevel.total)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.inHouse.senior.total)}</strong></div>
                </div>
              </div>
            </div>

            {/* Higgs Boson Table */}
            <div className={styles.tableContainer}>
              <div className={`${styles.tableHeader} ${styles.higgsHeader}`}>
                <h3>⚡ Higgs Boson Consultancy</h3>
                {techStack.length > 0 && (
                  <div className={styles.techStackDisplay}>
                    <div>
                      <span>Tech Stack: </span>
                      {techStack.map((tech, index) => (
                        <span key={index} className={styles.techBadge}>
                          {tech}
                          {techComplexity[tech] && (
                            <span className={styles.complexityIndicator}>
                              {techComplexity[tech].complexity === 'expert' ? '🔥' : 
                               techComplexity[tech].complexity === 'high' ? '⭐' : 
                               techComplexity[tech].complexity === 'medium' ? '💡' : '✅'}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className={styles.skillsetInfo}>
                      <span>Complexity Multiplier: <strong>{(totals.skillsetMultiplier * 100 - 100).toFixed(0)}%</strong></span>
                      <span>Required Level: <strong className={styles.skillLevel}>{totals.requiredSkillLevel}</strong></span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.comparisonTable}>
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}></div>
                  <div className={styles.tableCell}>Junior ({juniors})</div>
                  <div className={styles.tableCell}>Mid-Level ({midLevel})</div>
                  <div className={styles.tableCell}>Senior ({seniors})</div>
                </div>

                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>Higgs Boson {mode} cost</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.junior)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.midLevel)}</div>
                  <div className={styles.tableCell}>{formatCurrency(totals.higgs.senior)}</div>
                </div>

                {/* Show included services */}
                {['NIC & Tax obligations', 'Pension contributions', 'Comprehensive benefits', 'Training & Development'].map((item, index) => (
                  <div key={index} className={styles.tableRow}>
                    <div className={styles.tableCell}>{item}</div>
                    <div className={styles.tableCell}>✅ Included</div>
                    <div className={styles.tableCell}>✅ Included</div>
                    <div className={styles.tableCell}>✅ Included</div>
                  </div>
                ))}

                <div className={`${styles.tableRow} ${styles.totalRow}`}>
                  <div className={styles.tableCell}><strong>Total {mode} cost</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.junior)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.midLevel)}</strong></div>
                  <div className={styles.tableCell}><strong>{formatCurrency(totals.higgs.senior)}</strong></div>
                </div>

                <div className={`${styles.tableRow} ${styles.savingsRow}`}>
                  <div className={styles.tableCell}><strong>Your {mode} savings</strong></div>
                  <div className={styles.tableCell}>
                    <strong className={styles.savingsAmount}>
                      {totals.savings.junior > 0 ? `💰 ${formatCurrency(totals.savings.junior)}` : '-'}
                    </strong>
                  </div>
                  <div className={styles.tableCell}>
                    <strong className={styles.savingsAmount}>
                      {totals.savings.midLevel > 0 ? `💰 ${formatCurrency(totals.savings.midLevel)}` : '-'}
                    </strong>
                  </div>
                  <div className={styles.tableCell}>
                    <strong className={styles.savingsAmount}>
                      {totals.savings.senior > 0 ? `💰 ${formatCurrency(totals.savings.senior)}` : '-'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3>💰 Total {mode.charAt(0).toUpperCase() + mode.slice(1)} Savings</h3>
              <div className={styles.totalSavings}>
                {totals.savings.total > 0 ? formatCurrency(totals.savings.total) : 'No savings with current configuration'}
              </div>
              {totals.savings.total > 0 && (
                <p className={styles.savingsNote}>
                  Save up to {Math.round((totals.savings.total / totals.inHouse.total) * 100)}% compared to in-house hiring
                </p>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            <p>
              <strong>UK Cost Calculation Methodology:</strong> Figures include accurate UK employer costs based on 2024/25 tax year rates. 
              In-house costs include: base salary, employer National Insurance (13.8% above £12,570), minimum 3% pension contribution, 
              and 25% benefits allocation covering statutory sick pay, holiday pay, insurance, and training budgets. 
              All calculations use current UK employment law requirements.
            </p>
            <p>
              <strong>Higgs Boson Rates:</strong> Based on £175/day rate for 220 working days annually. 
              All UK compliance, benefits, and administrative costs included. 
              Rates may vary based on specific technology requirements and project complexity. 
              Technology complexity multipliers range from basic (1.0x) to expert level (up to 1.6x).
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to build your UK development team?</h2>
          <p>Get started with experienced UK developers. No hiring hassles, no employment costs.</p>
          <div className={styles.ctaButtons}>
            <Link to="/contact" className={styles.primaryButton}>Get Your Quote</Link>
            <Link to="/project-estimation" className={styles.secondaryButton}>Project Estimation</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceComparison;
