import { useState, useEffect } from 'react';

interface EnrichmentSuggestion {
  businessId: number;
  field: string;
  currentValue: string | number | null;
  suggestedValue: string | number | null;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  reasoning: string;
}

interface NewMarketDiscovery {
  business_name: string;
  location: string;
  activity: string;
  website: string;
  phone: string;
  email: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  discoveredAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminDashboard() {
  const [suggestions, setSuggestions] = useState<EnrichmentSuggestion[]>([]);
  const [discoveries, setDiscoveries] = useState<NewMarketDiscovery[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'discoveries'>('suggestions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [suggestionsRes, discoveriesRes] = await Promise.all([
        fetch(`${API_URL}/api/suggestions`),
        fetch(`${API_URL}/api/discoveries`),
      ]);

      const suggestionsData = await suggestionsRes.json();
      const discoveriesData = await discoveriesRes.json();

      setSuggestions(suggestionsData);
      setDiscoveries(discoveriesData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function applySuggestion(index: number) {
    try {
      const response = await fetch(`${API_URL}/api/suggestions/${index}/apply`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  }

  async function rejectSuggestion(index: number) {
    try {
      const response = await fetch(`${API_URL}/api/suggestions/${index}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    }
  }

  async function addDiscovery(index: number) {
    try {
      const response = await fetch(`${API_URL}/api/discoveries/${index}/add`, {
        method: 'POST',
      });

      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to add discovery:', error);
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800',
    };
    return colors[confidence as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Admin Dashboard</h1>
          <p className="text-gray-600">Review and approve suggestions from AI agents</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Data Enrichment ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('discoveries')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'discoveries'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            New Markets ({discoveries.length})
          </button>
        </div>

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No enrichment suggestions available. Run the enrichment agent to generate suggestions.
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Business ID: {suggestion.businessId}
                      </h3>
                      <p className="text-sm text-gray-500">Field: {suggestion.field}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge(
                        suggestion.confidence
                      )}`}
                    >
                      {suggestion.confidence} confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Current Value:</p>
                      <p className="text-gray-900">
                        {suggestion.currentValue || <span className="text-gray-400 italic">empty</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Suggested Value:</p>
                      <p className="text-gray-900 font-semibold">{suggestion.suggestedValue}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Source:</p>
                    <p className="text-gray-900">{suggestion.source}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Reasoning:</p>
                    <p className="text-gray-900">{suggestion.reasoning}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => applySuggestion(index)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      ✓ Apply Suggestion
                    </button>
                    <button
                      onClick={() => rejectSuggestion(index)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'discoveries' && (
          <div className="space-y-4">
            {discoveries.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No new market discoveries available. Run the discovery agent to find new markets.
              </div>
            ) : (
              discoveries.map((discovery, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{discovery.business_name}</h3>
                      <p className="text-gray-600">{discovery.location}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge(
                        discovery.confidence
                      )}`}
                    >
                      {discovery.confidence} confidence
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Activity:</span> {discovery.activity}
                    </p>
                    {discovery.website && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Website:</span>{' '}
                        <a
                          href={discovery.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          {discovery.website}
                        </a>
                      </p>
                    )}
                    {discovery.phone && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span> {discovery.phone}
                      </p>
                    )}
                    {discovery.email && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {discovery.email}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm">
                      <span className="font-semibold">Source:</span> {discovery.source}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="font-semibold">Discovered:</span>{' '}
                      {new Date(discovery.discoveredAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addDiscovery(index)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      ✓ Add to Directory
                    </button>
                    <button
                      onClick={() => rejectSuggestion(index)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
