import { useEffect } from "react";

const useFilter = () => {
  const isFirstRender = useRef(true);
  const formRef = useRef(null);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const { alert } = useAlert();

  const { refs, floatingStyles, strategy, x, y } = useFloating({
    open: showFilterMenu,
    onOpenChange: setShowFilterMenu,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    placement: "bottom",
    whileElementsMounted: autoUpdate,
  });

  const [toggleSearchFields, setToggleSearchFields] = useState({
    search: false,
    phone: false,
  });

  const dispatch = useDispatch(); // Add dispatch
  const { query, phone } = useFilter();
  const { data: executors, isPending: isExecutorsLoading } =
    useFetchExecutors();
  const filterState = useSelector((state) => state.page.clients.filter);
  const clientsPageState = useSelector((state) => state.page.clients);

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors, {
      label: "SlpName",
      value: "SlpCode",
    });
  }, [executors]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...filterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(executorsOptions, filterState.slpCode),
    },
    resolver: yupResolver(filterClientFormSchema),
    mode: "all",
  });

  const watchedFields = useWatchFilterFields(watch);
  const handleSearchSelect = useCallback((clientData, filterKey) => {
    setValue(filterKey, clientData);
    dispatch(
      setClientsFilter({
        ...filterState, // Preserve existing filters
        [filterKey]: clientData,
      })
    );

    setToggleSearchFields((prev) => ({
      ...prev,
      [filterKey]: false,
    }));
  }, []);

  const handleFilterClear = useCallback(() => {
    handleStoreFilterLastAction();
    dispatch(setClientsFilter(initialClientsFilterState));
    dispatch(setClientsCurrentPage(0));
    const payload = {
      ...initialClientsFilterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        initialClientsFilterState.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(
        executorsOptions,
        initialClientsFilterState.slpCode
      ),
    };
    reset(payload);
    onFilter(payload);
  }, [initialClientsFilterState, statusOptions, executorsOptions]);

  const handleStoreFilterLastAction = useCallback(() => {
    const clientsPageState = store.getState().page.clients;
    try {
      const lastActions = Array.isArray(clientsPageState.lastAction)
        ? clientsPageState.lastAction
        : [];

      const payload = {
        type: "clients_filter_last_action",
        oldValue: {
          currentPage: clientsPageState.currentPage,
          filter: { ...clientsPageState.filter, search: "", phone: "998" },
        },
        newValue: {},
      };

      const hasLastAction = lastActions.some(
        (action) => action.type === payload.type
      );

      const updatedLastActions = hasLastAction
        ? lastActions.map((action) =>
            action.type === payload.type
              ? { ...action, oldValue: payload.oldValue }
              : action
          )
        : [...lastActions, payload];
      dispatch(setLastAction(updatedLastActions));
    } catch (error) {
      console.error("Failed to store last action:", error);
    }
  }, []);

  const handleFilter = useCallback((data) => {
    try {
      handleStoreFilterLastAction();
      dispatch(setClientsCurrentPage(0));
      onFilter(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleRollbackFilterLastAction = useCallback(() => {
    const storedLastAction = clientsPageState.lastAction.find(
      (action) => action.type === "clients_filter_last_action"
    );
    try {
      if (storedLastAction) {
        dispatch(setClientsFilter(storedLastAction.oldValue.filter));
        dispatch(setClientsCurrentPage(storedLastAction.oldValue.currentPage));
        const payload = {
          ...storedLastAction.oldValue.filter,
          search: "",
          phone: "998",
          paymentStatus: getSelectOptionsFromKeys(
            statusOptions,
            storedLastAction.oldValue.filter.paymentStatus
          ),
          slpCode: getSelectOptionsFromKeys(
            executorsOptions,
            storedLastAction.oldValue.filter.slpCode
          ),
        };
        reset(payload);
        onFilter(payload);
      } else {
        alert("Xatolik yuz berdi!", { type: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  }, [clientsPageState, statusOptions, executorsOptions]);

  useEffect(() => {
    const startDate = moment(watchedFields.startDate, "DD.MM.YYYY");
    const endDate = moment(watchedFields.endDate, "DD.MM.YYYY");

    const isSameMonth = startDate.isSame(endDate, "month");
    if (watchedFields.startDate && !isSameMonth) {
      let newEndDate = startDate.clone().endOf("month");
      if (newEndDate.date() !== startDate.date()) {
        newEndDate = newEndDate.endOf("month");
      }
      setValue("endDate", newEndDate.format("DD.MM.YYYY"));
    }
  }, [watchedFields.startDate, setValue]);

  useEffect(() => {
    if (!_.isEmpty(executorsOptions)) {
      const formattedSlpCode = _.map(watchedFields.slpCode, "value").join(",");
      if (filterState && filterState.slpCode !== formattedSlpCode) {
        dispatch(
          setClientsFilter({
            ...filterState,
            search: "",
            phone: "998",
            slpCode: formattedSlpCode,
          })
        );
        setValue("search", "");
        setValue("phone", "998");
      }
    }
  }, [watchedFields.slpCode, executorsOptions]);

  useEffect(() => {
    if (!_.isEmpty(executorsOptions)) {
      const selectedOptions = getSelectOptionsFromKeys(
        executorsOptions,
        filterState.slpCode
      );
      const selectedPaymentStatus = getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      );

      reset({
        ...filterState,
        paymentStatus: selectedPaymentStatus,
        slpCode: selectedOptions,
      });
    }
  }, [executorsOptions]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!watchedFields.search) {
      setValue("phone", "998");
    }
  }, [watchedFields.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refs.reference && refs.reference.current.contains(event.target))
        return;
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs]);
  return {
    form: { register, control, handleSubmit },
    utils: {
      rollback: handleRollbackFilterLastAction,
      filter: handleFilter,
      clear: handleFilterClear,
    },
    toggleSearchFields,
  };
};

export default useFilter;
