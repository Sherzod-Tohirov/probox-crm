import moment from "moment";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import MessengerModal from "@components/ui/Messenger/MessengerModal";

import { Button, Status, List, Box } from "@components/ui";

import useAuth from "@hooks/useAuth";
import useFetchCurrency from "@hooks/data/useFetchCurrency";
import useFetchExecutors from "@hooks/data/useFetchExecutors";
import useFetchMessages from "@hooks/data/useFetchMessages";

import { formatToReadablePhoneNumber } from "@utils/formatPhoneNumber";
import formatterCurrency from "@utils/formatterCurrency";
import formatDate from "@utils/formatDate";
import useMessengerActions from "@hooks/useMessengerActions";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentClient } from "@store/slices/clientsPageSlice";
const CommentsCell = ({ column }) => {
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { currentClient } = useSelector((state) => state.page.clients);
  const buttonRef = useRef(null);
  const modalRef = useRef(null);
  const enterTimer = useRef(null);
  const leaveTimer = useRef(null);
  const dispatch = useDispatch();

  const { data: messages, isLoading } = useFetchMessages({
    enabled: showModal,
    docEntry: currentClient?.["DocEntry"],
    installmentId: currentClient?.["InstlmntID"],
  });

  const { send } = useMessengerActions();

  // Calculate modal position
  const calculateModalPosition = () => {
    if (!buttonRef.current) return { top: 0, left: 0 };

    const boundaries = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const modalHeight = modalRef.current?.offsetHeight || 300; // Estimate or measure modal height
    const scrollY = window.scrollY;

    // Vertical position: below the button by default
    let top = boundaries.bottom + scrollY + 10; // 10px offset below button

    // Adjust if modal would overflow bottom of viewport
    const spaceBelow = windowHeight - boundaries.bottom;
    if (spaceBelow < modalHeight && boundaries.top > modalHeight) {
      // Show above button if there's not enough space below but enough above
      top = boundaries.top + scrollY - modalHeight - 10; // 10px above button
    }

    // Horizontal position: align modal's right edge near button's left edge
    const modalWidth = modalRef.current?.offsetWidth || 300; // Estimate or measure modal width
    let left = boundaries.left - modalWidth - 10; // 10px offset to the left of button

    // Prevent modal from overflowing left edge
    const minLeft = 10; // Minimum margin from left edge
    left = Math.max(minLeft, left);

    return { top, left };
  };

  // Update position on mouse enter
  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current); // Cancel pending close
    setPosition(calculateModalPosition());
    enterTimer.current = setTimeout(() => {
      dispatch(setCurrentClient(column));
      setShowModal(true);
    }, 100); // Delay open
  };

  // Close modal on mouse leave
  const handleMouseLeave = () => {
    clearTimeout(enterTimer.current); // Cancel pending open
    leaveTimer.current = setTimeout(() => {
      setShowModal(false);
    }, 300); // Delay close
  };

  // Update position on scroll or resize when modal is open
  useEffect(() => {
    if (!showModal) return;

    const handleScrollOrResize = () => {
      setPosition(calculateModalPosition());
    };

    // Debounce scroll and resize events
    let timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScrollOrResize, 50);
    };

    window.addEventListener("scroll", debouncedUpdate);
    window.addEventListener("resize", debouncedUpdate);

    // Initial position update
    handleScrollOrResize();

    return () => {
      window.removeEventListener("scroll", debouncedUpdate);
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeout);
    };
  }, [showModal]);

  const wrapperStyles = useMemo(
    () => ({
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <motion.div
      style={wrapperStyles}
      id="messenger-modal"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Button ref={buttonRef} icon="messenger" variant="text" />
      <AnimatePresence>
        {showModal && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              zIndex: 99999999,
              pointerEvents: "auto",
            }}>
            <MessengerModal
              messages={messages || []}
              onSendMessage={send}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const useTableColumns = () => {
  const { data: executors } = useFetchExecutors();
  const { data: currency } = useFetchCurrency();
  const { user } = useAuth();
  const clientsTableColumns = useMemo(
    () => [
      {
        key: "CardName",
        title: "FIO",
        width: "24%",
        minWidth: "200px",
        icon: "avatarFilled",
      },
      {
        key: "Phone1",
        title: "Telefon",
        renderCell: (column) => {
          if (!column?.["Phone1"]) return "-";
          return formatToReadablePhoneNumber(column["Phone1"]);
        },
        width: "8%",
        minWidth: "100px",
        icon: "telephoneFilled",
      },
      { key: "Dscription", title: "Mahsulot", width: "15%", icon: "products" },
      {
        key: "InsTotal",
        title: "To'lov",
        renderCell: (column) => {
          const SUM = column.InsTotal * currency?.["Rate"];
          return (
            (
              <Box gap={1}>
                <span>{formatterCurrency(column.InsTotal, "USD")} </span>
                <span style={{ fontWeight: 900, color: "steelblue" }}>
                  ({formatterCurrency(SUM || 0, "UZS")})
                </span>
              </Box>
            ) || "Unknown"
          );
        },
        width: "14%",
        minWidth: "120px",
        icon: "income",
      },
      {
        key: "PaidToDate",
        title: "To'landi",
        renderCell: (column) => {
          const SUM = column.PaidToDate * currency?.["Rate"];
          return (
            (
              <Box gap={1}>
                <span>{formatterCurrency(column.PaidToDate, "USD")} </span>
                <span style={{ fontWeight: 900, color: "steelblue" }}>
                  ({formatterCurrency(SUM || 0, "UZS")})
                </span>
              </Box>
            ) || "Unknown"
          );
        },
        width: "14%",
        icon: "income",
      },
      {
        key: "status",
        title: "Holati",
        renderCell: (column) => {
          let status = "unpaid";

          const statusCalc =
            parseFloat(column.InsTotal) - parseFloat(column.PaidToDate);
          if (statusCalc > 0 && statusCalc < column.InsTotal)
            status = "partial";
          if (statusCalc === 0) status = "paid";

          return <Status status={status} />;
        },
        width: "6%",
        icon: "calendarFact",
      },

      {
        key: "executor",
        title: "Ijrochi",
        renderCell: (column) => {
          if (!column.SlpCode) return "-";
          if (!executors) return "-";

          const executor = executors.find(
            (executor) => Number(executor.SlpCode) === Number(column.SlpCode)
          );
          if (!executor) return "-";

          if (user.SlpCode === executor?.SlpCode) return "Siz";
          return executor.SlpName || "-";
        },
        width: "8%",
        icon: "calendarFact",
      },
      {
        key: "comments",
        width: "3%",
        title: "Xabarlar",
        renderCell: (column) => <CommentsCell column={column} />,
        width: "2%",
        icon: "messengerFilled",
      },
      {
        key: "term",
        title: "Muddati",
        renderCell: (column) => {
          if (!column.DueDate) return "Unknown";
          return moment(column.DueDate).format("DD.MM.YYYY");
        },
        width: "6%",
        icon: "calendar",
      },
      {
        key: "NewDueDate",
        title: "Kelishildi",
        width: "15%",
        renderCell: (column) => {
          if (!column.NewDueDate) return "-";
          if (moment(column.NewDueDate, "DD.MM.YYYY", true).isValid())
            return column.NewDueDate;
          return formatDate(column.NewDueDate);
        },
        icon: "calendar",
      },
    ],
    [executors, user.SlpCode]
  );

  const clientPageTableColumns = useMemo(
    () => [
      {
        key: "InstlmntID",
        title: "ID",
        width: "1%",
        icon: "barCodeFilled",
        cellStyle: {
          textAlign: "center",
          outline: "1px solid rgba(0,0,0,0.05)",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        },
      },
      {
        key: "PaysList",
        title: "To'lovlar ro'yhati",
        width: "18%",
        renderCell: (column) => {
          if (!column.PaysList) return "-";
          return (
            <List
              // layout
              itemProps={
                {
                  // initial: { scale: 0 },
                  // animate: { scale: 1 },
                  // exit: { scale: 0 },
                  // transition: { duration: 0.3, ease: "easeInOut", stiffness: 100000 },
                }
              }
              items={column.PaysList}
              isCollapsible={true}
              renderItem={(item) => {
                return (
                  <Box
                    // layout
                    key={item.AcctName}
                    align="center"
                    justify="start"
                    style={{
                      padding: "0.2rem",
                    }}>
                    {item.AcctName && item.SumApplied
                      ? `Sanasi: ${formatDate(item.DocDate)} => ${
                          item.AcctName
                        } - ${formatterCurrency(item.SumApplied, "USD")}`
                      : "-"}
                  </Box>
                );
              }}
            />
          );
        },
        icon: "calendarFact",
      },

      {
        key: "InsTotal",
        title: "Jami summa",
        width: "7%",
        renderCell: (column) => {
          if (!column.InsTotal) return "0$";
          return formatterCurrency(column.InsTotal, "USD");
        },
        icon: "income",
      },
      {
        key: "PaidToDate",
        title: "To'landi",
        width: "7%",
        renderCell: (column) => {
          if (!column.PaidToDate) return "0$";
          return formatterCurrency(column.PaidToDate, "USD");
        },
        icon: "income",
      },
      {
        key: "DueDate",
        title: "Muddati",
        width: "10%",
        renderCell: (column) => {
          if (!column.DueDate) return "-";
          if (moment(column.DueDate, "DD.MM.YYYY", true).isValid())
            return column.DueDate;
          return formatDate(column.DueDate);
        },
        icon: "calendar",
      },
      {
        key: "DueDate",
        title: "To'lovdagi kechikish",
        width: "10%",
        renderCell: (column) => {
          if (!column.DueDate) return "-";

          const payslist = (column.PaysList || []).sort((a, b) => {
            return moment(a.DocDate).diff(moment(b.DocDate), "days");
          });

          const lastPaymentDate = payslist[payslist.length - 1]?.DocDate;
          if (!lastPaymentDate) return "-";
          const diff = moment(lastPaymentDate).diff(
            moment(column.DueDate),
            "days"
          );
          const isAllPaid = payslist.reduce((acc, list) => {
            return acc + (Number(list.SumApplied) || 0);
          }, 0);

          if (isAllPaid < column.InsTotal) {
            return <span>{`To'liq emas`}</span>;
          }

          if (diff <= 0) {
            return (
              <span style={{ color: "#027243" }}>
                {diff < 0
                  ? `${Math.abs(diff)}-kun oldin to'landi`
                  : "O'z vaqtida to'landi"}
              </span>
            );
          }
          return (
            <span
              style={{
                color: "#d51629",
              }}>{`${diff}-kun kechikib to'landi`}</span>
          );
        },
        icon: "calendar",
      },
    ],
    []
  );

  return { clientsTableColumns, clientPageTableColumns };
};

export default useTableColumns;
