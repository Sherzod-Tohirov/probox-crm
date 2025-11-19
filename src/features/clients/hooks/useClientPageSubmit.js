import { useCallback } from 'react';
import moment from 'moment';
import * as _ from 'lodash';
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
      const currentNewDueRaw = currentClient?.['NewDueDate'] || null;
      const currentNewDueNorm = currentNewDueRaw
        ? moment(
            currentNewDueRaw,
            [
              'YYYY.MM.DD HH:mm',
              'YYYY-MM-DD HH:mm:ss.SSSSSSSSS',
              moment.ISO_8601,
            ],
            true
          ).format('YYYY.MM.DD HH:mm')
        : null;

      let submittedNewDueNorm = null;
      if (
        data?.agreementDate &&
        data.agreementDate !== '-' &&
        data.agreementDate !== ''
      ) {
        const parsedAgreement = moment(
          data.agreementDate,
          'DD.MM.YYYY HH:mm',
          true
        );
        submittedNewDueNorm = parsedAgreement.isValid()
          ? parsedAgreement.format('YYYY.MM.DD HH:mm')
          : null;
      }

      const shouldSendNewDue =
        !!submittedNewDueNorm && submittedNewDueNorm !== currentNewDueNorm;

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
          ...(shouldSendNewDue ? { newDueDate: submittedNewDueNorm } : {}),
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
