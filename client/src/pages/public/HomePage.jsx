import { useEffect, useState } from "react";
import HeroSection from "../../components/home/HeroSection";
import FeaturedCategories from "../../components/home/FeaturedCategories";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import FeaturedSellers from "../../components/home/FeaturedSellers";
import TrustSection from "../../components/home/TrustSection";
import NewsletterSection from "../../components/home/NewsletterSection";
import { getHomePageDataApi } from "../../api/publicApi";

export default function HomePage() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSellers: 0,
    topCategory: "",
    topSeller: "",
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [featuredSellers, setFeaturedSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHomePageData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getHomePageDataApi();

      setSummary(data.summary || {});
      setFeaturedProducts(data.featuredProducts || []);
      setFeaturedCategories(data.featuredCategories || []);
      setFeaturedSellers(data.featuredSellers || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load homepage data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomePageData();
  }, []);

  return (
    <div>
      <HeroSection
        summary={summary}
        isLoading={isLoading}
      />
      <FeaturedCategories
        categories={featuredCategories}
        isLoading={isLoading}
        error={error}
      />
      <FeaturedProducts
        products={featuredProducts}
        isLoading={isLoading}
        error={error}
      />
      <FeaturedSellers
        sellers={featuredSellers}
        isLoading={isLoading}
        error={error}
      />
      <TrustSection />
      <NewsletterSection />
    </div>
  );
}