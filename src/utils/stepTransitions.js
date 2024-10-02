export const steps = ['Initial Contact', 'Follow-Up', 'Closing'];

export const stepTransitions = {
    "Initial Contact": ["Follow-Up"],
    "Follow-Up": ["Closing"],
    "Closing": [] // No further steps
};

export const canTransition = (currentStep, targetStep) => {
    return stepTransitions[currentStep].includes(targetStep);
};
