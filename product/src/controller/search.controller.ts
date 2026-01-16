import { Request, Response } from "express";
import { SearchHistory } from "../model/searchHistory.model";
import { Product } from "../model/product.model";


export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const q = req.query.q?.toString().trim().toLowerCase();
    const userId = req.headers["x-user-id"]?.toString();

    // when user click search bar// show recent searches
    if (!q) {
      if (!userId) {
        return res.json({ success: true, data: [] });
      }

      const popularProducts = await Product.find(
        {
          isPopular: true,
          isActive: true,
        },
        {
          name: 1,
          localName: 1,
          image: 1,
        }
      )
        .limit(5)
        .lean();

      const suggestions = popularProducts.map((p) => ({
        type: "popular",
        _id: p._id,
        name: p.name,
        localName: p.name,
        image: p.image?.[0].url || "",
      }));

      return res.json({
        success: true,
        title: "Try Searching for",
        data: suggestions,
      });
    }
    // when he starts typing

    const products = await Product.find(
      {
        isActive: true,
        $or: [
          { name: { $regex: `^${q}`, $options: "i" } },
          { localName: { $regex: `^${q}`, $options: "i" } },
          { tags: { $in: [new RegExp(`^${q}`, "i")] } },
        ],
      },
      { name: 1, localName: 1, image: 1 }
    )
      .limit(5)
      .lean();

    const suggestions = await products.map((p) => ({
      type: "product",
      _id: p._id,
      name: p.name,
      localName: p.localName,
      image: p.image?.[0].url || "",
    }));

    res.json({
      success: true,
      title: `Showing results for "${q}"`, // For frontend to display
      data: suggestions,
    });
  } catch (err: any) {
    console.error("Error in getSearchSuggestions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecentSearches = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"]?.toString();

    if (!userId) {
      return res.json({
        success: true,
        title: "Recent Searches",
        data: [],
      });
    }

    const recentSearches = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("productId productName productLocalName productImage ")
      .lean();

    const suggestions = recentSearches.map((s) => ({
      type: "recent",
      _id: s.productId,
      name: s.productName,
      localName: s.productLocalName,
      image: s.productImage,
    }));

    res.json({
      success: true,
      title: "Recently Searched",
      data: suggestions,
    });
  } catch (err: any) {
    console.error("Error in getRecentSearches:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// save product on search history
export const saveToSearchHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"]?.toString();

    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "product id required",
      });
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    // update to history
    // if already exist updates timestamp

    await SearchHistory.findOneAndUpdate(
      { userId, productId },
      {
        $set: {
          productLocalName: product.localName,
          productImage: product.image?.[0].url,
          createdAt: new Date(),
          productName: product.name,
        },
      },
      { upsert: true }
    );

    // odl search
    const oldSearches = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .skip(8)
      .select("_id");

    if (oldSearches.length > 0) {
      await SearchHistory.deleteMany({
        _id: { $in: oldSearches.map((s) => s._id) },
      });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Error in saveToSearchHistory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const clearSearchHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"]?.toString();

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await SearchHistory.deleteMany({ userId });

    res.json({ success: true, message: "Search history cleared" });
  } catch (err: any) {
    console.error("Error in clearSearchHistory:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};