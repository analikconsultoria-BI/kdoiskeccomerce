import { Product, Category, Review } from "@/types";

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Cera e Limpeza",
    slug: "cera-e-limpeza",
    description: "Protetores de cera e kits de higienização",
    image: "/categorias/1.png",
  },
  {
    id: "cat-2",
    name: "Baterias Diversas",
    slug: "baterias-diversas",
    description: "Tamanhos 10, 13, 312 e 675",
    image: "/categorias/2.png",
  },
  {
    id: "cat-3",
    name: "Acessórios Premium",
    slug: "acessorios-premium",
    description: "Estojos, filtros e desumidificadores",
    image: "/categorias/1.png", // Usando o 1 como placeholder para o terceiro
  },
];

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    author: "João Silva",
    rating: 5,
    date: "10 Jan 2024",
    title: "Excelente!",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Maria Oliveira",
    rating: 4,
    date: "15 Fev 2024",
    title: "Muito bom produto",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Carlos Santos",
    rating: 5,
    date: "20 Mar 2024",
    title: "Entrega rápida",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    verified: true,
  },
  {
    id: "rev-4",
    author: "Ana Costa",
    rating: 5,
    date: "05 Abr 2024",
    title: "Vale cada centavo",
    content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    verified: true,
  },
  {
    id: "rev-5",
    author: "Roberto Moura",
    rating: 4,
    date: "12 Mai 2024",
    title: "Recomendo",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    verified: true,
  },
  {
    id: "rev-6",
    author: "Fernanda Lima",
    rating: 5,
    date: "22 Jun 2024",
    title: "Superou as expectativas",
    content: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    verified: true,
  },
];

// Gerar 24 produtos placeholders de forma determinística para evitar erros de hidratação no Next.js
export const mockProducts: Product[] = Array.from({ length: 24 }).map((_, i) => {
  // Usar o índice 'i' para gerar valores que serão os mesmos no servidor e no cliente
  const price = 15 + ((i * 37) % 435); 
  const installmentValue = price / 3;
  const pixPrice = price * 0.95; 
  
  const categoryIndex = i % 3;
  const inStock = ((i * 11) % 10) !== 0; // Aproximadamente 90% em estoque

  let badge: Product["badge"] | undefined;
  if (i === 0 || i === i % 10) badge = "Novo";
  else if (i === 1 || i % 7 === 0) badge = "Mais Vendido";
  else if (i === 2 || i % 5 === 0) badge = "Promoção";

  const originalPrice = badge === "Promoção" ? price * 1.2 : undefined;
  const freeShipping = i % 2 === 0;
  const deliveryDays = 1 + (i % 5);

  return {
    id: `prod-${i + 1}`,
    name: `Produto Exemplo ${i + 1}`,
    slug: `produto-exemplo-${i + 1}`,
    price: price,
    originalPrice,
    freeShipping,
    deliveryDays,
    installments: {
      count: 3,
      value: installmentValue,
    },
    pixPrice: pixPrice,
    category: mockCategories[categoryIndex],
    rating: 4 + (((i * 9) % 11) / 10), // Determinístico entre 4.0 e 5.0
    reviewsCount: ((i * 17) % 191) + 10,
    soldCount: ((i * 23) % 951) + 50,
    shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    benefits: [
      "Alta durabilidade",
      "Qualidade garantida",
      "Pronto para uso",
    ],
    description: `
      <h2>Uma solução definitiva para sua necessidade</h2>
      <p>O Produto Exemplo ${i + 1} foi desenvolvido para oferecer a máxima performance em todas as situações do dia a dia. Com tecnologia de ponta, garante resultados superiores em comparação com outras alternativas do mercado.</p>
      <h3>Por que escolher este produto?</h3>
      <ul>
        <li>Fabricado com materiais de alta resistência</li>
        <li>Design focado em usabilidade e conforto</li>
        <li>Rendimento otimizado para maior economia</li>
      </ul>
      <p>Não deixe para amanhã o que você pode resolver hoje. A KdoisK traz até você o que há de melhor no segmento, com garantia de satisfação.</p>
    `,
    specifications: {
      "Marca": "KdoisK Essentials",
      "Modelo": `KX-${1000 + i}`,
      "Peso": `${(((i * 7) % 200) / 100).toFixed(2)} kg`,
      "Dimensões": "15 x 10 x 5 cm",
      "Garantia": "12 meses",
    },
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    badge: badge,
    inStock,
  };
});

export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((p) => p.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return mockProducts.filter((p) => p.category.slug === categorySlug);
};

export const mockFaqs = [
  {
    question: "Como rastrear meu pedido?",
    answer: "Você pode rastrear seu pedido através do link enviado para o seu e-mail de cadastro, ou acessando a área 'Meus Pedidos' em sua conta.",
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo varia conforme a sua região. Para capitais, oferecemos entrega em até 3 dias úteis. Para demais regiões, o prazo médio é de 5 a 7 dias úteis.",
  },
  {
    question: "Como trocar um produto?",
    answer: "Você tem até 30 dias após o recebimento para solicitar a troca. Entre em contato com nosso suporte informando o número do pedido e o motivo.",
  },
  {
    question: "Quais as formas de pagamento?",
    answer: "Aceitamos cartões de crédito em até 10x, PIX com 5% de desconto e boleto bancário à vista.",
  },
  {
    question: "Como funciona a política de garantia?",
    answer: "Todos os nossos produtos contam com garantia mínima de 90 dias contra defeitos de fabricação. Alguns itens possuem garantia estendida de até 12 meses.",
  },
];
