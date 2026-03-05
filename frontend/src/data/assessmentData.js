// 50 Intelligence Puzzles (3x3 Matrix Pattern Recognition)
export const intelligencePuzzles = Array.from({ length: 50 }, (_, i) => {
    const shapes = ['Circle', 'Square', 'Triangle', 'Diamond', 'Hexagon'];
    const colors = ['Blue', 'Red', 'Green', 'Purple', 'Orange'];
    const rotations = [0, 45, 90, 135, 180];

    const baseShape = shapes[i % shapes.length];
    const baseColor = colors[i % colors.length];

    let grid = [];
    let correctVal = [];
    let options = [];

    // Pattern 1: Double Progression (Shape + Rotation)
    if (i % 3 === 0) {
        const shapeRow = shapes.slice(0, 3);
        grid = [
            [shapeRow[0], baseColor, 0], [shapeRow[1], baseColor, 45], [shapeRow[2], baseColor, 90],
            [shapeRow[1], baseColor, 90], [shapeRow[2], baseColor, 135], [shapeRow[0], baseColor, 180],
            [shapeRow[2], baseColor, 180], [shapeRow[0], baseColor, 225], null
        ];
        correctVal = [shapeRow[1], baseColor, 270];
        options = [
            { id: 'a', val: correctVal, label: "Option A" },
            { id: 'b', val: [shapeRow[1], baseColor, 180], label: "Option B" },
            { id: 'c', val: [shapeRow[0], baseColor, 270], label: "Option C" },
            { id: 'd', val: [shapeRow[2], baseColor, 90], label: "Option D" }
        ];
    }
    // Pattern 2: Color Cycle + Scale (Rotation used for scale)
    else if (i % 3 === 1) {
        const colorCycle = [colors[0], colors[1], colors[2]];
        grid = [
            [baseShape, colorCycle[0], 0], [baseShape, colorCycle[1], 45], [baseShape, colorCycle[2], 90],
            [baseShape, colorCycle[1], 90], [baseShape, colorCycle[2], 135], [baseShape, colorCycle[0], 180],
            [baseShape, colorCycle[2], 180], [baseShape, colorCycle[0], 225], null
        ];
        correctVal = [baseShape, colorCycle[1], 270];
        options = [
            { id: 'a', val: [baseShape, colorCycle[2], 270], label: "Option A" },
            { id: 'b', val: correctVal, label: "Option B" },
            { id: 'c', val: [baseShape, colorCycle[0], 270], label: "Option C" },
            { id: 'd', val: [baseShape, colorCycle[1], 180], label: "Option D" }
        ];
    }
    // Pattern 3: Dot Arithmetic (Summation)
    else {
        grid = [
            ['Dot-1', 'Gray', 0], ['Dot-2', 'Gray', 0], ['Dot-3', 'Gray', 0],
            ['Dot-2', 'Gray', 0], ['Dot-2', 'Gray', 0], ['Dot-4', 'Gray', 0],
            ['Dot-3', 'Gray', 0], ['Dot-4', 'Gray', 0], null
        ];
        correctVal = ['Dot-7', 'Gray', 0];
        options = [
            { id: 'a', val: ['Dot-6', 'Gray', 0], label: "Option A" },
            { id: 'b', val: ['Dot-5', 'Gray', 0], label: "Option B" },
            { id: 'c', val: correctVal, label: "Option C" },
            { id: 'd', val: ['Dot-8', 'Gray', 0], label: "Option D" }
        ];
    }

    // Shuffle options and find correct item
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    const correctOption = shuffledOptions.find(o =>
        o.val[0] === correctVal[0] &&
        o.val[1] === correctVal[1] &&
        o.val[2] === correctVal[2]
    );

    return {
        id: `intel-${i + 1}`,
        title: `Intelligence Matrix ${i + 1}`,
        description: "Analyze the sequence progression across both axes.",
        grid,
        options: shuffledOptions,
        correctId: correctOption.id
    };
});

// 50 Ethics Scenarios
export const ethicsScenarios = [
    {
        id: 'eth-1',
        title: "The Silent Defect",
        text: "You discover a minor security vulnerability in a legacy system. Fixing it would take days of downtime. Your manager asks you to log it as 'low priority' and move on.",
        options: [
            { text: "Advocate for immediate fix despite downtime.", score: 90 },
            { text: "Log as low priority but prepare a background patch.", score: 70 },
            { text: "Follow orders and move on.", score: 40 },
            { text: "Ignore the vulnerability entirely.", score: 10 }
        ]
    },
    {
        id: 'eth-2',
        title: "The Overqualified Friend",
        text: "A close friend applies for a role where you are the hiring lead. They are slightly less qualified than another candidate but need the job desperately.",
        options: [
            { text: "Recuse yourself from the decision process.", score: 100 },
            { text: "Recommend the more qualified candidate.", score: 80 },
            { text: "Hire your friend but give them extra training.", score: 40 },
            { text: "Falsify the friend's interview scores.", score: 0 }
        ]
    },
    {
        id: 'eth-3',
        title: "Data Monetization",
        text: "You find that your company is selling 'anonymized' data that can easily be de-anonymized with public records.",
        options: [
            { text: "Report to the Data Privacy Officer immediately.", score: 95 },
            { text: "Voice concerns during the next team meeting.", score: 60 },
            { text: "Document the findings but wait for others to notice.", score: 30 },
            { text: "Develop a tool to exploit this data further.", score: 0 }
        ]
    },
    // ... Expanding with professional dilemmas
    ...Array.from({ length: 47 }, (_, i) => ({
        id: `eth-${i + 4}`,
        title: `Professional Dilemma ${i + 4}`,
        text: `A situation arises involving ${['intellectual property', 'workplace fairness', 'financial reporting', 'client confidentiality', 'safety standards'][i % 5]} where you are pressured to ${['cut corners', 'mislead a stakeholder', 'ignore a policy', 'favor a colleague'][i % 4]}.`,
        options: [
            { text: "Maintain strict professional standards.", score: 90 + (i % 10) },
            { text: "Seek guidance from a neutral third party.", score: 70 + (i % 10) },
            { text: "Compromise slightly to meet the deadline.", score: 40 - (i % 10) },
            { text: "Prioritize personal gain/order over ethics.", score: 10 - (i % 10) }
        ]
    }))
];
