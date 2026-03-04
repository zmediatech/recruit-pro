// backend/services/metrics.js

/**
 * Calculates the Stoic Polymath coordinates, flags, and the Pressure Cooker Coefficient.
 * @param {Object} rawData 
 * @returns {Object} { coordinates: {X,Y,Z}, rho, flags, isRejected }
 */
const calculateMetrics = (rawData) => {
    let X = rawData.fluidIntBaseline;
    let Y = rawData.ethicalBaseline;
    let Z = 100 - rawData.stressTelemetry; // Assuming lower stress telemetry = higher resilience. Or pass raw Z. Let's assume rawData.stressTelemetry is the Z score directly for simplicity.

    // Actually, let's treat the inputs as 1-100 scores.
    Z = rawData.stressTelemetry;

    const flags = [];
    let isRejected = false;

    // Weighting Logic: No-Win Scenario
    // Real Y score is a combination of baseline SJTs and the No-Win outcome.
    // If No-Win > Baseline, Em is high >1. If No-Win < 20 while baseline > 80, massive penalty.

    let Y_final = (rawData.ethicalBaseline * 0.3) + (rawData.noWinScore * 0.7);

    // Ethical Choice Check
    if (rawData.ethicalBaseline > 80 && rawData.noWinScore < 20) {
        flags.push("WARNING: Inconsistent ethical choices (High theory vs Low practice)");
        isRejected = true;
    }

    // Decay Variables for 'Reliability' Score (rho)
    // How much do they drop from baseline when stressed?
    const Dx = (rawData.fluidIntBaseline - rawData.fluidIntStressed) / rawData.fluidIntBaseline;
    const Dy = (rawData.ethicalBaseline - rawData.ethicalStressed) / rawData.ethicalBaseline;

    // We assume delta Z (stress increase) is high, let's use a normalized factor of 1 for the test max.
    const deltaZ = 1.0;

    // Rho calculation
    // wx = 0.4, wy = 0.6 (Ethics drop is punished more than Intelligence drop)
    let rho = 1 - (((0.4 * Dx) + (0.6 * Dy)) / deltaZ);

    // Profile Check (Simulated based on low integrity + high intelligence)
    if (X > 90 && Y_final < 30) {
        flags.push("WARNING: Risk Profile - High Intelligence with low integrity scores.");
        isRejected = true;
    }

    if (Z < 30 && rho < 0.5) {
        flags.push("WARNING: Significant performance drop under pressure.");
    }

    // Ensure rho is mathematically bounded roughly between 0 and 2 for UI scaling
    if (rho > 2) rho = 2.0;

    return {
        coordinates: {
            X: Number(X.toFixed(1)),
            Y: Number(Y_final.toFixed(1)),
            Z: Number(Z.toFixed(1))
        },
        rho: Number(rho.toFixed(2)),
        flags,
        isRejected
    };
};

module.exports = { calculateMetrics };
