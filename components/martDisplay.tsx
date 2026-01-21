import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const MartDisplay: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("inethioproducts").select("*");
      if (error) {
        // Handle error
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <MaxWidthWrapper>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">#mart</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-muted-foreground mt-2">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default MartDisplay;
