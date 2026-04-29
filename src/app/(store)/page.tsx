import { Hero, CategoriesGrid, FeaturedProducts, NewArrivals, FlashDeals } from "@/components/home/Sections";
import { TrustBadges } from "@/components/common/TrustBadges";
import { ContactBanner } from "@/components/common/ContactBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoriesGrid />
      <FeaturedProducts />
      <NewArrivals />
      <FlashDeals />
      <ContactBanner />
      <TrustBadges variant="banner" />
    </>
  );
}
