// app/[lang]/products/page.tsx
'use client'; // This MUST be the very first line to ensure it's a Client Component

import { createClient } from '@/utils/supabase/client'; // Use client-side Supabase for client components
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'next/navigation'; // Correct hooks for Client Components
import React from 'react'; // Import React for useState, useEffect

export default function ProductsPage() {
  // CRITICAL: Use both 'common' (for link paths) and 'products' (for product-specific text) namespaces
  const { t } = useTranslation(['common', 'products']);
  const params = useParams();
  const searchParams = useSearchParams(); // Correct hook for client-side search params access

  const locale = typeof params.lang === 'string' ? params.lang : 'en';
  const category = searchParams.get('category') || ''; // Correct way to get category on client from useSearchParams

  const [products, setProducts] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const supabase = createClient(); // Initialize client-side Supabase

      let query = supabase.from('inethioproducts').select('*');
      if (category) {
        query = query.eq('category', category); // Filter by category
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError);
        setProducts(null);
        console.error('Error fetching products:', fetchError);
      } else {
        setProducts(data);
        setError(null);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category]); // Re-fetch products when category changes

  if (loading) {
    return (
      <MaxWidthWrapper className="py-8 text-center">
        {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
        <p className="text-gray-600">{t('loading_products_message', { ns: 'products' })}</p>
      </MaxWidthWrapper>
    );
  }

  if (error || !products) {
    return (
      <MaxWidthWrapper className="py-8">
        {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
        <h1 className="text-2xl font-bold text-red-600">{t('error_loading_products_title', { ns: 'products' })}</h1>
        <p className="text-gray-700">{t('error_message_prefix', { ns: 'products' })}: {error?.message || t('unknown_error_message', { ns: 'products' })}</p>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper className="py-8">
      <h1 className="text-3xl font-bold mb-4">
        {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
        {category ? `${t('category_products_title_prefix', { ns: 'products', category: category })}` : t('all_products_title', { ns: 'products' })}
      </h1>
      {products.length === 0 && (
        // CRITICAL FIX: Wrap conditional content in a React Fragment (<></>)
        <>
          {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
          <p className="text-gray-600">{t('no_products_found_message', { ns: 'products' })}</p>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.slug}
            // CRITICAL FIX: Link href uses translated path segment from 'common'
            href={`/${locale}/${t('products_link_path', { ns: 'common' })}/${product.slug}`}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
            )}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            {/* CRITICAL FIX: Explicitly specify namespace for products keys */}
            <p className="text-gray-600">{t('brand_prefix', { ns: 'products' })}: {product.brand}</p>
            <p className="text-gray-600">{t('category_prefix', { ns: 'products' })}: {product.category}</p>
            <p className="text-blue-600 font-semibold">{t('price_prefix', { ns: 'products' })}: {product.price_birr} {t('birr_currency', { ns: 'products' })}</p>
          </Link>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}