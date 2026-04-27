import { useState, useEffect } from 'react';
import { getCategories, type Category } from '../utils/supabaseClient';

type Props = {
  selected: string
  onChange: (category: string) => void
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories for filter:", err);
      }
    }
    load();
  }, []);

  const allCategories = ['All', ...categories.map(c => c.name)];

  return (
    /* Horizontally scrollable on mobile, wrapping on larger screens */
    <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible scrollbar-hide">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`
            flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap
            ${selected === cat
              ? 'bg-[#0F3D2E] text-white border-[#0F3D2E] shadow-md shadow-[#0F3D2E]/20'
              : 'bg-white text-[#0F3D2E] border-[#c5bfb5] hover:border-[#0F3D2E] hover:shadow-sm'
            }
          `}
        >
          {selected === cat && <span className="mr-1.5 text-[#C9A44C] text-[10px]">✦</span>}
          {cat}
        </button>
      ))}
    </div>
  )
}
