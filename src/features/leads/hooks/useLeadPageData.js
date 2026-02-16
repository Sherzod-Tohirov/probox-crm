import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useFetchLeadById from '@/hooks/data/leads/useFetchLeadById';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useFetchLeadFiles from '@/hooks/data/leads/useFetchLeadFiles';
import { useMutateFileUpload } from '@/hooks/data/leads/useMutateFileUpload';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import useAuth from '@/hooks/useAuth';
import useAlert from '@/hooks/useAlert';
import hasRole from '@/utils/hasRole';
import { ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS } from '../utils/constants';

const TAB_TO_ROLE = {
  operator1: 'Operator1',
  operator2: 'Operator2',
  seller: 'Seller',
  scoring: 'Scoring',
  operatorM: 'OperatorM',
};

const ROLE_TO_TAB = {
  Operator1: 'operator1',
  Operator2: 'operator2',
  Seller: 'seller',
  Scoring: 'scoring',
};

export default function useLeadPageData(leadId) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = user?.U_role ?? null;
  const { alert } = useAlert();
  const [passportFiles, setPassportFiles] = useState([]);

  // Fetch data
  const { data, isLoading, isError, error } = useFetchLeadById(leadId, {
    queryOptions: {
      retry: 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  });
  const { data: lead } = data ?? {};
  const { data: executors = [] } = useFetchExecutors({
    include_role: ['Operator1', 'Operator2', 'Seller', 'Scoring', 'OperatorM'],
  });

  const { data: filesData } = useFetchLeadFiles(
    { leadId },
    {
      retry: 2,
      enabled: !!leadId && !isError,
      queryOptions: {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    }
  );
  // Mutations
  const updateLead = useMutateLead(leadId, {
    onSuccess: () => {
      alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
    },
  });

  const { mutateFileUpload, mutateFileDelete, mutateWithProgress } =
    useMutateFileUpload();

  // User permissions
  const currentUserRole = user?.['U_role'] ?? '';
  const isOperatorManager =
    currentUserRole === 'OperatorM' || currentUserRole === 'CEO';
  const isBlocked = lead?.isBlocked === true;

  const canEditTab = useCallback(
    (tabKey) => {
      // If lead is blocked, no one can edit except for blocked status itself
      if (isBlocked) return false;

      if (tabKey === 'all') {
        return hasRole(currentUserRole, [
          'Operator1',
          'Operator2',
          'Seller',
          'Scoring',
          'OperatorM',
          'CEO',
        ]);
      }

      // Operator1 ga operator2 accesslarini ham berish
      if (tabKey === 'operator2' && currentUserRole === 'Operator1') {
        return true;
      }

      return currentUserRole === TAB_TO_ROLE[tabKey];
    },
    [currentUserRole, isBlocked]
  );

  const canEditAddress = useMemo(() => {
    if (isBlocked) return false;
    return (
      canEditTab('operator1') ||
      canEditTab('operator2') ||
      canEditTab('operatorM') ||
      canEditTab('seller') ||
      canEditTab('scoring')
    );
  }, [canEditTab, isBlocked]);

  const canEditStatus = useMemo(() => {
    if (isBlocked) return false;
    return true;
    // return hasRole(currentUserRole, [
    //   'OperatorM',
    //   'CEO',
    //   'Scoring',
    //   'Operator1',
    //   'Operator2',
    // ]);
  }, [isBlocked]);

  const canEditBlockedStatus = hasRole(currentUserRole, ['CEO']);

  // File handling
  const serverFiles = useMemo(() => {
    const listRaw = Array.isArray(filesData)
      ? filesData
      : (filesData?.images ?? []);
    const seen = new Set();
    const list = listRaw.filter((f) => {
      const keyRaw =
        f._id || f.id || f.key || f.url || f?.urls?.small || f?.fileName;
      const key = keyRaw != null ? String(keyRaw) : null;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return list.map((f) => {
      // Generate pdfUrl from pdfKey if pdfUrl is not available
      let pdfUrl = f.pdfUrl || null;
      if (!pdfUrl && f.isPdf && f.pdfKey) {
        // Generate pdfUrl from pdfKey (minio URL format)
        // Format: https://minio.probox.uz/probox-bucket/{pdfKey}
        pdfUrl = `https://minio.probox.uz/probox-bucket/${f.pdfKey}`;
      }

      return {
        id: String(f._id || f.id || f.key),
        preview: f?.url ?? f?.urls?.small,
        previewLarge: f?.urls?.large,
        file: null,
        source: 'server',
        fileName: f.fileName,
        mimeType: f.mimeType,
        size: f.size,
        isPdf: f.isPdf || false,
        pdfUrl: pdfUrl,
      };
    });
  }, [filesData]);

  const uploadValue = useMemo(() => {
    const makeSig = (name, size) => (name ? `${name}|${size || ''}` : null);
    const serverSigs = new Set(
      serverFiles.map((s) => makeSig(s.fileName, s.size)).filter(Boolean)
    );
    const localFiltered = passportFiles.filter((p) => {
      if (p?.source !== 'local') return true;
      const sig = p?.file ? makeSig(p.file.name, p.file.size) : null;
      return sig ? !serverSigs.has(sig) : true;
    });
    // Final dedupe across the entire combined list by normalized unique key
    const combined = [...localFiltered, ...serverFiles];
    const seenAll = new Set();
    const result = [];
    for (const it of combined) {
      const keyRaw = it.id ?? it.preview ?? it.previewLarge ?? it.fileName;
      const key = keyRaw != null ? String(keyRaw) : null;
      if (!key || seenAll.has(key)) continue;
      seenAll.add(key);
      result.push(it);
    }
    return result;
  }, [passportFiles, serverFiles]);

  const handleUploadDocuments = useCallback(async () => {
    if (!passportFiles?.length) return;

    const updateLocal = (id, patch) => {
      setPassportFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
      );
    };
    const removeLocal = (id) => {
      setPassportFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const locals = passportFiles.filter((p) => p?.source === 'local');
    for (const item of locals) {
      updateLocal(item.id, { status: 'yuklanmoqda', progress: 0 });

      const formData = new FormData();
      formData.append('image', item.file, item.file.name);
      formData.append('leadId', leadId);

      await new Promise((resolve) => {
        mutateWithProgress(
          {
            formData,
            onProgress: (pct) => updateLocal(item.id, { progress: pct }),
          },
          {
            onSuccess: (res) => {
              // Optimistically add created images to cache if present
              try {
                const extract = (payload) => {
                  if (!payload) return [];
                  if (Array.isArray(payload)) return payload;
                  if (Array.isArray(payload.images)) return payload.images;
                  if (Array.isArray(payload.data)) return payload.data;
                  return [];
                };
                const created = extract(res).map((f) => ({
                  id: f._id || f.id || f.key,
                  url: f?.url,
                  urls: f?.urls,
                  fileName: f.fileName,
                  mimeType: f.mimeType,
                  size: f.size,
                }));
                if (created.length) {
                  queryClient.setQueryData(['lead-files', leadId], (prev) => {
                    const prevImages = Array.isArray(prev)
                      ? prev
                      : Array.isArray(prev?.images)
                        ? prev.images
                        : [];
                    // prevent re-adding items already present (normalize to string)
                    const prevKeys = new Set(
                      prevImages.map((it) =>
                        String(
                          it._id || it.id || it.key || it.url || it?.urls?.small
                        )
                      )
                    );
                    const createdFiltered = created.filter(
                      (it) => !prevKeys.has(String(it.id))
                    );
                    const merged = [...createdFiltered, ...prevImages];
                    const seen = new Set();
                    const deduped = [];
                    for (const it of merged) {
                      const keyRaw =
                        it._id || it.id || it.key || it.url || it?.urls?.small;
                      const key = keyRaw != null ? String(keyRaw) : null;
                      if (!key || seen.has(key)) continue;
                      seen.add(key);
                      deduped.push(it);
                    }
                    return Array.isArray(prev)
                      ? deduped
                      : { ...(prev || {}), images: deduped };
                  });
                }
              } catch (err) {
                console.log(err);
              }

              updateLocal(item.id, { status: 'success', progress: 100 });
              // Remove local to avoid duplicate once server item exists
              removeLocal(item.id);
              resolve();
            },
            onError: () => {
              updateLocal(item.id, { status: 'failed' });
              resolve();
            },
          }
        );
      });
    }

    // Final reconciliation
    queryClient.invalidateQueries(['lead', leadId]);
    queryClient.invalidateQueries(['lead-files', leadId]);
  }, [passportFiles, leadId, mutateWithProgress, queryClient]);

  const handleUploadSingle = useCallback(
    async (file) => {
      if (!file || file.source !== 'local') return;
      const updateLocal = (id, patch) => {
        setPassportFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
        );
      };
      const removeLocal = (id) => {
        setPassportFiles((prev) => prev.filter((f) => f.id !== id));
      };

      updateLocal(file.id, { status: 'yuklanmoqda', progress: 0 });
      const formData = new FormData();
      formData.append('image', file.file, file.file.name);
      formData.append('leadId', leadId);

      return new Promise((resolve) => {
        mutateWithProgress(
          {
            formData,
            onProgress: (pct) => updateLocal(file.id, { progress: pct }),
          },
          {
            onSuccess: (res) => {
              try {
                const extract = (payload) => {
                  if (!payload) return [];
                  if (Array.isArray(payload)) return payload;
                  if (Array.isArray(payload.images)) return payload.images;
                  if (Array.isArray(payload.data)) return payload.data;
                  return [];
                };
                const createdRaw = extract(res);
                const created = createdRaw.map((f) => ({
                  id: f._id || f.id || f.key,
                  url: f?.url,
                  urls: f?.urls,
                  fileName: f.fileName,
                  mimeType: f.mimeType,
                  size: f.size,
                }));
                if (created.length) {
                  queryClient.setQueryData(['lead-files', leadId], (prev) => {
                    const prevImages = Array.isArray(prev)
                      ? prev
                      : Array.isArray(prev?.images)
                        ? prev.images
                        : [];
                    const prevKeys = new Set(
                      prevImages.map((it) =>
                        String(
                          it._id || it.id || it.key || it.url || it?.urls?.small
                        )
                      )
                    );
                    const createdFiltered = created.filter(
                      (it) => !prevKeys.has(String(it.id))
                    );
                    const merged = [...createdFiltered, ...prevImages];
                    const seen = new Set();
                    const deduped = [];
                    for (const it of merged) {
                      const keyRaw =
                        it._id || it.id || it.key || it.url || it?.urls?.small;
                      const key = keyRaw != null ? String(keyRaw) : null;
                      if (!key || seen.has(key)) continue;
                      seen.add(key);
                      deduped.push(it);
                    }
                    return Array.isArray(prev)
                      ? deduped
                      : { ...(prev || {}), images: deduped };
                  });
                }
              } catch (err) {
                console.log(err);
              }
              updateLocal(file.id, { status: 'success', progress: 100 });
              removeLocal(file.id);
              queryClient.invalidateQueries(['lead-files', leadId]);
              resolve();
            },
            onError: () => {
              updateLocal(file.id, { status: 'failed' });
              resolve();
            },
          }
        );
      });
    },
    [leadId, mutateWithProgress, queryClient]
  );

  const handleDeleteDocument = useCallback(
    async (fileId) => {
      const key = ['lead-files', leadId];

      // Normalize fileId to string for comparison
      const normalizedFileId = String(fileId);

      // Helper function to extract images array from response
      const extractImages = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.images)) return data.images;
        return [];
      };

      // Get current data for optimistic update and rollback
      const currentData = queryClient.getQueryData(key);
      const previousData = currentData
        ? JSON.parse(JSON.stringify(currentData))
        : null;

      // Optimistic update - remove file from cache immediately
      if (currentData) {
        const currentImages = extractImages(currentData);
        const filteredImages = currentImages.filter((f) => {
          const fId = String(f._id || f.id || f.key || '');
          return fId !== normalizedFileId;
        });

        // Update cache with filtered list
        queryClient.setQueryData(key, (old) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return filteredImages;
          }
          // Handle object structure
          if (old.status !== undefined) {
            return { ...old, images: filteredImages };
          }
          return { ...old, images: filteredImages };
        });
      }

      try {
        // Delete file from server
        await mutateFileDelete.mutateAsync({ fileId });

        // On success, refetch to ensure consistency
        await queryClient.refetchQueries({ queryKey: key });
      } catch (error) {
        // On error, rollback to previous state
        if (previousData) {
          queryClient.setQueryData(key, previousData);
        }
        throw error;
      }
    },
    [mutateFileDelete, queryClient, leadId]
  );

  // Breadcrumbs
  const customBreadcrumbs = useMemo(() => {
    if (!lead) return null;
    return [
      {
        path: '/leads',
        label: 'Leadlar',
        isMainPath: true,
      },
      {
        path: `/leads/${leadId}`,
        label: lead?.clientName || `${leadId}`,
        isLastPath: true,
      },
    ];
  }, [lead, leadId]);

  // Default tab
  const defaultTab = ROLE_TO_TAB[currentUserRole] ?? 'operator1';
  useEffect(() => {
    if (!ALLOWED_ROLES_FOR_SEEING_RETURNED_LEADS.includes(role)) return;
    if (lead?.seen === false) {
      updateLead.mutate({ seen: true });
    }
  }, [lead, user, role, updateLead]);
  return {
    lead,
    role,
    isLoading,
    isError,
    error,
    executors,
    currentUserRole,
    isOperatorManager,
    isBlocked,
    canEditTab,
    canEditAddress,
    canEditStatus,
    canEditBlockedStatus,
    updateLead,
    passportFiles,
    setPassportFiles,
    uploadValue,
    handleUploadDocuments,
    handleUploadSingle,
    handleDeleteDocument,
    mutateFileUpload,
    customBreadcrumbs,
    defaultTab,
  };
}
