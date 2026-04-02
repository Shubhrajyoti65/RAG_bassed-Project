const CATEGORY_RULES = [
  {
    category: "Domestic Violence",
    keywords: ["abuse", "violence", "hit", "assault", "harass", "cruelty"],
  },
  {
    category: "Maintenance",
    keywords: [
      "money",
      "financial support",
      "maintenance",
      "alimony",
      "monthly expense",
    ],
  },
  {
    category: "Custody",
    keywords: ["child", "custody", "guardian", "visitation", "minor"],
  },
  {
    category: "Property",
    keywords: ["property", "land", "house", "plot", "ownership"],
  },
  {
    category: "Dowry",
    keywords: ["dowry", "gift demand", "in-laws", "bride"],
  },
];

// Detects likely legal category from free-form case text using simple keyword scoring.
function detectCategory(text) {
  const normalizedText = String(text || "").toLowerCase();
  if (!normalizedText.trim()) {
    return "General";
  }

  let bestCategory = "General";
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    const score = rule.keywords.reduce(
      (count, keyword) => count + (normalizedText.includes(keyword) ? 1 : 0),
      0
    );

    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}

module.exports = { detectCategory };
