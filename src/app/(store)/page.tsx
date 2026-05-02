import { Hero, CategoriesGrid, FeaturedProducts, NewArrivals, FlashDeals, CategoryProductSection } from "@/components/home/Sections";
import { TrustBadges } from "@/components/common/TrustBadges";
import { ContactBanner } from "@/components/common/ContactBanner";
import { supabaseAdmin } from "@/lib/supabase";
import { getBanners, getCategorias } from "@/lib/api-logic";

export default async function Home() {
  const [banners, categories] = await Promise.all([
    getBanners('home'),
    getCategorias()
  ]);

  // Buscar categorias ativas para a home
  const { data: configData } = await supabaseAdmin
    .from('configuracoes_loja')
    .select('valor')
    .eq('chave', 'categorias_home_ativas')
    .maybeSingle();

  let activeHomeCategories: string[] = [];
  try {
    activeHomeCategories = configData?.valor ? JSON.parse(configData.valor) : [];
  } catch (e) {
    activeHomeCategories = [];
  }

  return (
    <>
      <Hero banners={banners} />
      <CategoriesGrid initialCategories={categories} />
      <FeaturedProducts />
      
      {/* Vitrines de Categorias Dinâmicas */}
      {activeHomeCategories.map((catName) => (
        <CategoryProductSection 
          key={catName} 
          title={catName} 
          categorySlug={catName} 
        />
      ))}

      <NewArrivals />
      <FlashDeals />
      <ContactBanner />
      <TrustBadges variant="banner" />
    </>
  );
}
