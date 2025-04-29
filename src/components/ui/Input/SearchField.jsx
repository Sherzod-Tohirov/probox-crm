import { useEffect, useState, useRef } from "react";
import styles from "./input.module.scss";
import Typography from "../Typography";
import { Box, List } from "@components/ui";
import "flatpickr/dist/themes/airbnb.css";
import "react-phone-input-2/lib/style.css";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SearchField = ({ renderItem, searchText, onSearch, onSelect }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataDetails, setDataDetails] = useState({
    page: 1,
    totalPages: 0,
    total: 0,
    text: "",
  });

  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();

  // Add searchText ref to track latest value
  const searchTextRef = useRef(searchText);

  // Update ref when searchText changes
  useEffect(() => {
    searchTextRef.current = searchText;
    setIsLoading(true);
  }, [searchText]);

  // Initial search effect
  useEffect(() => {
    let timer = null;
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const currentSearchText = searchTextRef.current;
        const res = await onSearch(currentSearchText, 1, true);

        // Only update if searchText hasn't changed during fetch
        if (currentSearchText === searchTextRef.current) {
          setData(res?.data || []);
          setDataDetails(() => ({
            page: res?.totalPages > 1 ? 2 : 1,
            totalPages: res?.totalPages || 0,
            total: res?.total || 0,
            text: currentSearchText,
          }));
          setHasNextPage(res?.totalPages > 1);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchText && searchText !== dataDetails.text) {
      // Clear existing data before new search
      setData([]);
      timer = setTimeout(fetchInitial, 500);
    }

    return () => clearTimeout(timer);
  }, [searchText, onSearch]); // Add onSearch to dependencies

  // Infinite scroll effect
  useEffect(() => {
    const fetchNext = async () => {
      if (!hasNextPage || isLoading || searchText !== dataDetails.text) return;

      setIsLoading(true);
      try {
        const currentSearchText = searchTextRef.current;
        const res = await onSearch(currentSearchText, dataDetails.page, true);

        // Only update if searchText hasn't changed during fetch
        if (currentSearchText === searchTextRef.current) {
          setData((prev) => [...prev, ...(res?.data || [])]);
          setDataDetails((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
          setHasNextPage(dataDetails.page + 1 <= (res?.totalPages || 0));
        }
      } catch (err) {
        console.error("Infinite scroll error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (inView && hasNextPage && !isLoading) {
      fetchNext();
    }
  }, [inView, hasNextPage, isLoading, dataDetails.page, onSearch]);

  return (
    <motion.div
      className={styles["search-field"]}
      initial={{ opacity: 0, height: 0, scale: 0.8 }}
      animate={{ opacity: 1, height: "auto", scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}>
      {isLoading && !data.length ? (
        <Box height={"100%"} align={"center"} justify={"center"}>
          <ClipLoader color={"black"} size={20} />
        </Box>
      ) : data.length ? (
        <Box dir="column" pos={"relative"} gap={1}>
          <List
            className={styles["search-field-list"]}
            items={data}
            renderItem={renderItem}
            itemClassName={styles["search-field-item"]}
            onSelect={onSelect}
          />
          {/* 👇 ref attached here to observe visibility */}
          <div ref={ref} className={styles["infinite-loader"]}>
            {isLoading && <ClipLoader color="black" size={20} />}
          </div>
        </Box>
      ) : (
        <Box height={"100%"} align={"center"} justify={"center"}>
          <Typography element="span" className={styles["search-field-empty"]}>
            Hech narsa topilmadi.
          </Typography>
        </Box>
      )}
    </motion.div>
  );
};

export default SearchField;
