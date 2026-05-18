import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Trash2, Eye, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function FeaturedDealsAdmin() {
  const [deals, setDeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const loadDeals = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const response = await fetch(`${BACKEND_URL}/api/deals/list?limit=${limit}&skip=${skip}&search=${encodeURIComponent(search)}`);
      const data = await response.json();
      setDeals(data.deals || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error loading deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this deal?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${BACKEND_URL}/api/deals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      loadDeals();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Featured Deals</h1>
          <p className="text-gray-600">Manage showcased lease deals</p>
        </div>
        <Button
          onClick={() => navigate('/admin/featured-deals/create')}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Deal
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search deals (make, model, year)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {deals.length} of {total} deals
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deals List</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="flex items-center px-2 text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No deals found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Drive-Off</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deals.map(deal => (
                    <tr key={deal._id || deal.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold">
                          {deal.year} {deal.brand} {deal.model}
                        </div>
                        <div className="text-sm text-gray-500">{deal.trim || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-red-600">
                          ${(deal.calculated_payment || 0).toFixed(0)}/mo
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        ${(deal.calculated_driveoff || 0).toFixed(0)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={deal.is_active ? 'default' : 'secondary'}>
                          {deal.is_active ? 'Active' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {deal.created_at ? new Date(deal.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link to={`/deal/${deal._id || deal.id}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(deal._id || deal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
