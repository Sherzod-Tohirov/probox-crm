import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../input.module.scss';
import Typography from '../../Typography';
import { Box, List } from '@components/ui';
import 'flatpickr/dist/themes/airbnb.css';
import 'react-phone-input-2/lib/style.css';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useTheme from '@/hooks/useTheme';

const SearchField = ({
  renderItem,
  searchText,
  onSearch,
  onSelect,
  inputRef,
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataDetails, setDataDetails] = useState({
    page: 1,
    totalPages: 0,
    total: 0,
    text: '',
  });
  const { currentTheme } = useTheme();
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  // Add searchText ref to track latest value
  const searchTextRef = useRef(searchText);

  // Calculate position based on input element
  useEffect(() => {
    if (!inputRef?.current) return;

    const calculatePosition = () => {
      const rect = inputRef.current.getBoundingClientRect();
      const gap = 4;

      setPosition({
        top: rect.bottom + gap,
        left: rect.left,
        width: rect.width,
      });
    };

    calculatePosition();
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [inputRef, searchText]);

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
        console.error('Search error:', err);
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
        console.error('Infinite scroll error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (inView && hasNextPage && !isLoading) {
      fetchNext();
    }
  }, [inView, hasNextPage, isLoading, dataDetails.page, onSearch]);

  const dropdownContent = (
    <motion.div
      className={styles['search-field']}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading && !data.length ? (
        <Box height="100%" align="center" justify="center">
          <ClipLoader
            color={currentTheme === 'dark' ? 'white' : 'black'}
            size={20}
          />
        </Box>
      ) : data.length ? (
        <Box dir="column" pos="relative" gap={1}>
          <List
            className={styles['search-field-list']}
            items={data}
            renderItem={(item) => renderItem(item, searchText)}
            itemClassName={styles['search-field-item']}
            onSelect={onSelect}
          />
          {/* 👇 ref attached here to observe visibility */}
          <div ref={ref} className={styles['infinite-loader']}>
            {isLoading && <ClipLoader color="black" size={20} />}
          </div>
        </Box>
      ) : (
        <Box height="100%" align="center" justify="center">
          <Typography element="span" className={styles['search-field-empty']}>
            Hech narsa topilmadi.
          </Typography>
        </Box>
      )}
    </motion.div>
  );

  return createPortal(dropdownContent, document.body);
};

export default SearchField;
