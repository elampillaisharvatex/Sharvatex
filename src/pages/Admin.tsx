import { useState, useEffect, useRef } from 'react'
import { getProducts, addProductData, deleteProduct, getCategories, addCategory, deleteCategory, getSiteSettings, updateSiteSettings, type Product, type Category } from '../utils/supabaseClient'
import { supabase } from '../lib/supabase'
import { Link, useLocation } from 'wouter'
import { uploadImage } from '../lib/uploadImage'

const EMPTY_FORM = {
  name: '',
  category_id: '',
  price: '',
  fabric: '',
  description: '',
}

export default function Admin() {
  const [, navigate] = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Category State
  const [newCategoryName, setNewCategoryName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  // Settings State
  const [showSettingsForm, setShowSettingsForm] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)

  // Product State
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkSession();
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/admin/login')
    } else {
      fetchCategories()
      fetchProducts()
      fetchSettings()
    }
  }

  async function fetchSettings() {
    try {
      const settings = await getSiteSettings()
      if (settings?.whatsapp_number) {
        setWhatsappNumber(settings.whatsapp_number)
      }
    } catch (err) {
      console.error('Failed to load settings', err)
    }
  }

  async function fetchCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
      if (data.length > 0) {
        setForm(f => ({ ...f, category_id: data[0].id }))
      }
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  async function fetchProducts() {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch products is now called inside checkSession
  // to prevent fetching before we know if the user is authenticated

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) {
      setFormError('Image must be under 20MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFormError(null)
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!form.name.trim() || !form.price.trim()) {
      setFormError('Name and Price are required.')
      return
    }

    setAdding(true)
    try {
      // 1. Create product row first
      const productData = {
        name: form.name.trim(),
        price: form.price.trim(),
        description: form.description.trim() || null,
        fabric: form.fabric.trim() || null,
        category_id: form.category_id
      }
      
      const newProduct = await addProductData(productData)

      // 2. Upload image and create product_images row if photo exists
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile);
        
        if (!uploadResult) throw new Error("Image upload failed");

        // Save image to product_images table
        const { error: insertError } = await supabase
          .from("product_images")
          .insert({
            product_id: newProduct.id,
            image_url: uploadResult.image_url,
            storage_path: uploadResult.storage_path
          })

        if (insertError) throw new Error("Saving image details failed: " + insertError.message)
      }

      setForm(EMPTY_FORM)
      clearImage()
      setShowForm(false)
      await fetchProducts()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add product')
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleteId(id)
    try {
      const success = await deleteProduct(id)
      if (!success) alert('Delete failed or product not found')
      await fetchProducts()
    } catch (err) {
      alert("Delete failed")
    }
    setDeleteId(null)
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category? Products in this category might be affected.")) return;
    setDeleteCategoryId(id)
    try {
      const success = await deleteCategory(id)
      if (!success) alert('Delete failed: category is likely in use')
      await fetchCategories()
    } catch (err) {
      alert("Delete failed")
    }
    setDeleteCategoryId(null)
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    if (!whatsappNumber.trim()) return alert("Please enter a WhatsApp number.")
    
    setSavingSettings(true)
    try {
      const success = await updateSiteSettings(whatsappNumber)
      if (success) alert("Settings saved successfully!")
      else alert("Failed to save settings.")
    } catch (err) {
      alert("Error saving settings.")
    } finally {
      setSavingSettings(false)
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    
    setAddingCategory(true)
    try {
      await addCategory(newCategoryName.trim())
      setNewCategoryName('')
      await fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add category')
    }
    setAddingCategory(false)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Navbar */}
      <nav className="bg-[#0F3D2E] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧵</span>
            <span className="text-white font-bold text-xl ml-1">Sharvatex Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#C9A44C] hover:text-white text-sm font-medium transition-colors">
              ← Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {/* Categories Management Section */}
      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Categories ({categories.length})</h1>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="bg-[#0F3D2E] hover:bg-[#1a5c42] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {showCategoryForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {/* Add Category Form & List */}
        {showCategoryForm && (
          <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6 mb-8 shadow-sm">
            <form onSubmit={handleAddCategory} className="flex gap-4 items-end mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Category Name</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Bridal Silk"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                />
              </div>
              <button
                type="submit"
                disabled={addingCategory || !newCategoryName.trim()}
                className="bg-[#C9A44C] hover:bg-[#b8923e] disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm whitespace-nowrap h-[38px]"
              >
                {addingCategory ? 'Adding...' : 'Add'}
              </button>
            </form>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Category Name</th>
                      <th className="px-4 py-2.5 font-medium text-right w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2.5 text-gray-800">{c.name}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            disabled={deleteCategoryId === c.id}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                          >
                            {deleteCategoryId === c.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-400">
                          No categories exist yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="max-w-5xl mx-auto border-[#e8e0d0]/60 my-2" />
      {/* Settings Section */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Site Settings</h1>
          <button
            onClick={() => setShowSettingsForm(!showSettingsForm)}
            className="bg-[#0F3D2E] hover:bg-[#1a5c42] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {showSettingsForm ? 'Cancel' : 'Manage Settings'}
          </button>
        </div>

        {showSettingsForm && (
          <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6 mb-4 shadow-sm max-w-md">
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store WhatsApp Number</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg px-3 py-2 text-gray-500 font-medium text-sm">
                    +
                  </span>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="919994466665"
                    className="w-full border border-gray-200 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Include country code without the '+' (e.g. 919994466665)</p>
              </div>
              <button
                type="submit"
                disabled={savingSettings || !whatsappNumber.trim()}
                className="w-full bg-[#C9A44C] hover:bg-[#b8923e] disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm h-[38px]"
              >
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>

      <hr className="max-w-5xl mx-auto border-[#e8e0d0]/60 my-2" />
      {/* Products Management Section */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0F3D2E]">Products ({products.length})</h1>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(null) }}
            className="bg-[#0F3D2E] hover:bg-[#1a5c42] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <form onSubmit={handleAdd} className="bg-white border border-[#e8e0d0] rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F3D2E] mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Kanjivaram Silk Saree"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                  placeholder="e.g. ₹1,200"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                <input
                  type="text"
                  value={form.fabric}
                  onChange={e => setForm({...form, fabric: e.target.value})}
                  placeholder="e.g. Pure Silk, Cotton"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={3}
                  placeholder="Brief product description..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Photo</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0F3D2E] hover:bg-green-50 transition-all">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP up to 20MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mt-4">
                {formError}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={adding}
                className="bg-[#0F3D2E] hover:bg-[#1a5c42] disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                {adding ? 'Adding...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => { setForm(EMPTY_FORM); setFormError(null); clearImage() }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </form>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">📦</p>
            <p>No products yet. Add your first product above.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d0] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0F3D2E] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Photo</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#0F3D2E]">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.categories?.name}</td>
                    <td className="px-4 py-3 font-bold text-[#C9A44C]">{p.price}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <span className="text-gray-400 text-xs">No photo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleteId === p.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-40 font-medium transition-colors text-xs"
                      >
                        {deleteId === p.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
