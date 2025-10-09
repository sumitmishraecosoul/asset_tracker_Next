"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import assetService from "../../../../../../services/assetService";

export default function AssetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const id = Number(decodeURIComponent((params?.id || "").toString()));
        const response = await assetService.getAssetsById(id);
        const assetData = response.data?.data || response.data;
        setAsset(assetData);
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError('Failed to load asset details');
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchAsset();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="text-slate-600">Loading asset details...</div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Asset Not Found</h2>
          <button onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Go Back</button>
        </div>
        <p className="text-slate-600">{error || 'No asset found for id provided in the URL.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset Details</h2>
          <p className="text-slate-500 text-sm">Overview and specifications</p>
        </div>
        <button onClick={() => router.back()} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">Go Back</button>
      </div>
      <div className="text-slate-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Asset Tag ID</div>
            <div className="font-medium">{asset.assetTagId}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Checked Out</div>
            <div className="font-medium">{String(asset.checkOut)}</div>
        </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Status</div>
            <div className="font-medium">{asset.status}</div>
              </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Category ID</div>
            <div className="font-medium">{asset.categoryId}</div>
              </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Subcategory ID</div>
            <div className="font-medium">{asset.subCategoryId}</div>
            </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Location ID</div>
            <div className="font-medium">{asset.locationId ?? '—'}</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Site ID</div>
            <div className="font-medium">{asset.siteId ?? '—'}</div>
                </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Assigned To ID</div>
            <div className="font-medium">{asset.assignedToId ?? '—'}</div>
                </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Location</div>
            <div className="font-medium">{asset.location?.location ?? asset.location ?? '—'}</div>
                </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs uppercase text-slate-500 mb-1">Site</div>
            <div className="font-medium">{asset.site?.site ?? asset.site ?? '—'}</div>
          </div>
        </div>

        {asset.computerDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Computer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard label="Brand" value={asset.computerDetails.brand} />
              <DetailCard label="Model" value={asset.computerDetails.model} />
              <DetailCard label="Serial Number" value={asset.computerDetails.serialNumber} />
              <DetailCard label="Processor" value={asset.computerDetails.processor} />
              <DetailCard label="RAM 1" value={asset.computerDetails.ram1} />
              <DetailCard label="RAM 2" value={asset.computerDetails.ram2} />
              <DetailCard label="Total RAM" value={asset.computerDetails.totalRam} />
              <DetailCard label="Warranty Start" value={asset.computerDetails.warrantyStart} />
              <DetailCard label="Warranty End" value={asset.computerDetails.warrantyEnd} />
              <DetailCard label="Asset ID" value={asset.computerDetails.assetId} />
          </div>
        </div>
        )}

        {asset.externalDetails && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">External Equipment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard label="Brand" value={asset.externalDetails.brand} />
              <DetailCard label="Model" value={asset.externalDetails.model} />
              <DetailCard label="Serial Number" value={asset.externalDetails.serialNumber} />
              <DetailCard label="Warranty Start" value={asset.externalDetails.warrantyStart} />
              <DetailCard label="Warranty End" value={asset.externalDetails.warrantyEnd} />
              <DetailCard label="Asset ID" value={asset.externalDetails.assetId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
      <div className="text-xs uppercase text-slate-500 mb-1">{label}</div>
      <div className="font-medium">{value ?? '—'}</div>
    </div>
  );
}