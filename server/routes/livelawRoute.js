const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

const LIVELAW_TOP_STORIES_URL = "https://www.livelaw.in/top-stories";
const MAX_ARTICLES = 6;
const ARTICLE_KEYWORDS = ["court", "judge", "bench", "judgment", "held"];

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasRelevantKeyword(article) {
  const haystack = `${article.title} ${article.summary}`.toLowerCase();
  return ARTICLE_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function resolveUrl(href) {
  if (!href) {
    return "";
  }

  try {
    return new URL(href, LIVELAW_TOP_STORIES_URL).href;
  } catch {
    return "";
  }
}

function isPotentialArticleLink(link) {
  if (!link) {
    return false;
  }

  try {
    const url = new URL(link);
    const pathname = url.pathname.toLowerCase().replace(/\/+$/, "");
    const isStorySection =
      pathname.includes("/top-stories/") ||
      pathname.includes("/supreme-court/") ||
      pathname.includes("/high-court/");

    // LiveLaw story pages end with an article id suffix like "-529211".
    const hasStoryIdSuffix = /-\d+$/.test(pathname);
    return isStorySection && hasStoryIdSuffix;
  } catch {
    return false;
  }
}

function readSummaryFromCard($, anchorElement, title) {
  const card = $(anchorElement).closest("article, li, .row, .col, div");
  if (!card.length) {
    return "";
  }

  const textBlocks = [];
  card.find("p, span").each((_, node) => {
    textBlocks.push(normalizeText($(node).text()));
  });

  for (const text of textBlocks) {
    if (!text) {
      continue;
    }

    if (text === title) {
      continue;
    }

    if (text.length < 35) {
      continue;
    }

    if (/^by\s+/i.test(text)) {
      continue;
    }

    if (/livelaw\s+news\s+network/i.test(text)) {
      continue;
    }

    return text;
  }

  return "";
}

function scrapeLiveLawArticles(html) {
  const $ = cheerio.load(html);
  const results = [];
  const seenLinks = new Set();

  $("a[href]").each((_, element) => {
    if (results.length >= MAX_ARTICLES) {
      return false;
    }

    const link = resolveUrl($(element).attr("href"));
    if (!isPotentialArticleLink(link) || seenLinks.has(link)) {
      return undefined;
    }

    const title = normalizeText($(element).text());
    if (!title || title.length < 25) {
      return undefined;
    }

    const summary = readSummaryFromCard($, element, title) || title;
    const article = {
      title,
      summary,
      link,
    };

    if (!hasRelevantKeyword(article)) {
      return undefined;
    }

    seenLinks.add(link);
    results.push(article);
    return undefined;
  });

  return results.slice(0, MAX_ARTICLES);
}

router.get("/livelaw", async (_req, res, next) => {
  try {
    const { data } = await axios.get(LIVELAW_TOP_STORIES_URL, {
      timeout: 12000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    const articles = scrapeLiveLawArticles(data);
    res.json({ articles });
  } catch (error) {
    error.statusCode = 502;
    error.message = "Unable to fetch LiveLaw articles right now.";
    next(error);
  }
});

module.exports = router;
