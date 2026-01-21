'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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

        const { data, error } = await supabase.rpc('get_distinct_categories', {});

        if (error) {
          throw error;
        }

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
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Explore Our Product Categories
        </h1>

        {loading && (
          <div className="text-center text-blue-600 text-lg">Loading categories...</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex items-center justify-center text-center text-xl font-semibold"
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;