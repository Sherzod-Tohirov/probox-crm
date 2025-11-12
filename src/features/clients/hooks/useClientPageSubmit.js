import { useCallback } from 'react';
import moment from 'moment';
import * as _ from 'lodash';
import formatDate from '@utils/formatDate';
import useMutateClientPageForm from '@hooks/data/clients/useMutateClientPageForm';

/**
 * Custom hook to handle ClientPage form submission
 * @param {Object} currentClient - The current client data
 * @param {Function} onSuccess - Callback to execute on successful submission
 * @returns {Object} Submit handler and mutation state
 */
export default function useClientPageSubmit(currentClient, onSuccess) {
  const updateMutation = useMutateClientPageForm();

  const handleSubmit = useCallback(
    async (data) => {
      // Only format agreementDate if it exists and is not empty/dash
      let formattedAgreementDate = null;
      if (
        data?.agreementDate &&
        data.agreementDate !== '-' &&
        data.agreementDate !== ''
      ) {
        formattedAgreementDate = formatDate(
          data.agreementDate,
          'DD.MM.YYYY',
          'YYYY.MM.DD'
        );
        // Check if formatting resulted in invalid date
        if (formattedAgreementDate === 'Invalid date') {
          formattedAgreementDate = null;
        }
      }

      const formattedDueDate = moment(currentClient['DueDate']).format(
        'YYYY.MM.DD'
      );

      const phonePayload = {
        ...(data.telephone ? { Phone1: data.telephone } : {}),
        ...(data.additional_telephone
          ? { Phone2: data.additional_telephone }
          : {}),
      };

      const payload = {
        docEntry: currentClient?.['DocEntry'],
        installmentId: currentClient?.['InstlmntID'],
        data: {
          slpCode: data?.executor,
          DueDate: formattedDueDate,
          ...phonePayload,
          ...(formattedAgreementDate
            ? { newDueDate: formattedAgreementDate }
            : {}),
          ...(!_.isEmpty(phonePayload)
            ? { CardCode: currentClient?.['CardCode'] }
            : {}),
        },
      };

      try {
        await updateMutation.mutateAsync(payload);
        onSuccess?.();
      } catch (error) {
        console.error('Client page submit error:', error);
      }
    },
    [currentClient, updateMutation, onSuccess]
  );

  return {
    handleSubmit,
    isSubmitting: updateMutation.isPending,
  };
}
