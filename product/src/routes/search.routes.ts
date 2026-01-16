import express from "express";
import {
  getSearchSuggestions,
  getRecentSearches,
  saveToSearchHistory,
  clearSearchHistory,
} from "../controller/search.controller";

import { requireGateway } from "../middleware/requireGateway";

const router = express.Router();

router.use(requireGateway);

// Get suggestions (handles both empty and typing states)
router.get("/suggestions", getSearchSuggestions);

// Get recent searches
router.get("/recent", getRecentSearches);

// Save to history (call when user clicks on product)
router.post("/history", saveToSearchHistory);

// Clear history
router.delete("/history", clearSearchHistory);

export default router;