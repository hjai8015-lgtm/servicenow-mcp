const HELP_DATA = [
    {
        keywords: ["create incident", "new incident"],
        answer: "Go to Incident > Create New and submit the form.",
    },
    {
        keywords: ["assignment group"],
        answer: "Assignment group is the team responsible for resolving the task.",
    },
];
export function searchHelp(query) {
    const q = query.toLowerCase();
    const matches = HELP_DATA.filter(h => h.keywords.some(k => q.includes(k)));
    return matches.length
        ? matches.map(m => m.answer)
        : ["No help found"];
}
