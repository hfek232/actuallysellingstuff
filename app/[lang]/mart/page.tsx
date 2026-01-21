'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link'; // Import Link for navigation

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
}

function App() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!supabase) {
      setError('Supabase client not initialized. Check environment variables.');
      setLoading(false);
      return;
    }

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.rpc('get_distinct_categories', { search_term: searchTerm });
        if (error) throw error;
        const uniqueCategories = data
          .map(item => item.category)
          .filter(category => category && category.trim() !== '')
          .sort();
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [searchTerm]);

  return (
<div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
  <div className="max-w-8xl w-full bg-white shadow-lg rounded-lg p-8">
    <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
      Explore Our Product Categories
    </h1>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search categories..."
      // Retro search input styling
      className="w-full p-3 mb-6 border-2 border-gray-400 rounded-md bg-gray-50 text-gray-800 placeholder-gray-600 focus:outline-none focus:border-gray-700 transition duration-200"
    />
    {loading && (
      <div className="text-center text-gray-700 text-lg">Loading categories...</div>
    )}
    {error && (
      <div className="text-center text-red-600 text-lg p-4 bg-red-100 border border-red-400 rounded-md">
        Error: {error}
      </div>
    )}
    {!loading && !error && categories.length === 0 && (
      <div className="text-center text-gray-600 text-lg">No categories found.</div>
    )}
    {!loading && !error && categories.length > 0 && (
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          gap-6
        "
      >
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/products?category=${encodeURIComponent(category)}`} // URL with category query param
            // Retro black and white style for each category card
            className="
              group
              relative flex flex-col items-center justify-center text-center
              p-6 rounded-lg
              bg-gray-900 text-white
              border-2 border-gray-700
              shadow-lg
              overflow-hidden
              transition duration-300 ease-in-out
              transform hover:scale-103
              cursor-pointer
            "
          >
            {/* Retro Overlay for Hover Effect (optional, for more depth) */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

            <span className="
              text-xl md:text-2xl font-bold uppercase tracking-wider
              text-shadow-sm /* Optional: for a subtle text shadow if you have custom utility */
            ">
              {category}
            </span>
          </Link>
        ))}
      </div>
    )}
  </div>
</div>  );
}

export default App;