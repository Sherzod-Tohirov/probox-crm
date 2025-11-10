import { useMemo, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useFetchLeadById from '@/hooks/data/leads/useFetchLeadById';
import useMutateLead from '@/hooks/data/leads/useMutateLead';
import useFetchLeadFiles from '@/hooks/data/leads/useFetchLeadFiles';
import { useMutateFileUpload } from '@/hooks/data/leads/useMutateFileUpload';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import useAuth from '@/hooks/useAuth';
import useAlert from '@/hooks/useAlert';
import hasRole from '@/utils/hasRole';

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
  const { alert } = useAlert();
  const [passportFiles, setPassportFiles] = useState([]);

  // Fetch data
  const { data, isLoading } = useFetchLeadById(leadId);
  const { data: lead } = data ?? {};
  const { data: executors = [] } = useFetchExecutors({
    include_role: ['Operator1', 'Operator2', 'Seller', 'Scoring', 'OperatorM'],
  });

  const cardCode = lead?.cardCode ?? leadId;
  const { data: filesData } = useFetchLeadFiles(cardCode, { retry: 2 });

  // Mutations
  const updateLead = useMutateLead(leadId, {
    onSuccess: () => {
      queryClient.invalidateQueries(['lead', leadId]);
      alert("Lead ma'lumotlari muvaffaqiyatli yangilandi", { type: 'success' });
    },
  });

  const { mutateFileUpload } = useMutateFileUpload();

  // User permissions
  const currentUserRole = user?.['U_role'] ?? '';
  const isOperatorManager = currentUserRole === 'OperatorM';
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
        ]);
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
    return hasRole(currentUserRole, ['OperatorM']);
  }, [currentUserRole, isBlocked]);

  const canEditBlockedStatus = hasRole(currentUserRole, ['OperatorM', 'CEO']);

  // File handling
  const serverFiles = useMemo(() => {
    const list = Array.isArray(filesData) ? filesData : filesData?.data ?? [];
    return list.map((f) => ({
      id: f._id || f.id || f.key,
      preview: f.url,
      file: null,
      source: 'server',
      fileName: f.fileName,
      mimeType: f.mimeType,
      size: f.size,
    }));
  }, [filesData]);

  const uploadValue = useMemo(
    () => [...passportFiles, ...serverFiles],
    [passportFiles, serverFiles]
  );

  const handleUploadDocuments = useCallback(() => {
    if (!passportFiles?.length) return;
    const formData = new FormData();
    passportFiles.forEach((p) => {
      if (p?.file instanceof File) {
        formData.append('images', p.file, p.file.name);
      }
    });
    const cardCodeFinal = cardCode;
    mutateFileUpload.mutate(
      { cardCode: cardCodeFinal, formData },
      {
        onSuccess: () => {
          setPassportFiles([]);
          queryClient.invalidateQueries(['lead', leadId]);
          queryClient.invalidateQueries(['lead-files', cardCodeFinal]);
        },
      }
    );
  }, [passportFiles, cardCode, mutateFileUpload, queryClient, leadId]);

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

  return {
    lead,
    isLoading,
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
    mutateFileUpload,
    customBreadcrumbs,
    defaultTab,
  };
}
