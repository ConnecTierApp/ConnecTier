import Link from 'next/link';

export const metadata = {
  title: 'Create New Entity | ConnecTier',
  description: 'Create a new entity in ConnecTier',
};

export function NewEntityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/entities" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Entities
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Create New Entity</h1>
      
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Entity Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter entity name"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Entity Type
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a type</option>
              <option value="person">Person</option>
              <option value="company">Company</option>
              <option value="organization">Organization</option>
              <option value="product">Product</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter entity description"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Attributes
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Attribute name"
                />
                <input
                  type="text"
                  className="w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Attribute value"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Attribute name"
                />
                <input
                  type="text"
                  className="w-2/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Attribute value"
                />
              </div>
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add another attribute
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/entities"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewEntityPage;
