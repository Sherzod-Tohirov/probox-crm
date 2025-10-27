import useFetchBranches from '@/hooks/data/useFetchBranches';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
import useAuth from '@/hooks/useAuth';

export function useSelectOptions(tab) {
  const { user } = useAuth();
  const { data: executors } = useFetchExecutors({
    branchId: user?.branchId,
    include_role: 'Seller',
  });
  const { data: branches } = useFetchBranches();

  if (tab === 'common') {
    const rejectReasonOptions = [
      {
        value: "Yosh to'g'ri kelmaydi",
        label: "Yosh to'g'ri kelmaydi",
      },
      {
        value: 'Toshkentga kela olmaydi',
        label: 'Toshkentga kela olmaydi',
      },
      {
        value: "Narxi to'g'ri kelmadi",
        label: "Narxi to'g'ri kelmadi",
      },
      {
        value: 'Iphone kerak emas',
        label: 'Iphone kerak emas',
      },
      {
        value: 'iCloud / Karobka olib qolinishi',
        label: 'iCloud / Karobka olib qolinishi',
      },
      {
        value: 'Mijoz filialga kela olmaydi',
        label: 'Mijoz filialga kela olmaydi',
      },
      {
        value: 'Skoringdan bekor qilindi',
        label: 'Skoringdan bekor qilindi',
      },
      {
        value: 'Umuman aloqaga chiqib bo`lmadi',
        label: 'Umuman aloqaga chiqib bo`lmadi',
      },
      {
        value: 'Boshqa joydan sotib olibdi',
        label: 'Boshqa joydan sotib olibdi',
      },
    ];

    return { rejectReasonOptions };
  }

  if (tab === 'operator1') {
    const passportVisitOptions = [
      { value: 'Passport', label: 'Pasport' },
      { value: 'Visit', label: 'Tashrif' },
      { value: 'Process', label: 'Jarayonda' },
    ];

    return { passportVisitOptions };
  }

  if (tab === 'seller') {
    const consultantOptions =
      executors?.map((executor) => ({
        value: executor.id,
        label: executor.name,
      })) ?? [];

    const sellTypeOptions = [
      {
        value: 'trade',
        label: 'Trade-in',
      },
      {
        value: 'nasiya',
        label: 'Nasiya',
      },
      {
        value: 'naqd',
        label: 'Naqd',
      },
    ];

    const branchOptions =
      branches
        ?.filter((branch) => branch.id === user?.branchId)
        ?.map((branch) => ({
          value: branch.id,
          label: branch.name,
        })) ?? [];

    return { consultantOptions, sellTypeOptions, branchOptions };
  }
}
