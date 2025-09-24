import React from 'react';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name = "Nhất Tín Software",
  url = "https://nhattinsoftware.com",
  logo = "https://nhattinsoftware.com/images/icon/logo.svg",
  description = "Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao.",
  address = {
    addressLocality: "Hà Nội",
    addressRegion: "Hà Nội",
    addressCountry: "VN"
  },
  contactPoint = {
    email: "contact@nhattinsoftware.com",
    contactType: "customer service"
  }
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "contactPoint": {
      "@type": "ContactPoint",
      ...contactPoint
    },
    "sameAs": [
      "https://facebook.com/nhattinsoftware",
      "https://twitter.com/nhattinsoftware",
      "https://linkedin.com/company/nhattinsoftware"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ProductSchema: React.FC<ProductSchemaProps> = ({
  name,
  description,
  image,
  price,
  currency = "VND",
  availability = "InStock",
  brand = "Nhất Tín Software",
  category,
  rating
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": `https://schema.org/${availability}`,
      "seller": {
        "@type": "Organization",
        "name": "Nhất Tín Software"
      }
    },
    ...(category && { "category": category }),
    ...(rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.ratingValue,
        "reviewCount": rating.reviewCount
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": author.name,
      ...(author.url && { "url": author.url })
    },
    "publisher": {
      "@type": "Organization",
      "name": publisher.name,
      "logo": {
        "@type": "ImageObject",
        "url": publisher.logo
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebsiteSchema: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nhất Tín Software",
    "url": "https://nhattinsoftware.com",
    "description": "Nhất Tín Software cung cấp các giải pháp phần mềm, dịch vụ công nghệ và ứng dụng di động chất lượng cao.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nhattinsoftware.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
