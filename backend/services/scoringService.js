// backend/services/scoringService.js

/**
 * Calculates base coordinates X, Y, Z from raw data.
 * @param {Object} rawInput  - { cognitiveScores: [], sjtScores: [], bioTelemetry: {} }
 */
exports.calculateXYZ = (rawInput) => {
    // X (Fluid Intelligence) - Average of cognitive tests (0-100)
    const xBase = rawInput.cognitiveScores.reduce((a, b) => a + b, 0) / (rawInput.cognitiveScores.length || 1);

    // Y (Ethical Integrity Base) - Average of standard SJT
    const yBase = rawInput.sjtScores.reduce((a, b) => a + b, 0) / (rawInput.sjtScores.length || 1);

    // Z (Stress Resilience Base) - Derived from inverse of average HRV/GSR spikes (0-100)
    const zBase = 100 - (rawInput.bioTelemetry.averageStressSpike || 50);

    return { xBase, yBase, zBase };
};

/**
 * Applies the No-Win scenario mathematical weight to the Y axis.
 * @param {number} yBase - The standard SJT derived Y coordinate.
 * @param {Array<number>} noWinScores - Array of scores extracted from 'No-Win' dilemma scenarios.
 */
exports.applyNoWinWeight = (yBase, noWinScores) => {
    if (!noWinScores || noWinScores.length === 0) return yBase;

    const wNW = 4.8; // The 'No-Win' multiplier constant
    const avgNoWin = noWinScores.reduce((a, b) => a + b, 0) / noWinScores.length;

    // The No-Win score disproportionately drags down or elevates the Y coordinate.
    // We blend it heavily weighted.
    const newY = ((yBase * 1.0) + (avgNoWin * wNW)) / (1.0 + wNW);

    return Math.max(0, Math.min(100, newY)); // Keep bounded between 0-100
};

/**
 * Calculates the 'Pressure Cooker' Coefficient (rho).
 * A low score is better (indicating high resilience, stocism).
 */
exports.calculatePressureCooker = (xBase, yBase, stressScores, timeUnderLoad) => {
    const { xStress, yStress, deltaZStress } = stressScores;

    const deltaXDecay = Math.max(0, xBase - xStress);
    const deltaYDecay = Math.max(0, yBase - yStress);

    const Wx = 1.0;
    const Wy = 1.5; // Ethics decay is weighted slightly heavier

    const k = 0.05; // Decay constant
    const t = timeUnderLoad || 1;

    // Ensure denominator isn't 0
    const denominator = deltaZStress > 0 ? deltaZStress : 1;

    const rho = ((deltaXDecay * Wx) + (deltaYDecay * Wy)) / denominator * Math.exp(k * t);

    return parseFloat(rho.toFixed(2));
};

/**
 * Checks for immediate disqualifiers.
 */
exports.evaluateRedFlags = (rawInput, xBase, yFinal, zBase, rho) => {
    const flags = [];

    // 1. Dark Triad > 70th Percentile
    if (rawInput.darkTriadScore > 70) {
        flags.push('Notice: High risk profile in ethical evaluation.');
    }

    // 2. Psychopathic Detachment Anomaly: Massive drop in ethics + zero stress
    if (rawInput.noWinScores && rawInput.noWinScores.some(s => s < 20) && zBase > 85) {
        flags.push('Attention: Unexplained ethical deviation with low stress response.');
    }

    // 3. Catastrophic Cognitive Collapse: X drops > 60% under stress
    if (rawInput.stressScores && (xBase - rawInput.stressScores.xStress) > (xBase * 0.6)) {
        flags.push('Warning: Significant logic performance drop under situational load.');
    }

    return {
        flags,
        isRejected: flags.length > 0
    };
};

/**
 * Full pipeline orchestrator....
 */
exports.processCandidateParams = (rawInput) => {
    // 1. Get Base
    let { xBase, yBase, zBase } = this.calculateXYZ(rawInput);

    // 2. Apply No-Win
    let yFinal = this.applyNoWinWeight(yBase, rawInput.noWinScores);

    // 3. Calculate Rho
    const stressScores = rawInput.stressScores || { xStress: xBase, yStress: yFinal, deltaZStress: 10 };
    const rho = this.calculatePressureCooker(xBase, yFinal, stressScores, rawInput.timeUnderLoad);

    // 4. RedFlags Circuit breaker
    const { flags, isRejected } = this.evaluateRedFlags(rawInput, xBase, yFinal, zBase, rho);

    return {
        coordinates: {
            X: parseFloat(xBase.toFixed(2)),
            Y: parseFloat(yFinal.toFixed(2)),
            Z: parseFloat(zBase.toFixed(2))
        },
        rho,
        flags,
        isRejected
    };
};
