import useFetchBranches from '@/hooks/data/useFetchBranches';
import useFetchExecutors from '@/hooks/data/useFetchExecutors';
// import useAuth from '@/hooks/useAuth';

export function useSelectOptions(tab) {
  // const { user } = useAuth();

  const { data: executors } = useFetchExecutors({
    // branch: user?.U_branch,
    include_role: 'Seller',
  });

  const { data: branches } = useFetchBranches();

  if (tab === 'common') {
    const rejectReasonOptions = [
      {
        value: 'Dubl lead',
        label: 'Dubl lead',
      },
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
        value: "Bosh to'lov to'g'ri kelmadi",
        label: "Bosh to'lov to'g'ri kelmadi",
      },
      {
        value: "Oylik to'lov to'g'ri kelmadi",
        label: "Oylik to'lov to'g'ri kelmadi",
      },
      {
        value: 'Mahsulot narxi qimmat ekan',
        label: 'Mahsulot narxi qimmat ekan',
      },
      {
        value: '3 shaxsga olib bermoqochi',
        label: '3 shaxsga olib bermoqochi',
      },
      {
        value: '1-2 kundan keyin kelar ekan',
        label: '1-2 kundan keyin kelar ekan',
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
      {
        value: 'Mashka',
        label: 'Mashka',
      },
    ];

    return { rejectReasonOptions };
  }

  if (tab === 'operator1') {
    const passportVisitOptions = [
      { value: 'Passport', label: 'Pasport' },
      { value: 'Visit', label: 'Tashrif' },
      { value: 'Processing', label: 'Jarayonda' },
    ];

    const callCountOptions = [...Array(5).keys()].map((i) => ({
      value: i + 1,
      label: i + 1,
    }));

    return { passportVisitOptions, callCountOptions };
  }

  if (tab === 'operator2') {
    const callCountOptions = [...Array(10).keys()].map((i) => ({
      value: i + 1,
      label: i + 1,
    }));
    return { callCountOptions };
  }

  if (tab === 'seller') {
    const sellerOptions =
      executors?.map((executor) => ({
        value: executor.SlpCode,
        label: executor.SlpName,
      })) ?? [];

    const sellTypeOptions = [
      {
        value: '',
        label: '-',
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
        // ?.filter((branch) => String(branch.id) === String(user?.U_branch))
        ?.map((branch) => ({
          value: branch.id,
          label: branch.name,
          code: branch.code,
        })) ?? [];

    return {
      sellerOptions,
      sellTypeOptions,
      branchOptions,
    };
  }
}
