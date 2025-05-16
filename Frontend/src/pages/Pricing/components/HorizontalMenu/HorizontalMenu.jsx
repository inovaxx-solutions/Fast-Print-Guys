import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './HorizontalMenu.css';
import calendar from '../../../../assets/calendar.png';
import comicbook from '../../../../assets/comicbook.png';
import ebook from '../../../../assets/ebook.png';
import magazine from '../../../../assets/magazine.png';
import photobook from '../../../../assets/photobook.png';
import printbook from '../../../../assets/printbook.png';
import yearbook from '../../../../assets/yearbook.png';
import journal from '../../../../assets/journal.png';
import artbook from '../../../../assets/artbook.png';

const menuItems = [
    { id: 'art-book', icon: artbook, label: 'Art Book' },
    { id: 'comic-book', icon: comicbook, label: 'Comic Book' },
    { id: 'magazine', icon: magazine, label: 'Magazine' },
    { id: 'print-book', icon: printbook, label: 'Print Book' },
    { id: 'yearbook', icon: yearbook, label: 'Yearbook' },
    { id: 'calendar', icon: calendar, label: 'Calendar' },
    { id: 'photo-book', icon: photobook, label: 'Photo Book' },
    { id: 'ebook', icon: ebook, label: 'Ebook' },
    { id: 'journal', icon: journal, label: 'Journal' },
];

const DEFAULT_SELECTED_ITEM = 'print-book';

const HorizontalMenu = ({ onItemSelected = () => {} }) => {
    const [selectedItem, setSelectedItem] = useState(DEFAULT_SELECTED_ITEM);
    const [isContainerScrollable, setIsContainerScrollable] = useState(false);
    const menuRef = useRef(null);

    const checkContainerScrollable = useCallback(() => {
        const element = menuRef.current;
        if (element) {
            // Is the total content width greater than the visible area width?
            // Add a small buffer (e.g., 1px) for calculation stability
            const scrollable = element.scrollWidth > element.clientWidth + 1;
            setIsContainerScrollable(scrollable);
            // console.log(`Check Scrollable: ${scrollable}, scrollW=${element.scrollWidth}, clientW=${element.clientWidth}`); // Debug log
        } else {
            setIsContainerScrollable(false);
        }
    }, []);

    // Note: Listening to 'scroll' isn't strictly necessary for this check,
    // but doesn't hurt and covers edge cases where scrollWidth might change dynamically.
    useEffect(() => {
        const menuElement = menuRef.current;
        if (!menuElement) return;

        const timerId = setTimeout(checkContainerScrollable, 50); // Initial check delay
        const resizeObserver = new ResizeObserver(checkContainerScrollable);
        resizeObserver.observe(menuElement);
        menuElement.addEventListener('scroll', checkContainerScrollable, { passive: true }); // Keep listener just in case
        window.addEventListener('resize', checkContainerScrollable);

        return () => {
            clearTimeout(timerId);
            resizeObserver.disconnect();
            if (menuElement) menuElement.removeEventListener('scroll', checkContainerScrollable);
            window.removeEventListener('resize', checkContainerScrollable);
        };
    }, [checkContainerScrollable]);
    useEffect(() => {
        if (menuRef.current && selectedItem) {
            const selectedElement = menuRef.current.querySelector(`#menu-item-${selectedItem}`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
                // Optional: Re-check container scrollable state after programmatic scroll
                // Usually not needed unless items change size on selection.
                 setTimeout(checkContainerScrollable, 350);
            }
        }
    }, [selectedItem, checkContainerScrollable]);

    const handleArrowNavigation = (direction) => {
        const currentIndex = menuItems.findIndex(item => item.id === selectedItem);
        if (currentIndex === -1) return;
        let nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < menuItems.length) {
            const newItem = menuItems[nextIndex];
            setSelectedItem(newItem.id);
            onItemSelected(newItem.id);
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItem(itemId);
        onItemSelected(itemId);
    };

    const currentSelectedIndex = menuItems.findIndex(item => item.id === selectedItem);
    const canNavigateLeft = currentSelectedIndex > 0;
    const canNavigateRight = currentSelectedIndex < menuItems.length - 1;

    return (
        <div className="horizontal-menu-wrapper">
            <button
                className={`scroll-button left ${!isContainerScrollable ? 'hidden' : ''}`}
                onClick={() => handleArrowNavigation('left')}
                aria-label="Select previous item"
                disabled={!canNavigateLeft}
            >
                <FiChevronLeft />
            </button>

            <div className="menu-items-container" ref={menuRef}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        id={`menu-item-${item.id}`}
                        className={`menu-item ${selectedItem === item.id ? 'selected' : ''}`}
                        onClick={() => handleSelectItem(item.id)}
                        aria-pressed={selectedItem === item.id}
                    >
                        <img src={item.icon} alt="" className="menu-item-icon" />
                        <span className="menu-item-label">{item.label}</span>
                    </button>
                ))}
            </div>
            <button
                className={`scroll-button right ${!isContainerScrollable ? 'hidden' : ''}`}
                onClick={() => handleArrowNavigation('right')}
                aria-label="Select next item"
                disabled={!canNavigateRight}
            >
                <FiChevronRight />
            </button>
        </div>
    );
};

export default HorizontalMenu;