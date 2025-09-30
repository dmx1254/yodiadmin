export type Category = {
  id: string;
  title: string;
  slug: string;
  subcategories?: SUBCATEGORY[];
};

export interface SUBCATEGORY {
  id: string;
  title: string;
  slug: string;
}

export const categories: Category[] = [
  {
    title: "Tisane",
    slug: "tisane",
    id: "hnjs12k",
    subcategories: [
      {
        title: "Detox",
        slug: "detox",
        id: "nxhapie",
      },
      {
        title: "Digestive",
        slug: "digestive",
        id: "vqpaxj",
      },
    ],
  },
  {
    id: "asdfgh",
    title: "Savon",
    slug: "savon",
    subcategories: [
      {
        id: "tyaw9e",
        title: "Op",
        slug: "op",
      },
    ],
  },
  {
    id: "zxcvbn",
    title: "Cheveux",
    slug: "cheveux",
  },
  {
    title: "Huile",
    slug: "huile",
    id: "pacf9l4",

    subcategories: [
      {
        title: "Huile barbe",
        slug: "huile-barbe",
        id: "bzparer",
      },
      {
        title: "Huile cheveux",
        slug: "huile-cheveux",
        id: "zpqadi",
      },
    ],
  },
  {
    title: "Baume",
    slug: "baume",
    id: "nzpwtb",

    subcategories: [
      {
        title: "Baume à barbe",
        slug: "huile-a-barbe",
        id: "zvalpqvxj",
      },
      {
        title: "Baume pour cheveux",
        slug: "baume-pour-cheveux",
        id: "xpaceioa",
      },
    ],
  },

  {
    title: "Gomme à lèvres",
    slug: "gomme-a-levres",
    id: "gyg6k6h",
  },
  {
    id: "jnxk4j",
    title: "Soin du visage",
    slug: "soin-du-visage",
  },

  {
    id: "lzqp9t",
    title: "Bain & Corps",
    slug: "bain-corps",
  },
  {
    id: "g5j6m0",
    title: "Korean Cosmetics",
    slug: "korean-cosmetics",
  },
  {
    id: "b51k0j",
    title: "Bebe & Maman",
    slug: "bebe-maman",
  },
  {
    id: "h6j7n1",
    title: "Sexualité",
    slug: "sexualite",
  },
];
